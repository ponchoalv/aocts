import { BaseSolution } from "../../templates/solution.js";

interface SensorAndBeaconRow {
  sensorX: number;
  sensorY: number;
  beaconX: number;
  beaconY: number;
  distance: number;
}

export default class Day15Solution extends BaseSolution {
  private parseInput(input: string): Array<SensorAndBeaconRow> {
    const lines = this.lines(input);
    const coordinates: Array<SensorAndBeaconRow> = [];
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

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
      }
    }

    return coordinates;
  }

  private countNonBeaconPositionsAtY(coordinates: Array<SensorAndBeaconRow>, y: number): number {
    const ranges: Array<[number, number]> = [];
    
    for (const { sensorX, sensorY, distance } of coordinates) {
      const yDistance = distance - Math.abs(sensorY - y);
      if (yDistance >= 0) {
        const left = sensorX - yDistance;
        const right = sensorX + yDistance;
        ranges.push([left, right]);
      }
    }
    
    if (ranges.length === 0) return 0;
    
    ranges.sort((a, b) => a[0] - b[0]);
    
    const mergedRanges: Array<[number, number]> = [ranges[0]!];
    for (let i = 1; i < ranges.length; i++) {
      const [start, end] = ranges[i]!;
      const lastRange = mergedRanges[mergedRanges.length - 1]!;
      
      if (start <= lastRange[1] + 1) {
        lastRange[1] = Math.max(lastRange[1], end);
      } else {
        mergedRanges.push([start, end]);
      }
    }
    
    let totalCoverage = 0;
    for (const [start, end] of mergedRanges) {
      totalCoverage += end - start + 1;
    }
    
    const beaconsAtY = new Set<number>();
    for (const { beaconX, beaconY } of coordinates) {
      if (beaconY === y) {
        beaconsAtY.add(beaconX);
      }
    }
    
    return totalCoverage - beaconsAtY.size;
  }

  part1(input: string, isTest: boolean = false): string | number {
    const coordinates = this.parseInput(input);
    const targetY = isTest ? 10 : 2000000;
    
    return this.countNonBeaconPositionsAtY(coordinates, targetY);
  }
  part2(input: string, isTest: boolean = false): string | number {
    const coordinates = this.parseInput(input);
    const maxCoord = isTest ? 20 : 4000000;
    
    for (let y = 0; y <= maxCoord; y++) {
      const ranges: Array<[number, number]> = [];
      
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
      
      if (ranges.length === 0) continue;
      
      ranges.sort((a, b) => a[0] - b[0]);
      
      let coverage = 0;
      for (const [start, end] of ranges) {
        if (start > coverage) {
          return coverage * 4000000 + y;
        }
        coverage = Math.max(coverage, end + 1);
      }
      
      if (coverage <= maxCoord) {
        return coverage * 4000000 + y;
      }
    }
    
    return 0;
  }
}
