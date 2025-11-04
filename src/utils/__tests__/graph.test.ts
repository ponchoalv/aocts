import { DirectedGraph } from '../graph';

describe('DirectedGraph', () => {
  test('should perform basic topological sort', () => {
    const graph = new DirectedGraph<string>();
    
    // Example from AoC 2018 Day 7
    graph.addEdge('C', 'A');
    graph.addEdge('C', 'F');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'D');
    graph.addEdge('B', 'E');
    graph.addEdge('D', 'E');
    graph.addEdge('F', 'E');
    
    const result = graph.topologicalSort();
    expect(result.join('')).toBe('CABDFE');
  });
  
  test('should handle parallel topological sort', () => {
    const graph = new DirectedGraph<string>();
    
    graph.addEdge('C', 'A');
    graph.addEdge('C', 'F');
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'D');
    graph.addEdge('B', 'E');
    graph.addEdge('D', 'E');
    graph.addEdge('F', 'E');
    
    // Test work time: A=1, B=2, C=3, etc. (base time 0 for test)
    const getWorkTime = (step: string): number => {
      return step.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    };
    
    const result = graph.parallelTopologicalSort(2, getWorkTime);
    expect(result.totalTime).toBe(15); // Expected from AoC example
  });
  
  test('should track parent-child relationships', () => {
    const graph = new DirectedGraph<string>();
    
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    
    expect(Array.from(graph.getChildren('A')).sort()).toEqual(['B', 'C']);
    expect(Array.from(graph.getParents('B'))).toEqual(['A']);
    expect(Array.from(graph.getParents('D'))).toEqual(['B']);
    expect(graph.getInDegree('A')).toBe(0);
    expect(graph.getInDegree('B')).toBe(1);
    expect(graph.getOutDegree('A')).toBe(2);
    expect(graph.getOutDegree('D')).toBe(0);
  });
  
  test('should identify roots and leaves', () => {
    const graph = new DirectedGraph<string>();
    
    graph.addEdge('A', 'B');
    graph.addEdge('C', 'B');
    graph.addEdge('B', 'D');
    graph.addEdge('B', 'E');
    
    expect(graph.getRoots().sort()).toEqual(['A', 'C']);
    expect(graph.getLeaves().sort()).toEqual(['D', 'E']);
  });
  
  test('should detect cycles', () => {
    const graph = new DirectedGraph<string>();
    
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A'); // Creates cycle
    
    expect(graph.isDAG()).toBe(false);
    expect(() => graph.topologicalSort()).toThrow('Graph contains a cycle');
  });
  
  test('should find paths', () => {
    const graph = new DirectedGraph<string>();
    
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('A', 'D');
    
    expect(graph.hasPath('A', 'C')).toBe(true);
    expect(graph.hasPath('A', 'D')).toBe(true);
    expect(graph.hasPath('C', 'A')).toBe(false);
    expect(graph.hasPath('D', 'C')).toBe(false);
  });
});