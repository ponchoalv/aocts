/**
 * High-performance data structures and collections for Advent of Code
 */

/**
 * Disjoint Set (Union-Find) data structure
 */
export class DisjointSet {
  private parent: number[];
  private rank: number[];
  private componentCount: number;

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
    this.componentCount = size;
  }

  /**
   * Find root of element with path compression
   */
  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]!); // Path compression
    }
    return this.parent[x]!;
  }

  /**
   * Union two sets by rank
   */
  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    // Union by rank
    if (this.rank[rootX]! < this.rank[rootY]!) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX]! > this.rank[rootY]!) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]!++;
    }

    this.componentCount--;
    return true;
  }

  /**
   * Check if two elements are in the same set
   */
  connected(x: number, y: number): boolean {
    return this.find(x) === this.find(y);
  }

  /**
   * Get number of disjoint components
   */
  getComponentCount(): number {
    return this.componentCount;
  }

  /**
   * Get size of component containing x
   */
  getComponentSize(x: number): number {
    const root = this.find(x);
    let size = 0;
    for (let i = 0; i < this.parent.length; i++) {
      if (this.find(i) === root) {
        size++;
      }
    }
    return size;
  }
}

/**
 * Trie (Prefix Tree) for efficient string operations
 */
export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Insert a word into the trie
   */
  insert(word: string): void {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    current.isEndOfWord = true;
  }

  /**
   * Search for a word in the trie
   */
  search(word: string): boolean {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char)!;
    }
    return current.isEndOfWord;
  }

  /**
   * Check if any word starts with the given prefix
   */
  startsWith(prefix: string): boolean {
    let current = this.root;
    for (const char of prefix) {
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char)!;
    }
    return true;
  }

  /**
   * Get all words with the given prefix
   */
  getWordsWithPrefix(prefix: string): string[] {
    let current = this.root;
    for (const char of prefix) {
      if (!current.children.has(char)) {
        return [];
      }
      current = current.children.get(char)!;
    }

    const words: string[] = [];
    this.dfs(current, prefix, words);
    return words;
  }

  private dfs(node: TrieNode, currentWord: string, words: string[]): void {
    if (node.isEndOfWord) {
      words.push(currentWord);
    }

    for (const [char, childNode] of node.children) {
      this.dfs(childNode, currentWord + char, words);
    }
  }
}

class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

/**
 * Sparse array for handling large coordinate systems efficiently
 */
export class SparseArray<T> {
  private data: Map<string, T>;

  constructor() {
    this.data = new Map();
  }

  /**
   * Set value at coordinates
   */
  set(x: number, y: number, value: T): void {
    this.data.set(`${x},${y}`, value);
  }

  /**
   * Get value at coordinates
   */
  get(x: number, y: number): T | undefined {
    return this.data.get(`${x},${y}`);
  }

  /**
   * Check if coordinates have a value
   */
  has(x: number, y: number): boolean {
    return this.data.has(`${x},${y}`);
  }

  /**
   * Delete value at coordinates
   */
  delete(x: number, y: number): boolean {
    return this.data.delete(`${x},${y}`);
  }

  /**
   * Get all coordinates with values
   */
  getCoordinates(): Array<{ x: number; y: number; value: T }> {
    const coordinates: Array<{ x: number; y: number; value: T }> = [];
    for (const [key, value] of this.data) {
      const [x, y] = key.split(',').map(Number);
      coordinates.push({ x: x!, y: y!, value });
    }
    return coordinates;
  }

  /**
   * Get bounding box of all coordinates
   */
  getBounds(): { minX: number; maxX: number; minY: number; maxY: number } | null {
    if (this.data.size === 0) return null;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const key of this.data.keys()) {
      const [x, y] = key.split(',').map(Number);
      minX = Math.min(minX, x!);
      maxX = Math.max(maxX, x!);
      minY = Math.min(minY, y!);
      maxY = Math.max(maxY, y!);
    }

    return { minX, maxX, minY, maxY };
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.data.clear();
  }

  /**
   * Get size of the array
   */
  size(): number {
    return this.data.size;
  }
}

/**
 * Frequency counter for fast counting operations
 */
export class Counter<T> {
  private counts: Map<T, number>;

  constructor(items?: Iterable<T>) {
    this.counts = new Map();
    if (items) {
      for (const item of items) {
        this.increment(item);
      }
    }
  }

  /**
   * Increment count for an item
   */
  increment(item: T, amount: number = 1): void {
    this.counts.set(item, (this.counts.get(item) ?? 0) + amount);
  }

  /**
   * Decrement count for an item
   */
  decrement(item: T, amount: number = 1): void {
    const current = this.counts.get(item) ?? 0;
    const newCount = current - amount;
    if (newCount <= 0) {
      this.counts.delete(item);
    } else {
      this.counts.set(item, newCount);
    }
  }

  /**
   * Get count for an item
   */
  get(item: T): number {
    return this.counts.get(item) ?? 0;
  }

  /**
   * Get all items with their counts
   */
  entries(): Array<[T, number]> {
    return Array.from(this.counts.entries());
  }

  /**
   * Get most common items
   */
  mostCommon(n?: number): Array<[T, number]> {
    const sorted = this.entries().sort((a, b) => b[1] - a[1]);
    return n ? sorted.slice(0, n) : sorted;
  }

  /**
   * Get total count of all items
   */
  total(): number {
    let sum = 0;
    for (const count of this.counts.values()) {
      sum += count;
    }
    return sum;
  }

  /**
   * Clear all counts
   */
  clear(): void {
    this.counts.clear();
  }

  /**
   * Get unique items
   */
  keys(): T[] {
    return Array.from(this.counts.keys());
  }
}

/**
 * Circular array for efficient rotation operations
 */
export class CircularArray<T> {
  private data: T[];
  private offset: number = 0;

  constructor(items: T[]) {
    this.data = [...items];
  }

  /**
   * Rotate array left by n positions
   */
  rotateLeft(n: number = 1): void {
    this.offset = (this.offset + n) % this.data.length;
  }

  /**
   * Rotate array right by n positions
   */
  rotateRight(n: number = 1): void {
    this.offset = (this.offset - n + this.data.length) % this.data.length;
  }

  /**
   * Get element at logical index
   */
  get(index: number): T | undefined {
    if (index < 0 || index >= this.data.length) return undefined;
    const physicalIndex = (index + this.offset) % this.data.length;
    return this.data[physicalIndex];
  }

  /**
   * Set element at logical index
   */
  set(index: number, value: T): void {
    if (index < 0 || index >= this.data.length) return;
    const physicalIndex = (index + this.offset) % this.data.length;
    this.data[physicalIndex] = value;
  }

  /**
   * Get array in current order
   */
  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.data.length; i++) {
      result.push(this.get(i)!);
    }
    return result;
  }

  /**
   * Get length of array
   */
  length(): number {
    return this.data.length;
  }
}