#!/bin/bash

# Debug AoC solution with parameters
YEAR="$1"
DAY="$2"

if [ -z "$YEAR" ] || [ -z "$DAY" ]; then
    echo "Usage: $0 <year> <day>"
    echo "Example: $0 2024 1"
    exit 1
fi

echo "🐛 Debug mode: Year $YEAR Day $DAY"

# Use npx tsx with inspect-brk for debugging (waits for debugger)
echo "Starting debugger... Connect VS Code debugger to continue execution."
npx tsx --inspect-brk src/runner.ts "$YEAR" "$DAY"