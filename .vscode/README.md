# VS Code Tasks for Advent of Code

This directory contains VS Code tasks and configuration for the Advent of Code TypeScript project.

## Available Tasks

You can run these tasks via:
- **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`): Type "Tasks: Run Task"
- **Terminal Menu**: Terminal → Run Task
- **Keyboard Shortcuts** (see keybindings.json)

### 🎄 Solve AoC (with input)
- **Description**: Run a specific Advent of Code solution
- **Shortcut**: `Ctrl+Shift+R` (Windows/Linux) / `Cmd+Shift+R` (Mac)
- **Behavior**: 
  - Prompts for year (e.g., 2024)
  - Prompts for day (1-25)
  - Runs `npx tsx src/runner.ts <year> <day>`
  - Saves the parameters for re-running

### 🔄 Re-run last AoC solution
- **Description**: Re-runs the last executed solution without prompting
- **Shortcut**: `Ctrl+R` (Windows/Linux) / `Cmd+R` (Mac)
- **Behavior**: 
  - Uses stored year/day from last run
  - Shows error if no previous run exists

### 🏗️ Build project
- **Description**: Compiles TypeScript to JavaScript
- **Shortcut**: `Ctrl+Shift+B` (Windows/Linux) / `Cmd+Shift+B` (Mac)
- **Command**: `npm run build`

### 🧪 Run tests
- **Description**: Runs Jest test suite
- **Shortcut**: `Ctrl+Shift+T` (Windows/Linux) / `Cmd+Shift+T` (Mac)
- **Command**: `npm test`

### 📊 Run benchmark
- **Description**: Performance benchmarking of solutions
- **Command**: `npm run benchmark`

### 🆕 Create new day
- **Description**: Scaffolds a new day's solution template
- **Command**: `npm run new-day`

## Files

- **tasks.json**: Task definitions and input prompts
- **keybindings.json**: Keyboard shortcuts for tasks
- **settings.json**: Project-specific VS Code settings
- **launch.json**: Debug configurations for VS Code
- **solve-aoc.sh**: Script for running AoC solutions with parameter storage
- **rerun-last.sh**: Script for re-running the last solution
- **debug-aoc.sh**: Script for debugging solutions with inspector
- **last-run.env**: Stores last executed year/day (gitignored)

## Debugging

Use the **Run and Debug** panel (Ctrl+Shift+D / Cmd+Shift+D) or:

1. **🐛 Debug AoC Solution**: Debug with year/day prompts
2. **🔄 Debug Last AoC Solution**: Debug the working 2018 day 7 solution
3. **🔄 Debug Current Solution**: Debug 2022 day 15 specifically

Set breakpoints in your solution files and the debugger will pause execution there.

## Quick Start

1. Press `Ctrl+Shift+R` / `Cmd+Shift+R` to solve a specific day
2. Enter the year (e.g., 2024) and day (e.g., 7)
3. View the results in the terminal
4. Press `Ctrl+R` / `Cmd+R` to re-run the same solution anytime

The tasks automatically handle TypeScript compilation and execution using `tsx`.