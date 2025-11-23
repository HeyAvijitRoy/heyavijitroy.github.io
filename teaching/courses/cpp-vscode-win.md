# Enable C++ Compiling in VS Code on Windows (MinGW‑w64)

This guide explains how to set up **Visual Studio Code** with **MinGW‑w64 (GCC + GDB)** to compile and debug C++ programs on Windows.

---

## Prerequisites

- Windows 10/11 system
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
1. Download MSYS2 from [msys2.org](https://www.msys2.org/).
2. Open MSYS2 terminal and update packages:
   ```bash
   pacman -Syu
   ```
3. Install GCC and GDB:
   ```bash
   pacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-gdb
   ```
4. Add `C:\msys64\mingw64\bin` to your **PATH** environment variable.

### Option B: Standalone MinGW‑w64 build
- Download from [mingw-w64.org](https://www.mingw-w64.org/).
- Install and add the `bin` folder to PATH.

---

## Step 3: Verify installation

Open **PowerShell** or **Command Prompt**:

```powershell
g++ --version
gdb --version
```

You should see version info for GCC and GDB.

---

## Step 4: Create a test project

1. Create a folder:
   ```powershell
   mkdir C:\cpp-hello
   cd C:\cpp-hello
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
      "externalConsole": true,
      "MIMode": "gdb",
      "miDebuggerPath": "C:/msys64/mingw64/bin/gdb.exe"
    }
  ]
}
```

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
      "compilerPath": "C:/msys64/mingw64/bin/g++.exe",
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

- **`g++` not found:** Ensure MinGW‑w64 `bin` folder is in PATH.
- **Debugger errors:** Confirm `miDebuggerPath` points to `gdb.exe`.
- **IntelliSense mismatch:** Update `compilerPath` in `c_cpp_properties.json`.
- **Spaces in PATH:** Wrap paths in quotes in `tasks.json`.

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
