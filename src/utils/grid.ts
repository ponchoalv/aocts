/**
 * High-performance grid utilities for 2D problems
 */

export interface Point {
  x: number;
  y: number;
}

export interface Direction {
  dx: number;
  dy: number;
  name: string;
}

export class Grid<T> {
  private data: T[][];
  public readonly width: number;
  public readonly height: number;

  constructor(data: T[][]) {
    this.data = data;
    this.height = data.length;
    this.width = data
      .map((it: T[]) => it.length)
      .reduce((prev: number, curr: number) => Math.max(prev, curr));
  }

  /**
   * Get value at position
   */
  get(x: number, y: number): T | undefined {
    if (!this.inBounds(x, y)) return undefined;
    return this.data[y]![x];
  }

  /**
   * Set value at position
   */
  set(x: number, y: number, value: T): void {
    if (this.inBounds(x, y)) {
      this.data[y]![x] = value;
    }
  }

  /**
   * Check if coordinates are within bounds
   */
  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Get all adjacent positions (4-directional)
   */
  getAdjacent4(x: number, y: number): Point[] {
    const adjacent: Point[] = [];
    for (const dir of GridUtils.DIRECTIONS_4) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      if (this.inBounds(nx, ny)) {
        adjacent.push({ x: nx, y: ny });
      }
    }
    return adjacent;
  }

  /**
   * Get all adjacent positions (8-directional)
   */
  getAdjacent8(x: number, y: number): Point[] {
    const adjacent: Point[] = [];
    for (const dir of GridUtils.DIRECTIONS_8) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      if (this.inBounds(nx, ny)) {
        adjacent.push({ x: nx, y: ny });
      }
    }
    return adjacent;
  }

  /**
   * Find all positions with a specific value
   */
  findAll(value: T): Point[] {
    const positions: Point[] = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.data[y]![x] === value) {
          positions.push({ x, y });
        }
      }
    }
    return positions;
  }

  /**
   * Find first position with a specific value
   */
  find(value: T): Point | undefined {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.data[y]![x] === value) {
          return { x, y };
        }
      }
    }
    return undefined;
  }

  /**
   * Count occurrences of a value
   */
  count(value: T): number {
    let count = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.data[y]![x] === value) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Create a copy of the grid
   */
  copy(): Grid<T> {
    const newData = this.data.map((row) => [...row]);
    return new Grid(newData);
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return this.data.map((row) => row.join("")).join("\n");
  }

  /**
   * Iterate over all positions
   */
  *positions(): Generator<{ x: number; y: number; value: T }> {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield { x, y, value: this.data[y]![x]! };
      }
    }
  }
}

export class GridUtils {
  // Cardinal directions (up, right, down, left)
  static readonly DIRECTIONS_4: Direction[] = [
    { dx: 0, dy: -1, name: "N" },
    { dx: 1, dy: 0, name: "E" },
    { dx: 0, dy: 1, name: "S" },
    { dx: -1, dy: 0, name: "W" },
  ];

  // All 8 directions including diagonals
  static readonly DIRECTIONS_8: Direction[] = [
    { dx: 0, dy: -1, name: "N" },
    { dx: 1, dy: -1, name: "NE" },
    { dx: 1, dy: 0, name: "E" },
    { dx: 1, dy: 1, name: "SE" },
    { dx: 0, dy: 1, name: "S" },
    { dx: -1, dy: 1, name: "SW" },
    { dx: -1, dy: 0, name: "W" },
    { dx: -1, dy: -1, name: "NW" },
  ];

  /**
   * Create grid from string input
   */
  static fromString(input: string): Grid<string> {
    const lines = input.trim().split("\n");
    const data = lines.map((line) => [...line]);
    return new Grid(data);
  }

  /**
   * Create number grid from string input
   */
  static fromStringNumbers(input: string): Grid<number> {
    const lines = input.trim().split("\n");
    const data = lines.map((line) => [...line].map((c) => parseInt(c, 10)));
    return new Grid(data);
  }

  /**
   * Flood fill algorithm
   */
  static floodFill<T>(
    grid: Grid<T>,
    startX: number,
    startY: number,
    newValue: T,
    shouldFill: (value: T) => boolean = (value) =>
      value === grid.get(startX, startY)
  ): void {
    const stack: Point[] = [{ x: startX, y: startY }];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key) || !grid.inBounds(x, y)) continue;

      const currentValue = grid.get(x, y)!;
      if (!shouldFill(currentValue)) continue;

      visited.add(key);
      grid.set(x, y, newValue);

      // Add adjacent cells
      for (const dir of this.DIRECTIONS_4) {
        stack.push({ x: x + dir.dx, y: y + dir.dy });
      }
    }
  }

  /**
   * Rotate direction clockwise
   */
  static rotateClockwise(direction: Direction): Direction {
    const index = this.DIRECTIONS_4.indexOf(direction);
    if (index === -1) return direction;
    return this.DIRECTIONS_4[(index + 1) % 4]!;
  }

  /**
   * Rotate direction counter-clockwise
   */
  static rotateCounterClockwise(direction: Direction): Direction {
    const index = this.DIRECTIONS_4.indexOf(direction);
    if (index === -1) return direction;
    return this.DIRECTIONS_4[(index + 3) % 4]!;
  }

  /**
   * Get opposite direction
   */
  static opposite(direction: Direction): Direction {
    const index = this.DIRECTIONS_4.indexOf(direction);
    if (index === -1) return direction;
    return this.DIRECTIONS_4[(index + 2) % 4]!;
  }

  /**
   * Manhattan distance between two points
   */
  static manhattanDistance(p1: Point, p2: Point): number {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  }
}
