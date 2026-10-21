# Enable C++ compiling in VS Code on macOS

This guide walks you through a clean, step-by-step setup to compile and debug C++ in Visual Studio Code on macOS using Clang and LLDB.

**This guide works on:**
- macOS Tahoe (26) and newer
- macOS Sequoia (15)
- macOS Sonoma (14)
- macOS Ventura (13)
- macOS Monterey (12)
- Apple Silicon (M1 and later)
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

If Terminal says the command line tools are already installed, you’re done with this step. Later updates to the tools arrive through System Settings → General → Software Update.

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
3. **Create the build directory:** Required. `clang++` won’t create it for you, and the build fails with `unable to open output file 'build/main'` if it’s missing.
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
         "type": "cppdbg",
         "request": "launch",
         "program": "${workspaceFolder}/build/main",
         "args": [],
         "cwd": "${workspaceFolder}",
         "preLaunchTask": "C++: Build with clang++",
         "stopAtEntry": false,
         "environment": [],
         "externalConsole": false,
         "MIMode": "lldb"
       }
     ]
   }
   ```

Notes:
- **"type": "cppdbg"** is the debugger provided by the C/C++ extension from Step 1; **"MIMode": "lldb"** tells it to use LLDB.
- If your program reads keyboard input (`std::cin`), set `"externalConsole": true` so it runs in a Terminal window you can type into.
- Configs using `"type": "lldb"` belong to the separate CodeLLDB extension and use different fields. Don’t mix the two formats.

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
- **`xcrun: error: invalid active developer path` after a macOS upgrade:**
  - Major macOS updates can remove the Command Line Tools. Reinstall them with `xcode-select --install`.
- **`unable to open output file 'build/main'`:**
  - The `build` folder doesn’t exist yet. Run `mkdir -p build` in the project folder.
- **`Configured debug type 'lldb' is not supported`:**
  - Your `launch.json` uses the CodeLLDB format. Use the `cppdbg` configuration from Step 5.
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
  - Keep `intelliSenseMode` as `macos-clang-arm64` (use `macos-clang-x64` on Intel Macs).
  - Avoid mixing Homebrew Intel toolchains with Apple Silicon builds.

---

## Step 10: Optional enhancements

- **Format code automatically:** The C/C++ extension already bundles clang-format. Add a `.clang-format` file to your project root and press Shift+Option+F (Format Document); the default `"C_Cpp.clang_format_style": "file"` setting picks it up.
- **Use CMake Tools:** For larger projects, install “CMake Tools” and initialize a CMake project for robust multi-file builds.
- **Unit testing:** Add frameworks like Catch2 or GoogleTest and include them in your build.

---

## Quick reference

- **Build:** Cmd+Shift+B
- **Run debug:** Cmd+Shift+D → Start
- **Compiler:** `/usr/bin/clang++`
- **Debugger:** LLDB (installed with the Xcode Command Line Tools)

---

**Author:** Avijit Roy  
**Institution:** John Jay College of Criminal Justice (CUNY)  
**Website:** https://www.avijitroy.com  
**GitHub:** https://github.com/HeyAvijitRoy  
**LinkedIn:** https://www.linkedin.com/in/HeyAvijitRoy/
