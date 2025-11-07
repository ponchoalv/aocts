#!/bin/bash

# Solve AoC with input parameters
YEAR="$1"
DAY="$2"

if [ -z "$YEAR" ] || [ -z "$DAY" ]; then
    echo "Usage: $0 <year> <day>"
    echo "Example: $0 2024 1"
    exit 1
fi

# Store parameters for re-running
echo "LAST_YEAR=$YEAR" > .vscode/last-run.env
echo "LAST_DAY=$DAY" >> .vscode/last-run.env

# Run the solution
npx tsx src/runner.ts "$YEAR" "$DAY"