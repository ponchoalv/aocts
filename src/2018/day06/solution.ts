import { BaseSolution } from '../../templates/solution.js';
import { MathUtils } from '../../utils/math.js';

interface Coordinate {
  x: number;
  y: number;
  id: number;
}

export default class Day06Solution extends BaseSolution {
  private parseCoordinates(input: string): Coordinate[] {
    const lines = this.lines(input);
    return lines.map((line, index) => {
      const [x, y] = line.split(', ').map(Number);
      return { x: x!, y: y!, id: index };
    });
  }

  private getBounds(coordinates: Coordinate[]): { minX: number; maxX: number; minY: number; maxY: number } {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (const coord of coordinates) {
      minX = Math.min(minX, coord.x);
      maxX = Math.max(maxX, coord.x);
      minY = Math.min(minY, coord.y);
      maxY = Math.max(maxY, coord.y);
    }

    return { minX, maxX, minY, maxY };
  }

  private getClosestCoordinate(coordinates: Coordinate[], x: number, y: number): number | null {
    let minDistance = Infinity;
    let closestId: number | null = null;
    let tie = false;

    for (const coord of coordinates) {
      const distance = MathUtils.manhattanDistance(x, y, coord.x, coord.y);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestId = coord.id;
        tie = false;
      } else if (distance === minDistance) {
        tie = true;
      }
    }

    return tie ? null : closestId;
  }

  private getTotalDistance(coordinates: Coordinate[], x: number, y: number): number {
    let totalDistance = 0;
    for (const coord of coordinates) {
      totalDistance += MathUtils.manhattanDistance(x, y, coord.x, coord.y);
    }
    return totalDistance;
  }

  part1(input: string, isTest: boolean = false): string | number {
    const coordinates = this.parseCoordinates(input);
    const bounds = this.getBounds(coordinates);
    
    // Track areas and infinite flags using arrays for performance
    const areas = new Array<number>(coordinates.length).fill(0);
    const isInfinite = new Array<boolean>(coordinates.length).fill(false);

    // Expand bounds slightly to detect infinite areas
    const padding = 1;
    const minX = bounds.minX - padding;
    const maxX = bounds.maxX + padding;
    const minY = bounds.minY - padding;
    const maxY = bounds.maxY + padding;

    // Process each point in the expanded bounding box
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const closestId = this.getClosestCoordinate(coordinates, x, y);
        
        if (closestId !== null) {
          areas[closestId] = (areas[closestId] || 0) + 1;
          
          // Mark as infinite if on the boundary
          if (x === minX || x === maxX || y === minY || y === maxY) {
            isInfinite[closestId] = true;
          }
        }
      }
    }

    // Find the largest finite area
    let maxArea = 0;
    for (let i = 0; i < coordinates.length; i++) {
      if (!isInfinite[i] && areas[i]! > maxArea) {
        maxArea = areas[i]!;
      }
    }

    return maxArea;
  }

  part2(input: string, isTest: boolean = false): string | number {
    const coordinates = this.parseCoordinates(input);
    const bounds = this.getBounds(coordinates);
    const maxTotalDistance = isTest ? 32 : 10000;
    
    let regionSize = 0;
    
    // Only check within the actual bounds for part 2
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      for (let x = bounds.minX; x <= bounds.maxX; x++) {
        const totalDistance = this.getTotalDistance(coordinates, x, y);
        
        if (totalDistance < maxTotalDistance) {
          regionSize++;
        }
      }
    }

    return regionSize;
  }
}