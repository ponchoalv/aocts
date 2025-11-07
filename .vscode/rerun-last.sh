#!/bin/bash

# Re-run last AoC solution
if [ -f .vscode/last-run.env ]; then
    source .vscode/last-run.env
    echo "🔄 Re-running: Year $LAST_YEAR Day $LAST_DAY"
    npx tsx src/runner.ts $LAST_YEAR $LAST_DAY
else
    echo "❌ No previous run found."
    echo "Please use the '🎄 Solve AoC (with input)' task first."
    exit 1
fi