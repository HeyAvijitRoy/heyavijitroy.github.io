# Enable C++ Compiling in VS Code on Windows (MinGW‑w64)

This guide explains how to set up **Visual Studio Code** with **MinGW‑w64 (GCC + GDB)** to compile and debug C++ programs on Windows.

---

## Prerequisites

- Windows 11 (Windows 10 also works). On Windows 11 on Arm (e.g., Snapdragon laptops), the x64 toolchain below runs through Windows’ built-in x64 emulation.
- [Visual Studio Code](https://code.visualstudio.com/) installed
- [MinGW‑w64](https://www.mingw-w64.org/) installed (via MSYS2 or standalone build)

---

## Step 1: Install the C/C++ extension

1. Open VS Code.
2. Press `Ctrl+Shift+X` to open Extensions.
3. Search for **C/C++** (by Microsoft).
4. Click **Install**.
5. Restart VS Code.

---

## Step 2: Install MinGW‑w64 (compiler + debugger)

### Option A: Install via MSYS2 (recommended)
1. Download and run the installer from [msys2.org](https://www.msys2.org/). Keep the default install folder, `C:\msys64`.
2. From the Start menu, open **MSYS2 UCRT64** and update packages:
   ```bash
   pacman -Syu
   ```
   If the terminal closes to finish the update, reopen **MSYS2 UCRT64** and run `pacman -Syu` again.
3. Install the toolchain (GCC, GDB, and related tools). Press **Enter** to accept the default selection, then **Y** to confirm:
   ```bash
   pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain
   ```
4. Add `C:\msys64\ucrt64\bin` to your **PATH**. On Windows 11: open Start, search for **Edit environment variables for your account**, select **Path** under User variables, click **Edit** → **New**, paste the folder, then click **OK** in each dialog.

> Older guides use the `mingw64` environment (`mingw-w64-x86_64-*` packages and `C:\msys64\mingw64\bin`). It still works; UCRT64 is MSYS2’s current default. If you already installed `mingw64`, either keep it and use `C:\msys64\mingw64\bin` everywhere this guide says `ucrt64`, or switch fully to UCRT64. Don’t put both on PATH.

### Option B: Standalone MinGW‑w64 build
- [mingw-w64.org](https://www.mingw-w64.org/) doesn’t host an installer itself; its downloads page links to prebuilt toolchains. A common choice is [WinLibs](https://winlibs.com/) (pick the UCRT, Win64 zip).
- Extract it to a folder without spaces, such as `C:\mingw64`, then add `C:\mingw64\bin` to PATH as above.
- In Steps 6 and 7, replace `C:/msys64/ucrt64/bin` with your folder.

---

## Step 3: Verify installation

Open a **new** PowerShell or Command Prompt window (windows opened before you changed PATH won’t see it):

```powershell
g++ --version
gdb --version
```

You should see version info for GCC and GDB. If VS Code was already open, close it completely and reopen it so it picks up the new PATH.

---

## Step 4: Create a test project

1. Create a project folder and its `build` output folder. The `build` folder is required; `g++` won’t create it for you.
   ```powershell
   mkdir C:\cpp-hello
   cd C:\cpp-hello
   mkdir build
   ```
2. Open in VS Code:
   ```powershell
   code .
   ```
3. Create `main.cpp`:
   ```cpp
   #include <iostream>
   using namespace std;

   int main() {
       cout << "Hello, C++ from Windows with MinGW!" << endl;
       return 0;
   }
   ```

---

## Step 5: Configure build tasks (`tasks.json`)

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "shell",
      "label": "C++: Build with g++",
      "command": "g++",
      "args": [
        "-std=c++17",
        "-g",
        "main.cpp",
        "-o",
        "build\\main.exe"
      ],
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": [
        "$gcc"
      ]
    }
  ]
}
```

---

## Step 6: Configure debugging (`launch.json`)

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "C++: Debug build/main.exe (GDB)",
      "type": "cppdbg",
      "request": "launch",
      "program": "${workspaceFolder}\\build\\main.exe",
      "args": [],
      "cwd": "${workspaceFolder}",
      "preLaunchTask": "C++: Build with g++",
      "stopAtEntry": false,
      "environment": [],
      "externalConsole": false,
      "MIMode": "gdb",
      "miDebuggerPath": "C:/msys64/ucrt64/bin/gdb.exe"
    }
  ]
}
```

`"externalConsole": false` runs the program in VS Code’s integrated terminal. With `true`, it opens a separate window that closes as soon as the program ends.

---

## Step 7: Configure IntelliSense (`c_cpp_properties.json`)

Create `.vscode/c_cpp_properties.json`:

```json
{
  "version": 4,
  "configurations": [
    {
      "name": "Win32",
      "includePath": [
        "${workspaceFolder}/**"
      ],
      "defines": [
        "_DEBUG",
        "UNICODE",
        "_UNICODE"
      ],
      "compilerPath": "C:/msys64/ucrt64/bin/g++.exe",
      "cStandard": "c11",
      "cppStandard": "c++17",
      "intelliSenseMode": "windows-gcc-x64"
    }
  ]
}
```

---

## Step 8: Build and run

1. **Build:** Press `Ctrl+Shift+B`.  
   → Output: `build\main.exe`
2. **Run:**  
   ```powershell
   .\build\main.exe
   ```
   Output:
   ```
   Hello, C++ from Windows with MinGW!
   ```
3. **Debug:**  
   - Go to Run and Debug (`Ctrl+Shift+D`).  
   - Select “C++: Debug build/main.exe (GDB)”.  
   - Start debugging, set breakpoints, step through code.

---

## Step 9: Common issues

- **`g++` not found:** Ensure the MinGW‑w64 `bin` folder (e.g., `C:\msys64\ucrt64\bin`) is in PATH, then fully restart VS Code.
- **`cannot open output file build\main.exe`:** The `build` folder doesn’t exist. Run `mkdir build` in the project folder.
- **`The value of miDebuggerPath is invalid`:** Confirm `miDebuggerPath` points to a `gdb.exe` that exists, in the same folder as the `g++` you build with.
- **IntelliSense mismatch:** Update `compilerPath` in `c_cpp_properties.json` to the same `g++.exe`.
- **Spaces or OneDrive in the project path:** Keep the project in a short path without spaces, such as `C:\cpp-hello`, rather than a OneDrive-synced Documents folder.
- **Windows blocks `main.exe`:** On some Windows 11 PCs, Smart App Control or antivirus may block newly compiled, unsigned programs. Check Windows Security → App & browser control.

---

## Quick Reference

- **Build:** `Ctrl+Shift+B`
- **Run Debug:** `Ctrl+Shift+D → Start`
- **Compiler:** `g++` (MinGW‑w64)
- **Debugger:** `gdb` (MinGW‑w64)

---


**Author:** Avijit Roy  
**Institution:** John Jay College of Criminal Justice (CUNY)  
**Website:** https://www.avijitroy.com  
**GitHub:** https://github.com/HeyAvijitRoy  
**LinkedIn:** https://www.linkedin.com/in/HeyAvijitRoy/
