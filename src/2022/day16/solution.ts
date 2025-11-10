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

  // Original function for single agent (Part 1)
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

  // Corrected dual agents implementation
  private getMaxFlowRateWithElephant(
    timeRemaining: number,
    humanValve: string,
    elephantValve: string,
    openedMask: number
  ): number {
    if (timeRemaining <= 0) {
      return 0;
    }

    const memoKey = `${timeRemaining}-${humanValve}-${elephantValve}-${openedMask}`;
    
    if (this.memo.has(memoKey)) {
      return this.memo.get(memoKey)!;
    }

    let maxPressure = 0;

    // Get all valid moves for both agents
    const getValidMoves = (currentValve: string) => {
      const moves: Array<{ valveIndex: number; valve: ImportantValve; distance: number }> = [];
      const currentIndex = this.valveToIndex.get(currentValve) ?? 0;
      
      for (let i = 0; i < this.importantValves.length; i++) {
        const valve = this.importantValves[i]!;
        
        // Skip if already opened or no flow rate
        if ((openedMask & (1 << i)) !== 0 || valve.flowRate === 0) {
          continue;
        }

        const distance = this.distances[currentIndex]![i] ?? 0;
        
        // Need enough time to travel and open (distance + 1)
        if (distance + 1 < timeRemaining) {
          moves.push({ valveIndex: i, valve, distance });
        }
      }
      
      return moves;
    };

    const humanMoves = getValidMoves(humanValve);
    const elephantMoves = getValidMoves(elephantValve);
    
    // Case 1: Both agents move and open valves
    for (const humanMove of humanMoves) {
      for (const elephantMove of elephantMoves) {
        // Can't open the same valve
        if (humanMove.valveIndex === elephantMove.valveIndex) {
          continue;
        }

        const humanOpenTime = humanMove.distance + 1;
        const elephantOpenTime = elephantMove.distance + 1;
        
        // Both valves get opened, continue with remaining time after the slower one
        const remainingTime = timeRemaining - Math.max(humanOpenTime, elephantOpenTime);
        
        if (remainingTime >= 0) {
          const newOpenedMask = openedMask | (1 << humanMove.valveIndex) | (1 << elephantMove.valveIndex);
          
          // Pressure = flowRate * remaining time after opening
          const humanPressure = humanMove.valve.flowRate * (timeRemaining - humanOpenTime);
          const elephantPressure = elephantMove.valve.flowRate * (timeRemaining - elephantOpenTime);
          
          const futureScore = this.getMaxFlowRateWithElephant(
            remainingTime,
            humanMove.valve.name,
            elephantMove.valve.name,
            newOpenedMask
          );

          maxPressure = Math.max(maxPressure, humanPressure + elephantPressure + futureScore);
        }
      }
    }

    // Case 2: Only human moves
    for (const humanMove of humanMoves) {
      const humanOpenTime = humanMove.distance + 1;
      const remainingTime = timeRemaining - humanOpenTime;
      
      if (remainingTime >= 0) {
        const newOpenedMask = openedMask | (1 << humanMove.valveIndex);
        const humanPressure = humanMove.valve.flowRate * (timeRemaining - humanOpenTime);
        
        const futureScore = this.getMaxFlowRateWithElephant(
          remainingTime,
          humanMove.valve.name,
          elephantValve,
          newOpenedMask
        );

        maxPressure = Math.max(maxPressure, humanPressure + futureScore);
      }
    }

    // Case 3: Only elephant moves
    for (const elephantMove of elephantMoves) {
      const elephantOpenTime = elephantMove.distance + 1;
      const remainingTime = timeRemaining - elephantOpenTime;
      
      if (remainingTime >= 0) {
        const newOpenedMask = openedMask | (1 << elephantMove.valveIndex);
        const elephantPressure = elephantMove.valve.flowRate * (timeRemaining - elephantOpenTime);
        
        const futureScore = this.getMaxFlowRateWithElephant(
          remainingTime,
          humanValve,
          elephantMove.valve.name,
          newOpenedMask
        );

        maxPressure = Math.max(maxPressure, elephantPressure + futureScore);
      }
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
    this.memo.clear();

    // Simplified approach: Use dynamic programming with state tracking
    const elephantTime = 26;
    
    // Generate all possible single-agent solutions and combine the best non-overlapping ones
    const solutions = new Map<number, number>(); // openedMask -> maxPressure
    
    this.generateAllSolutions(elephantTime, 'AA', 0, 0, solutions);
    
    let maxCombinedPressure = 0;
    const solutionEntries = Array.from(solutions.entries());
    
    // Find best combination of non-overlapping solutions
    for (let i = 0; i < solutionEntries.length; i++) {
      for (let j = i + 1; j < solutionEntries.length; j++) {
        const [mask1, pressure1] = solutionEntries[i]!;
        const [mask2, pressure2] = solutionEntries[j]!;
        
        // Check if the solutions don't overlap (no common valves opened)
        if ((mask1 & mask2) === 0) {
          maxCombinedPressure = Math.max(maxCombinedPressure, pressure1 + pressure2);
        }
      }
    }
    
    return maxCombinedPressure;
  }

  // Generate all possible solutions for a single agent
  private generateAllSolutions(
    timeRemaining: number,
    currentValve: string,
    openedMask: number,
    currentPressure: number,
    solutions: Map<number, number>
  ): void {
    // Record this solution
    const existing = solutions.get(openedMask) ?? 0;
    solutions.set(openedMask, Math.max(existing, currentPressure));
    
    if (timeRemaining <= 0) {
      return;
    }

    // Try opening each unopened valve
    for (let i = 0; i < this.importantValves.length; i++) {
      const valve = this.importantValves[i]!;
      
      if ((openedMask & (1 << i)) !== 0 || valve.flowRate === 0) {
        continue;
      }

      const currentIndex = this.valveToIndex.get(currentValve) ?? 0;
      const travelTime = this.distances[currentIndex]![i] ?? 0;
      const timeAfterMovingAndOpening = timeRemaining - travelTime - 1;

      if (timeAfterMovingAndOpening > 0) {
        const newOpenedMask = openedMask | (1 << i);
        const pressureFromThisValve = valve.flowRate * timeAfterMovingAndOpening;
        
        this.generateAllSolutions(
          timeAfterMovingAndOpening,
          valve.name,
          newOpenedMask,
          currentPressure + pressureFromThisValve,
          solutions
        );
      }
    }
  }
}
