/**
 * High-performance graph algorithms for Advent of Code
 */

export interface Edge {
  to: number;
  weight: number;
}

export class Graph {
  private adjacencyList: Map<number, Edge[]>;
  private nodeCount: number;

  constructor(nodeCount: number = 0) {
    this.adjacencyList = new Map();
    this.nodeCount = nodeCount;
  }

  /**
   * Add an edge to the graph
   */
  addEdge(from: number, to: number, weight: number = 1): void {
    if (!this.adjacencyList.has(from)) {
      this.adjacencyList.set(from, []);
    }
    this.adjacencyList.get(from)!.push({ to, weight });
    this.nodeCount = Math.max(this.nodeCount, from + 1, to + 1);
  }

  /**
   * Add a bidirectional edge
   */
  addBidirectionalEdge(a: number, b: number, weight: number = 1): void {
    this.addEdge(a, b, weight);
    this.addEdge(b, a, weight);
  }

  /**
   * Get neighbors of a node
   */
  getNeighbors(node: number): Edge[] {
    return this.adjacencyList.get(node) ?? [];
  }

  /**
   * BFS traversal
   */
  bfs(start: number, target?: number): { distances: Map<number, number>; parents: Map<number, number> } {
    const distances = new Map<number, number>();
    const parents = new Map<number, number>();
    const queue: number[] = [start];
    
    distances.set(start, 0);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (target !== undefined && current === target) {
        break;
      }
      
      for (const edge of this.getNeighbors(current)) {
        if (!distances.has(edge.to)) {
          distances.set(edge.to, distances.get(current)! + 1);
          parents.set(edge.to, current);
          queue.push(edge.to);
        }
      }
    }
    
    return { distances, parents };
  }

  /**
   * DFS traversal
   */
  dfs(start: number, visited?: Set<number>): number[] {
    if (!visited) visited = new Set();
    const result: number[] = [];
    const stack: number[] = [start];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      result.push(current);
      
      // Add neighbors in reverse order to maintain left-to-right traversal
      const neighbors = this.getNeighbors(current);
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i]!.to)) {
          stack.push(neighbors[i]!.to);
        }
      }
    }
    
    return result;
  }

  /**
   * Dijkstra's algorithm for shortest paths
   */
  dijkstra(start: number): { distances: Map<number, number>; parents: Map<number, number> } {
    const distances = new Map<number, number>();
    const parents = new Map<number, number>();
    const pq = new PriorityQueue<{ node: number; distance: number }>((a, b) => a.distance - b.distance);
    
    distances.set(start, 0);
    pq.enqueue({ node: start, distance: 0 });
    
    while (!pq.isEmpty()) {
      const { node: current, distance: currentDist } = pq.dequeue()!;
      
      if (currentDist > (distances.get(current) ?? Infinity)) {
        continue;
      }
      
      for (const edge of this.getNeighbors(current)) {
        const newDist = currentDist + edge.weight;
        
        if (newDist < (distances.get(edge.to) ?? Infinity)) {
          distances.set(edge.to, newDist);
          parents.set(edge.to, current);
          pq.enqueue({ node: edge.to, distance: newDist });
        }
      }
    }
    
    return { distances, parents };
  }

  /**
   * Topological sort using DFS
   */
  topologicalSort(): number[] {
    const visited = new Set<number>();
    const stack: number[] = [];
    
    const dfsRecursive = (node: number) => {
      visited.add(node);
      
      for (const edge of this.getNeighbors(node)) {
        if (!visited.has(edge.to)) {
          dfsRecursive(edge.to);
        }
      }
      
      stack.push(node);
    };
    
    for (let i = 0; i < this.nodeCount; i++) {
      if (!visited.has(i)) {
        dfsRecursive(i);
      }
    }
    
    return stack.reverse();
  }

  /**
   * Check if graph has a cycle
   */
  hasCycle(): boolean {
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const colors = new Map<number, number>();
    
    const dfsRecursive = (node: number): boolean => {
      colors.set(node, GRAY);
      
      for (const edge of this.getNeighbors(node)) {
        const color = colors.get(edge.to) ?? WHITE;
        
        if (color === GRAY) {
          return true; // Back edge found, cycle detected
        }
        
        if (color === WHITE && dfsRecursive(edge.to)) {
          return true;
        }
      }
      
      colors.set(node, BLACK);
      return false;
    };
    
    for (let i = 0; i < this.nodeCount; i++) {
      if ((colors.get(i) ?? WHITE) === WHITE) {
        if (dfsRecursive(i)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Find strongly connected components (Kosaraju's algorithm)
   */
  stronglyConnectedComponents(): number[][] {
    const visited = new Set<number>();
    const order: number[] = [];
    
    // First DFS to get finishing order
    const dfs1 = (node: number) => {
      visited.add(node);
      for (const edge of this.getNeighbors(node)) {
        if (!visited.has(edge.to)) {
          dfs1(edge.to);
        }
      }
      order.push(node);
    };
    
    for (let i = 0; i < this.nodeCount; i++) {
      if (!visited.has(i)) {
        dfs1(i);
      }
    }
    
    // Create transpose graph
    const transpose = new Graph(this.nodeCount);
    for (const [from, edges] of this.adjacencyList) {
      for (const edge of edges) {
        transpose.addEdge(edge.to, from, edge.weight);
      }
    }
    
    // Second DFS on transpose graph
    visited.clear();
    const components: number[][] = [];
    
    const dfs2 = (node: number, component: number[]) => {
      visited.add(node);
      component.push(node);
      for (const edge of transpose.getNeighbors(node)) {
        if (!visited.has(edge.to)) {
          dfs2(edge.to, component);
        }
      }
    };
    
    for (let i = order.length - 1; i >= 0; i--) {
      const node = order[i]!;
      if (!visited.has(node)) {
        const component: number[] = [];
        dfs2(node, component);
        components.push(component);
      }
    }
    
    return components;
  }
}

/**
 * Binary heap-based priority queue
 */
export class PriorityQueue<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compareFunction: (a: T, b: T) => number) {
    this.compare = compareFunction;
  }

  enqueue(item: T): void {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return top;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private heapifyUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index]!, this.heap[parentIndex]!) >= 0) break;
      
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex]!, this.heap[index]!];
      index = parentIndex;
    }
  }

  private heapifyDown(index: number): void {
    while (true) {
      let minIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      if (leftChild < this.heap.length && 
          this.compare(this.heap[leftChild]!, this.heap[minIndex]!) < 0) {
        minIndex = leftChild;
      }

      if (rightChild < this.heap.length && 
          this.compare(this.heap[rightChild]!, this.heap[minIndex]!) < 0) {
        minIndex = rightChild;
      }

      if (minIndex === index) break;

      [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex]!, this.heap[index]!];
      index = minIndex;
    }
  }
}