# DirectedGraph Utility

A powerful directed graph implementation with parent-child relationship tracking, perfect for dependency resolution, topological sorting, and tree problems commonly found in Advent of Code.

## Features

- **Explicit Parent-Child Tracking**: Track both incoming and outgoing edges efficiently
- **Topological Sorting**: Both simple and parallel versions with worker simulation
- **Cycle Detection**: Detect circular dependencies
- **Path Finding**: Check if paths exist between nodes
- **Degree Tracking**: Get in-degree and out-degree for any node
- **Root/Leaf Identification**: Find nodes with no parents or no children
- **Generic Type Support**: Works with any comparable type (string, number, etc.)

## Usage Examples

### Basic Dependency Graph

```typescript
import { DirectedGraph } from './utils/graph.js';

const graph = new DirectedGraph<string>();

// Add dependencies: A must come before B
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'D');

// Get topological order
const order = graph.topologicalSort(); // ['A', 'B', 'C', 'D'] or ['A', 'C', 'B', 'D']
```

### Parallel Task Scheduling (AoC 2018 Day 7)

```typescript
// Simulate multiple workers with different task durations
const getWorkTime = (task: string) => task.charCodeAt(0) - 'A'.charCodeAt(0) + 1;

const result = graph.parallelTopologicalSort(5, getWorkTime);
console.log(`Total time: ${result.totalTime}`);
console.log(`Completion order: ${result.order.join('')}`);
```

### Analyzing Graph Structure

```typescript
// Get graph insights
const stats = graph.getStats();
console.log(`Nodes: ${stats.nodeCount}, Edges: ${stats.edgeCount}`);
console.log(`Starting points: ${stats.roots.join(', ')}`);
console.log(`End points: ${stats.leaves.join(', ')}`);

// Check relationships
console.log(`Children of A: ${Array.from(graph.getChildren('A')).join(', ')}`);
console.log(`Parents of D: ${Array.from(graph.getParents('D')).join(', ')}`);
console.log(`A can reach D: ${graph.hasPath('A', 'D')}`);
```

### Cycle Detection

```typescript
// Check if dependencies are valid (no circular references)
if (!graph.isDAG()) {
  console.log('Error: Circular dependency detected!');
}
```

## Common AoC Use Cases

1. **Dependency Resolution** (2018 Day 7): Task ordering with prerequisites
2. **Tree Problems**: Parent-child relationships in file systems or organizational structures
3. **State Machines**: Transitions between states with dependencies
4. **Build Systems**: Compilation order with module dependencies
5. **Recipe Crafting**: Item creation with ingredient requirements
6. **Network Routing**: Path finding in directed networks

## Performance

- **Memory**: O(V + E) space complexity
- **Topological Sort**: O(V + E) time complexity
- **Path Finding**: O(V + E) worst case with early termination
- **Parallel Simulation**: Efficient worker management with priority queues

The implementation uses optimized data structures (Maps and Sets) for fast lookups and maintains both forward and backward edge references for efficient traversal in both directions.
