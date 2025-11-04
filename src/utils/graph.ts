/**
 * High-performance graph algorithms for Advent of Code
 */

export interface Edge {
  to: number;
  weight: number;
}

/**
 * Directed graph with explicit parent-child relationship tracking
 * Perfect for dependency resolution, topological sorting, and tree problems
 */
export class DirectedGraph<T = string> {
  private nodes: Map<T, Set<T>>; // node -> children
  private parents: Map<T, Set<T>>; // node -> parents
  private inDegree: Map<T, number>; // node -> number of incoming edges
  private outDegree: Map<T, number>; // node -> number of outgoing edges

  constructor() {
    this.nodes = new Map();
    this.parents = new Map();
    this.inDegree = new Map();
    this.outDegree = new Map();
  }

  /**
   * Add a node to the graph
   */
  addNode(node: T): void {
    if (!this.nodes.has(node)) {
      this.nodes.set(node, new Set());
      this.parents.set(node, new Set());
      this.inDegree.set(node, 0);
      this.outDegree.set(node, 0);
    }
  }

  /**
   * Add a directed edge: parent -> child
   */
  addEdge(parent: T, child: T): void {
    this.addNode(parent);
    this.addNode(child);
    
    // Only add if edge doesn't exist
    if (!this.nodes.get(parent)!.has(child)) {
      this.nodes.get(parent)!.add(child);
      this.parents.get(child)!.add(parent);
      this.inDegree.set(child, this.inDegree.get(child)! + 1);
      this.outDegree.set(parent, this.outDegree.get(parent)! + 1);
    }
  }

  /**
   * Remove an edge: parent -> child
   */
  removeEdge(parent: T, child: T): void {
    if (this.nodes.has(parent) && this.nodes.get(parent)!.has(child)) {
      this.nodes.get(parent)!.delete(child);
      this.parents.get(child)!.delete(parent);
      this.inDegree.set(child, this.inDegree.get(child)! - 1);
      this.outDegree.set(parent, this.outDegree.get(parent)! - 1);
    }
  }

  /**
   * Get all children of a node
   */
  getChildren(node: T): Set<T> {
    return this.nodes.get(node) ?? new Set();
  }

  /**
   * Get all parents of a node
   */
  getParents(node: T): Set<T> {
    return this.parents.get(node) ?? new Set();
  }

  /**
   * Get in-degree (number of parents) of a node
   */
  getInDegree(node: T): number {
    return this.inDegree.get(node) ?? 0;
  }

  /**
   * Get out-degree (number of children) of a node
   */
  getOutDegree(node: T): number {
    return this.outDegree.get(node) ?? 0;
  }

  /**
   * Get all nodes with no incoming edges (roots)
   */
  getRoots(): T[] {
    const roots: T[] = [];
    for (const [node, degree] of this.inDegree) {
      if (degree === 0) {
        roots.push(node);
      }
    }
    return roots.sort(); // Lexicographic order for consistency
  }

  /**
   * Get all nodes with no outgoing edges (leaves)
   */
  getLeaves(): T[] {
    const leaves: T[] = [];
    for (const [node, degree] of this.outDegree) {
      if (degree === 0) {
        leaves.push(node);
      }
    }
    return leaves.sort();
  }

  /**
   * Get all nodes in the graph
   */
  getAllNodes(): T[] {
    return Array.from(this.nodes.keys()).sort();
  }

  /**
   * Check if there's a path from source to target
   */
  hasPath(source: T, target: T): boolean {
    if (!this.nodes.has(source) || !this.nodes.has(target)) {
      return false;
    }
    
    const visited = new Set<T>();
    const stack = [source];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === target) return true;
      if (visited.has(current)) continue;
      
