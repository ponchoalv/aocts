import { BaseSolution } from '../../templates/solution.js';

interface Valve {
  name: string;
  flowRate: number;
  connections: string[];
}

interface ImportantValve {
  name: string;
  flowRate: number;
  index: number;
}

export default class Day16Solution extends BaseSolution {
  private totalTime = 30;
  private valves: Map<string, Valve> = new Map();
  private importantValves: ImportantValve[] = [];
  private distances: number[][] = [];
  private valveToIndex: Map<string, number> = new Map();
  private memo: Map<string, number> = new Map();

  private parseInput(input: string): void {
    const lines = this.lines(input);

    const regex = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/;
    for (const line of lines) {
      const match = regex.exec(line);
      if (match) {
        const name = match[1]!;
        const flowRate = parseInt(match[2]!, 10);
        const connections = match[3]!.split(', ').map(conn => conn.trim());

        this.valves.set(name, { name, flowRate, connections });
      }
    }

    // Filter important valves (flow rate > 0 or AA)
    this.importantValves = [];
    this.valveToIndex.clear();
    let index = 0;
    for (const [name, valve] of this.valves.entries()) {
      if (valve.flowRate > 0 || name === 'AA') {
        this.importantValves.push({ name, flowRate: valve.flowRate, index });
        this.valveToIndex.set(name, index);
        index++;
      }
    }

    // Precompute shortest distances between all important valves
    this.computeDistances();
  }

  private computeDistances(): void {
    const numValves = this.importantValves.length;
    this.distances = Array(numValves).fill(null).map(() => Array(numValves).fill(Infinity));
    
    for (let i = 0; i < numValves; i++) {
      const startValve = this.importantValves[i]!;
      
      // BFS to find shortest path to all other valves
      const queue: Array<{ name: string; distance: number }> = [{ name: startValve.name, distance: 0 }];
      const visited = new Set<string>();
      
      while (queue.length > 0) {
        const { name, distance } = queue.shift()!;
        
        if (visited.has(name)) continue;
        visited.add(name);
        
        const targetIndex = this.valveToIndex.get(name);
        if (targetIndex !== undefined) {
          this.distances[i]![targetIndex] = distance;
        }
        
        const currentValve = this.valves.get(name);
        if (currentValve) {
          for (const connection of currentValve.connections) {
            if (!visited.has(connection)) {
              queue.push({ name: connection, distance: distance + 1 });
            }
          }
        }
      }
    }
  }


  // Optimized recursive function using bitmask and precomputed distances
  private getMaxFlowRate(
    timeRemaining: number, 
    currentValve: string, 
    openedMask: number
  ): number {
    if (timeRemaining <= 0) {
      return 0;
    }

    const memoKey = `${timeRemaining}-${currentValve}-${openedMask}`;
    
    if (this.memo.has(memoKey)) {
      return this.memo.get(memoKey)!;
    }

    let maxPressure = 0;

    // Try opening each unopened valve that has positive flow rate
    for (let i = 0; i < this.importantValves.length; i++) {
      const valve = this.importantValves[i]!;
      
      // Skip if valve is already opened or has no flow rate
      if ((openedMask & (1 << i)) !== 0 || valve.flowRate === 0) {
        continue;
      }

      const currentIndex = this.valveToIndex.get(currentValve) ?? 0;
      const travelTime = this.distances[currentIndex]![i] ?? 0;
      const timeAfterMovingAndOpening = timeRemaining - travelTime - 1;

      // Skip if not enough time to travel and open valve
      if (timeAfterMovingAndOpening <= 0) {
        continue;
      }

      const newOpenedMask = openedMask | (1 << i);
      const pressureFromThisValve = valve.flowRate * timeAfterMovingAndOpening;
      const pressureFromRest = this.getMaxFlowRate(
        timeAfterMovingAndOpening,
        valve.name,
        newOpenedMask
      );

      maxPressure = Math.max(maxPressure, pressureFromThisValve + pressureFromRest);
    }

    this.memo.set(memoKey, maxPressure);
    return maxPressure;
  }

  part1(input: string, isTest: boolean = false): string | number {
    this.parseInput(input);
    this.memo.clear(); 

    const maxFlowRate = this.getMaxFlowRate(
      this.totalTime, 
      'AA', 
      0 // No valves opened initially (bitmask = 0)
    );
    
    return maxFlowRate;
  }

  part2(input: string, isTest: boolean = false): string | number {
    this.parseInput(input);

    // TODO: Implement part 2
    return 0;
  }
}
