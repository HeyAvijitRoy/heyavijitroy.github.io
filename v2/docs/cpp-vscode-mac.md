# Enable C++ compiling in VS Code on macOS

This guide walks you through a clean, step-by-step setup to compile and debug C++ in Visual Studio Code on macOS using Clang and LLDB.

**This guide worns on:**
- macOS Ventura
- macOS Sonoma
- macOS Monterey
- Apple Silicon (M1/M2/M3)'
- Intel Macs

---

## Prerequisites

- **VS Code installed:** Download from the official site and install the app.
- **Basic terminal access:** You’ll use the macOS Terminal for a few commands.

VS Code does not include a compiler — Clang via Xcode CLT is what provides it.

---

## Step 1: Install the C/C++ extension

1. **Open VS Code.**
2. **Go to Extensions:** Press Shift+Cmd+X.
3. **Search and install:** Find “C/C++” by Microsoft and click Install.
4. **Restart VS Code:** Optional but helps the extension initialize cleanly.

---

## Step 2: Install the C++ compiler and tools (Clang/LLVM via Xcode CLT)

1. **Open Terminal** (Applications → Utilities → Terminal).
2. **Install Xcode Command Line Tools:**
   ```bash
   xcode-select --install
   ```
3. **Accept prompts** and wait for installation to finish.
4. **Verify Clang is available:**
   ```bash
   clang++ --version
   ```
   - You should see a version output including “Apple clang version”.

---

## Step 3: Create a test C++ project

1. **Create a project folder:**
   ```bash
   mkdir ~/cpp-hello && cd ~/cpp-hello
   ```
   ### ⚠️ If “code” command is not found
    Some macOS systems don’t have the VS Code command-line launcher enabled by default.

    Enable it in two quick steps:

    1. Open VS Code.
    2. Press **Cmd+Shift+P** → type **“shell command”** → select  
    **Shell Command: Install ‘code’ command in PATH**

    After that, the command below will work:

2. **Open the folder in VS Code:**
   ```bash
   code .
   ```
3. **Create a source file:** In VS Code, add a new file named `main.cpp`.
4. **Add sample code:**
   ```cpp
   #include <iostream>

   int main() {
       std::cout << "Hello, C++ from macOS!" << std::endl;
       return 0;
   }
   ```

---

## Step 4: Configure build tasks (tasks.json)

1. **Create a .vscode folder:** In your project, create `.vscode/`.
2. **Add tasks.json:** Create `.vscode/tasks.json` with:
   ```json
   {
     "version": "2.0.0",
     "tasks": [
       {
         "type": "shell",
         "label": "C++: Build with clang++",
         "command": "clang++",
         "args": [
           "-std=c++17",
           "-g",
           "main.cpp",
           "-o",
           "build/main"
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
3. **Create build directory:** Optional but clean.
   ```bash
   mkdir -p build
   ```

Notes:
- **-std=c++17:** Adjust to your preferred standard (`c++20`, etc.).
- **-g:** Includes debug symbols for LLDB.

---

## Step 5: Configure debugging (launch.json)

1. **Add launch.json:** Create `.vscode/launch.json` with:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "C++: Debug build/main (LLDB)",
         "type": "lldb",
         "request": "launch",
         "program": "${workspaceFolder}/build/main",
         "args": [],
         "cwd": "${workspaceFolder}",
         "preLaunchTask": "C++: Build with clang++",
         "stopOnEntry": false,
         "environment": [],
         "console": "integratedTerminal"
       }
     ]
   }
   ```

---

## Step 6: Configure IntelliSense (optional but recommended)

1. **Add c_cpp_properties.json:** Create `.vscode/c_cpp_properties.json`:
   ```json
   {
     "version": 4,
     "configurations": [
       {
         "name": "macOS",
         "compilerPath": "/usr/bin/clang++",
         "cStandard": "c11",
         "cppStandard": "c++17",
         "intelliSenseMode": "macos-clang-arm64"
       }
     ]
   }
   ```
2. **Apple Silicon vs. Intel:**
   - Apple Silicon: `macos-clang-arm64`
   - Intel: `macos-clang-x64`

---

## Step 7: Build and run

1. **Build:** Press Cmd+Shift+B (or Terminal → Run Build Task). You should see `build/main` created.
2. **Run in terminal:**
   ```bash
   ./build/main
   ```
   Output should be:
   ```
   Hello, C++ from macOS!
   ```
3. **Debug in VS Code:**
   - Go to Run and Debug (Cmd+Shift+D).
   - Select “C++: Debug build/main (LLDB)”.
   - Click Start. Set breakpoints in `main.cpp` and step through.

---

## Step 8: Add multiple files (optional)

If you add more `.cpp` files, either list them in `args` or use a wildcard with a simple build script:

- **Update tasks.json args:**
  ```json
  "args": ["-std=c++17", "-g", "*.cpp", "-o", "build/main"]
  ```
- For larger projects, consider a **Makefile** or **CMake**.

---

## Step 9: Common issues and fixes

- **Clang not found:**
  - Run the installer again:
    ```bash
    xcode-select --install
    ```
  - Check path:
    ```bash
    which clang++
    ```
- **Permission denied running build/main:**
  - Ensure executable bit is set (usually automatic). If not:
    ```bash
    chmod +x build/main
    ```
- **IntelliSense errors not matching compiler:**
  - Ensure `compilerPath` points to `/usr/bin/clang++`.
  - Align `cppStandard` with your flags (`c++17`, `c++20`).
- **Debugging doesn’t start or skips breakpoints:**
  - Confirm `-g` is in build flags.
  - Make sure `program` path in `launch.json` matches the output binary.
- **Apple Silicon architecture mismatches:**
  - Keep `intelliSenseMode` as `macos-clang-arm64`.
  - Avoid mixing Homebrew Intel toolchains with Apple Silicon builds.

---

## Step 10: Optional enhancements

- **Format code automatically:** Install “Clang-Format” and set `"C_Cpp.clang_format_style": "file"` with a `.clang-format`.
- **Use CMake Tools:** For larger projects, install “CMake Tools” and initialize a CMake project for robust multi-file builds.
- **Unit testing:** Add frameworks like Catch2 or GoogleTest and include them in your build.

---

## Quick reference

- **Build:** Cmd+Shift+B
- **Run debug:** Cmd+Shift+D → Start
- **Compiler:** `/usr/bin/clang++`
- **Debugger:** LLDB (built into macOS)

---

**Author:** Avijit Roy  
**Institution:** John Jay College of Criminal Justice (CUNY)  
**Website:** https://www.avijitroy.com  
**GitHub:** https://github.com/HeyAvijitRoy  
**LinkedIn:** https://www.linkedin.com/in/HeyAvijitRoy/