      visited.add(current);
      for (const child of this.getChildren(current)) {
        stack.push(child);
      }
    }
    
    return false;
  }

  /**
   * Topological sort using Kahn's algorithm (BFS-based)
   * Returns nodes in dependency order (dependencies first)
   */
  topologicalSort(): T[] {
    const result: T[] = [];
    const inDegreeClone = new Map(this.inDegree);
    const queue: T[] = [];
    
    // Find all nodes with no incoming edges
    for (const [node, degree] of inDegreeClone) {
      if (degree === 0) {
        queue.push(node);
      }
    }
    
    // Sort initially available nodes for consistent ordering
    queue.sort();
    
    while (queue.length > 0) {
      // Always pick lexicographically smallest available node
      queue.sort();
      const current = queue.shift()!;
      result.push(current);
      
      // Process all children
      const childrenToAdd: T[] = [];
      for (const child of this.getChildren(current)) {
        const newDegree = inDegreeClone.get(child)! - 1;
        inDegreeClone.set(child, newDegree);
        
        if (newDegree === 0) {
          childrenToAdd.push(child);
        }
      }
      
      // Add newly available children
      queue.push(...childrenToAdd);
    }
    
    // Check for cycles
    if (result.length !== this.nodes.size) {
      throw new Error('Graph contains a cycle - topological sort impossible');
    }
    
    return result;
  }

  /**
   * Parallel topological sort - simulate multiple workers
   * Returns the order and total time with given number of workers and work time function
   */
  parallelTopologicalSort(
    workerCount: number = 1,
    getWorkTime: (node: T) => number = () => 1
  ): { order: T[]; totalTime: number; timeline: Array<{ time: number; completed: T; workers: T[] }> } {
    const result: T[] = [];
    const timeline: Array<{ time: number; completed: T; workers: T[] }> = [];
    const inDegreeClone = new Map(this.inDegree);
    const available: T[] = [];
    const workers: Array<{ node: T | null; finishTime: number }> = 
      Array(workerCount).fill(null).map(() => ({ node: null, finishTime: 0 }));
    
    let currentTime = 0;
    
    // Find initially available nodes
    for (const [node, degree] of inDegreeClone) {
      if (degree === 0) {
        available.push(node);
      }
    }
    available.sort();
    
    while (result.length < this.nodes.size) {
      // Assign work to available workers
      for (let i = 0; i < workers.length; i++) {
        if (workers[i]!.node === null && available.length > 0) {
          available.sort();
          const node = available.shift()!;
          workers[i]!.node = node;
          workers[i]!.finishTime = currentTime + getWorkTime(node);
        }
      }
      
      // Find next completion time
      const workingWorkers = workers.filter(w => w.node !== null);
      if (workingWorkers.length === 0) break;
      
      const nextFinishTime = Math.min(...workingWorkers.map(w => w.finishTime));
      currentTime = nextFinishTime;
      
      // Complete all work finishing at this time
      const completed: T[] = [];
      for (let i = 0; i < workers.length; i++) {
        if (workers[i]!.finishTime === currentTime && workers[i]!.node !== null) {
          const node = workers[i]!.node!;
          completed.push(node);
          result.push(node);
          workers[i]!.node = null;
          workers[i]!.finishTime = 0;
          
          // Update dependencies
          for (const child of this.getChildren(node)) {
            const newDegree = inDegreeClone.get(child)! - 1;
            inDegreeClone.set(child, newDegree);
            
            if (newDegree === 0) {
              available.push(child);
            }
          }
        }
      }
      
      // Record timeline
      timeline.push({
        time: currentTime,
        completed: completed[0]!, // Primary completion for this tick
        workers: workers.map(w => w.node).filter(n => n !== null) as T[]
      });
    }
    
    return { order: result, totalTime: currentTime, timeline };
  }

  /**
   * Check if the graph is a DAG (Directed Acyclic Graph)
   */
  isDAG(): boolean {
    try {
      this.topologicalSort();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all ancestors of a node (all nodes that can reach this node)
   */
  getAncestors(node: T): Set<T> {
    const ancestors = new Set<T>();
    const stack = [...this.getParents(node)];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (!ancestors.has(current)) {
        ancestors.add(current);
        stack.push(...this.getParents(current));
      }
    }
    
    return ancestors;
  }

  /**
   * Get all descendants of a node (all nodes reachable from this node)
   */
  getDescendants(node: T): Set<T> {
    const descendants = new Set<T>();
    const stack = [...this.getChildren(node)];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (!descendants.has(current)) {
        descendants.add(current);
        stack.push(...this.getChildren(current));
      }
    }
    
    return descendants;
  }

  /**
   * Create a copy of the graph
   */
  clone(): DirectedGraph<T> {
    const clone = new DirectedGraph<T>();
    for (const node of this.getAllNodes()) {
      clone.addNode(node);
    }
    for (const [parent, children] of this.nodes) {
      for (const child of children) {
        clone.addEdge(parent, child);
      }
    }
    return clone;
  }

  /**
   * Get graph statistics
   */
  getStats(): {
    nodeCount: number;
    edgeCount: number;
    roots: T[];
    leaves: T[];
    maxInDegree: number;
    maxOutDegree: number;
  } {
    const edgeCount = Array.from(this.outDegree.values()).reduce((sum, deg) => sum + deg, 0);
    const maxInDegree = Math.max(...Array.from(this.inDegree.values()));
    const maxOutDegree = Math.max(...Array.from(this.outDegree.values()));
    
    return {
      nodeCount: this.nodes.size,
      edgeCount,
      roots: this.getRoots(),
      leaves: this.getLeaves(),
      maxInDegree,
      maxOutDegree
    };
  }
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