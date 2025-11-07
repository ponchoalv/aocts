import { BaseSolution } from "../../templates/solution.js";

interface SensorAndBeaconRow {
  sensorX: number;
  sensorY: number;
  beaconX: number;
  beaconY: number;
  distance: number;
}

interface Dimensions {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export default class Day15Solution extends BaseSolution {
  private parseInput(input: string): {coordinates: Array<SensorAndBeaconRow>, dimensions: Dimensions} {
    const lines = this.lines(input);
    const coordinates: Array<SensorAndBeaconRow> = [];
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    // Pre-compiled regex for better performance
    const regex = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;

    for (const line of lines) {
      const match = regex.exec(line);
      if (match) {
        const sensorX = parseInt(match[1]!, 10);
        const sensorY = parseInt(match[2]!, 10);
        const beaconX = parseInt(match[3]!, 10);
        const beaconY = parseInt(match[4]!, 10);
        
        const distance = Math.abs(sensorY - beaconY) + Math.abs(sensorX - beaconX);
        
        const coord = { sensorX, sensorY, beaconX, beaconY, distance };
        coordinates.push(coord);

        // Calculate actual coverage bounds using distance
        const coverageMinX = sensorX - distance;
        const coverageMaxX = sensorX + distance;
        const coverageMinY = sensorY - distance;
        const coverageMaxY = sensorY + distance;
        
        minX = Math.min(minX, coverageMinX);
        maxX = Math.max(maxX, coverageMaxX);
        minY = Math.min(minY, coverageMinY);
        maxY = Math.max(maxY, coverageMaxY);
      }
    }
    
    return {coordinates, dimensions: {minX, maxX, minY, maxY}};
  }

  private countNonBeaconPositionsAtY(coordinates: Array<SensorAndBeaconRow>, y: number): number {
    const ranges: Array<[number, number]> = [];
    
    // Collect all coverage ranges for this row
    for (const { sensorX, sensorY, distance } of coordinates) {
      const yDistance = distance - Math.abs(sensorY - y);
      if (yDistance >= 0) {
        const left = sensorX - yDistance;
        const right = sensorX + yDistance;
        ranges.push([left, right]);
      }
    }
    
    if (ranges.length === 0) return 0;
    
    // Sort by start position
    ranges.sort((a, b) => a[0] - b[0]);
    
    // Merge overlapping intervals
    const mergedRanges: Array<[number, number]> = [ranges[0]!];
    for (let i = 1; i < ranges.length; i++) {
      const [start, end] = ranges[i]!;
      const lastRange = mergedRanges[mergedRanges.length - 1]!;
      
      if (start <= lastRange[1] + 1) {
        // Overlapping or adjacent, merge them
        lastRange[1] = Math.max(lastRange[1], end);
      } else {
        // Non-overlapping, add as new range
        mergedRanges.push([start, end]);
      }
    }
    
    // Calculate total coverage
    let totalCoverage = 0;
    for (const [start, end] of mergedRanges) {
      totalCoverage += end - start + 1;
    }
    
    // Count beacons at this Y coordinate
    const beaconsAtY = new Set<number>();
    for (const { beaconX, beaconY } of coordinates) {
      if (beaconY === y) {
        beaconsAtY.add(beaconX);
      }
    }
    

    
    return totalCoverage - beaconsAtY.size;
  }

  part1(input: string, isTest: boolean = false): string | number {
    const { coordinates } = this.parseInput(input);
    
    // Use different Y values for test vs real input
    const targetY = isTest ? 10 : 2000000;
    
    return this.countNonBeaconPositionsAtY(coordinates, targetY);
  }

  private findGapInRow(coordinates: Array<SensorAndBeaconRow>, y: number, maxCoord: number): number | null {
    const ranges: Array<[number, number]> = [];
    
    // Collect all coverage ranges for this row
    for (const { sensorX, sensorY, distance } of coordinates) {
      const yDistance = distance - Math.abs(sensorY - y);
      if (yDistance >= 0) {
        const left = Math.max(0, sensorX - yDistance);
        const right = Math.min(maxCoord, sensorX + yDistance);
        if (left <= right) {
          ranges.push([left, right]);
        }
      }
    }
    
    if (ranges.length === 0) return 0;
    
    // Sort by start position
    ranges.sort((a, b) => a[0] - b[0]);
    
    // Find the first gap
    let coverage = ranges[0]![0] > 0 ? 0 : ranges[0]![0];
    let maxEnd = ranges[0]![1];
    
    for (const [start, end] of ranges) {
      if (start > maxEnd + 1) {
        // Found a gap
        return maxEnd + 1;
      }
      maxEnd = Math.max(maxEnd, end);
    }
    
    // Check if we don't cover the entire range
    return maxEnd < maxCoord ? maxEnd + 1 : null;
  }

  part2(input: string, isTest: boolean = false): string | number {
    const { coordinates } = this.parseInput(input);
    const maxCoord = isTest ? 20 : 4000000;
    
    // Use a more targeted search - check boundary lines of sensors
    const candidates = new Set<string>();
    
    // Add points just outside the diamond perimeter of each sensor
    for (const { sensorX, sensorY, distance } of coordinates) {
      const boundary = distance + 1;
      
      // Check the four diagonal lines forming the diamond boundary
      for (let i = 0; i <= boundary; i++) {
        const points = [
          [sensorX + i, sensorY + boundary - i],           // Top-right edge
          [sensorX + boundary - i, sensorY - i],           // Bottom-right edge  
          [sensorX - i, sensorY - boundary + i],           // Bottom-left edge
          [sensorX - boundary + i, sensorY + i],           // Top-left edge
        ];
        
        for (const point of points) {
          const x = point[0]!;
          const y = point[1]!; 
          if (x >= 0 && x <= maxCoord && y >= 0 && y <= maxCoord) {
            candidates.add(`${x},${y}`);
          }
        }
      }
    }
    
    // Check each candidate position
    for (const candidate of candidates) {
      const [x, y] = candidate.split(',').map(Number);
      
      let covered = false;
      for (const { sensorX, sensorY, distance } of coordinates) {
        const dist = Math.abs(x! - sensorX) + Math.abs(y! - sensorY);
        if (dist <= distance) {
          covered = true;
          break;
        }
      }
      
      if (!covered) {
        return x! * 4000000 + y!;
      }
    }
    
    return 0;
  }
}
