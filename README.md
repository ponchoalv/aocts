# 🎄 Advent of Code TypeScript Skeleton

A high-performance TypeScript skeleton project for solving [Advent of Code](https://adventofcode.com/) challenges with a focus on speed and clean code organization.

## ✨ Features

- **🚀 High Performance**: Optimized utilities and data structures for competitive programming
- **📁 Clean Structure**: Year and day-based organization
- **⚡ Fast Development**: Quick solution template generation
- **📊 Benchmarking**: Built-in performance measurement and comparison
- **🧪 Testing**: Integrated test case support
- **🔧 Modern TypeScript**: Latest TS features with strict configuration

## 🚀 Quick Start

### Installation

```bash
# Clone or download this template
npm install
```

### Create a New Day

```bash
# Generate structure for a new day
npm run new-day 2024 1
```

This creates:
- `src/2024/day01/solution.ts` - Solution template
- `src/2024/day01/input.txt` - Your puzzle input
- `src/2024/day01/test.txt` - Test cases
- `src/2024/day01/README.md` - Problem notes

### Solve a Problem

1. Add your puzzle input to `input.txt`
2. Add test cases to `test.txt`
3. Implement your solution in `solution.ts`
4. Run your solution:

```bash
npm run solve 2024 1
```

## 📦 Project Structure

```
src/
├── utils/                 # High-performance utility libraries
│   ├── input.ts          # Input parsing utilities
│   ├── math.ts           # Mathematical operations
│   ├── grid.ts           # 2D grid manipulation
│   ├── graph.ts          # Graph algorithms (BFS, DFS, Dijkstra, A*)
│   ├── collections.ts    # Optimized data structures
│   └── strings.ts        # String processing utilities
├── templates/
│   └── solution.ts       # Base solution template
├── 2024/                 # Year-based organization
│   └── day01/
│       ├── solution.ts   # Your solution
│       ├── input.txt     # Puzzle input
│       ├── test.txt      # Test cases
│       └── README.md     # Problem notes
└── runner.ts             # Solution runner with timing
```

## 🛠️ Available Scripts

```bash
# Development
npm run build              # Build TypeScript
npm run dev               # Build with watch mode

# Solutions
npm run solve <year> <day> # Run a specific solution
npm run new-day <year> <day> # Create new day structure

# Performance
npm run benchmark <year>   # Benchmark all days in a year
npm run benchmark <year> <day> # Benchmark specific day

# Testing
npm test                  # Run tests
```

## 🏎️ Performance-Focused Utilities

### Input Parsing
```typescript
import { InputParser } from '@utils/input';

const lines = InputParser.lines(input);
const numbers = InputParser.extractNumbers(input);
const grid = InputParser.grid(input);
```

### Mathematical Operations
```typescript
import { MathUtils } from '@utils/math';

const gcd = MathUtils.gcd(a, b);
const primes = MathUtils.sieveOfEratosthenes(1000);
const dist = MathUtils.manhattanDistance(x1, y1, x2, y2);
```

### Graph Algorithms
```typescript
import { Graph, PriorityQueue } from '@utils/graph';

const graph = new Graph();
graph.addEdge(from, to, weight);
const { distances } = graph.dijkstra(start);
```

### Grid Operations
```typescript
import { Grid, GridUtils } from '@utils/grid';

const grid = GridUtils.fromString(input);
const neighbors = grid.getAdjacent4(x, y);
GridUtils.floodFill(grid, x, y, newValue);
```

### Data Structures
```typescript
import { DisjointSet, Trie, Counter } from '@utils/collections';

const unionFind = new DisjointSet(size);
const trie = new Trie();
const counter = new Counter(['a', 'b', 'a']);
```

### String Processing
```typescript
import { StringUtils, RollingHash } from '@utils/strings';

const occurrences = StringUtils.findAllOccurrences(text, pattern);
const hash = new RollingHash(substring);
```

## 📝 Solution Template

Each solution extends the `BaseSolution` class:

```typescript
import { BaseSolution } from '../../templates/solution.js';

export default class Day01Solution extends BaseSolution {
  part1(input: string): string | number {
    const lines = this.lines(input);
    // Your solution here
    return result;
  }

  part2(input: string): string | number {
    const lines = this.lines(input);
    // Your solution here
    return result;
  }
}
```

## 🎯 Performance Tips

1. **Use Typed Arrays**: For numerical computations, prefer `Int32Array` or `Float64Array`
2. **Avoid Repeated Allocations**: Reuse arrays and objects when possible
3. **Choose Right Data Structure**: Use `Set` for membership tests, `Map` for key-value pairs
4. **Optimize Inner Loops**: These get executed millions of times
5. **Use Built-in Methods**: JavaScript built-ins are highly optimized
6. **Profile Your Code**: Use the benchmark script to identify bottlenecks

## 🔧 Configuration

### TypeScript
- Target: ES2022 for modern features
- Strict mode enabled for better optimization
- Path mapping for clean imports

### Build Tool
- SWC for fast compilation
- Source maps for debugging
- Watch mode for development

## 📊 Benchmarking

The benchmark script provides detailed performance analysis:

```bash
npm run benchmark 2024
```

Output includes:
- Individual part timing
- Total execution time
- Performance analysis (fastest/slowest)
- Optimization suggestions

## 🧪 Testing

Write tests for your utility functions:

```typescript
import { MathUtils } from '../src/utils/math';

describe('MathUtils', () => {
  test('gcd calculation', () => {
    expect(MathUtils.gcd(12, 8)).toBe(4);
  });
});
```

## 🎯 Goals

This skeleton is designed to help you:
- ⚡ Write fast, efficient solutions
- 📈 Improve your algorithmic thinking
- 🏆 Compete on leaderboards
- 📚 Learn advanced TypeScript patterns
- 🔧 Build reusable utility libraries

## 📄 License

MIT License - feel free to use this template for your Advent of Code journey!

---

Happy coding! 🎄✨