import { BaseSolution } from '../../templates/solution.js';
import { DirectedGraph } from '../../utils/graph.js';

export default class Day07Solution extends BaseSolution {
  private parseInput(input: string): DirectedGraph<string> {
    const graph = new DirectedGraph<string>();
    const lines = this.lines(input);
    
    for (const line of lines) {
      const match = line.match(/Step (\w) must be finished before step (\w) can begin\./);
      if (match) {
        const [, prerequisite, step] = match;
        graph.addEdge(prerequisite!, step!);
      }
    }
    
    return graph;
  }

  part1(input: string): string | number {
    const graph = this.parseInput(input);
    const order = graph.topologicalSort();
    return order.join('');
  }

  part2(input: string): string | number {
    const graph = this.parseInput(input);
    
    // Work time calculation: A=61, B=62, ..., Z=86 (60 + letter position)
    const getWorkTime = (step: string): number => {
      return 60 + (step.charCodeAt(0) - 'A'.charCodeAt(0) + 1);
    };
    
    const result = graph.parallelTopologicalSort(5, getWorkTime);
    return result.totalTime;
  }
}