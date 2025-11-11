import { BaseSolution } from '../../templates/solution.js';

enum WindDirection {
  Left = -1,
  Right = 1,
}

interface Rock {
  shape: bigint;    // Single number representing the entire rock
  width: number;
  height: number;
}

export default class Day17Solution extends BaseSolution {
  private readonly LEVEL_BITS = 7;
  private readonly LEVEL_MASK = (1 << this.LEVEL_BITS) - 1;

  private rocks: Rock[] = [
    {
      shape: 0b0011110n,
      width: 4,
      height: 1
    },
    {
      shape: 0b0001000_0011100_0001000n,
      width: 3,
      height: 3
    },
    {
      shape: 0b0000100_0000100_0011100n,
      width: 3,
      height: 3
    },
    {
      shape: 0b0010000_0010000_0010000_0010000n,
      width: 1,
      height: 4
    },
    {
      shape: 0b0011000_0011000n,
      width: 2,
      height: 2
    }
  ];

  private currentRockIndex: number = 0;
  private windDirections: WindDirection[];
  private currentWindIndex: number = 0;

  private nextWind(): WindDirection {
    const dir = this.windDirections[this.currentWindIndex!]!;
    this.currentWindIndex = (this.currentWindIndex + 1) % this.windDirections.length;
    return dir;
  }

  private parseInput(input: string): WindDirection[] {
    const windDirections = [];
    for (const dir of input) {
      windDirections.push(dir === '>' ? WindDirection.Right : WindDirection.Left);
    }
    return windDirections;
  }

  private positionRock(rock: Rock, yPosition: number): bigint {
    const shiftAmount = BigInt(Math.max(0, yPosition - rock.height + 1)) * BigInt(this.LEVEL_BITS);
    return rock.shape << shiftAmount;
  }

  private tryMoveRockLeft(rock: Rock, yPosition: number, tower: bigint): Rock {
    let newRockNumber = 0n;
    let canMove = true;
    
    for (let level = 0; level < rock.height; level++) {
      const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
      const currentLevel = (rock.shape >> levelShift) & BigInt(this.LEVEL_MASK);
      
      const newLevel = currentLevel << 1n;
      
      if ((newLevel & 0b10000000n) !== 0n) {
        canMove = false;
        break;
      }
      
      const towerLevel = yPosition - level;
      if (towerLevel >= 0) {
        const towerLevelValue = this.getTowerLevel(tower, towerLevel);
        if ((Number(newLevel) & towerLevelValue) !== 0) {
          canMove = false;
          break;
        }
      }
      
      newRockNumber |= newLevel << levelShift;
    }
    
    return canMove ? { ...rock, shape: newRockNumber } : rock;
  }

  private tryMoveRockRight(rock: Rock, yPosition: number, tower: bigint): Rock {
    let newRockNumber = 0n;
    let canMove = true;
    
    for (let level = 0; level < rock.height; level++) {
      const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
      const currentLevel = (rock.shape >> levelShift) & BigInt(this.LEVEL_MASK);
      
      const newLevel = currentLevel >> 1n;
      
      const towerLevel = yPosition - level;
      if (towerLevel >= 0) {
        const towerLevelValue = this.getTowerLevel(tower, towerLevel);
        if ((Number(newLevel) & towerLevelValue) !== 0) {
          canMove = false;
          break;
        }
      }
      
      newRockNumber |= newLevel << levelShift;
    }
    
    return canMove ? { ...rock, shape: newRockNumber } : rock;
  }

  private tryMoveRockDown(rock: Rock, yPosition: number, tower: bigint): { newY: number; canMove: boolean } {
    const newY = yPosition - 1;
    
    if (newY < 0) {
      return { newY: yPosition, canMove: false };
    }
    
    const positionedRock = this.positionRock(rock, newY);
    const hasCollision = this.checkCollisionInNumber(positionedRock, tower);
    
    return { newY: hasCollision ? yPosition : newY, canMove: !hasCollision };
  }

  private moveRockLeft(rock: Rock): Rock {
    let newRockNumber = 0n;
    let canMove = true;
    
    for (let level = 0; level < rock.height; level++) {
      const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
      const currentLevel = (rock.shape >> levelShift) & BigInt(this.LEVEL_MASK);
      const newLevel = currentLevel << 1n;
      
      if ((newLevel & 0b10000000n) !== 0n) {
        canMove = false;
        break;
      }
      
      newRockNumber |= newLevel << levelShift;
    }
    
    return canMove ? { ...rock, shape: newRockNumber } : rock;
  }

  private moveRockRight(rock: Rock): Rock {
    let newRockNumber = 0n;
    
    for (let level = 0; level < rock.height; level++) {
      const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
      const currentLevel = (rock.shape >> levelShift) & BigInt(this.LEVEL_MASK);
      const newLevel = currentLevel >> 1n;
      newRockNumber |= newLevel << levelShift;
    }
    
    return { ...rock, shape: newRockNumber };
  }

  private checkCollisionInNumber(rockNumber: bigint, towerNumber: bigint): boolean {
    return (rockNumber & towerNumber) !== 0n;
  }

  private placeRockInTower(rockNumber: bigint, towerNumber: bigint): bigint {
    return towerNumber | rockNumber;
  }

  private getTowerLevel(towerNumber: bigint, level: number): number {
    const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
    return Number((towerNumber >> levelShift) & BigInt(this.LEVEL_MASK));
  }

  private setTowerLevel(towerNumber: bigint, level: number, value: number): bigint {
    const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
    const mask = BigInt(this.LEVEL_MASK) << levelShift;
    
    return (towerNumber & ~mask) | (BigInt(value) << levelShift);
  }

  private moveRockDown(currentY: number): number {
    return currentY - 1;
  }

  part1(input: string, isTest: boolean = false): string | number {
    const windPattern = input.trim();
    let windIndex = 0;
    
    let tower = 0n;
    let towerHeight = 0;
    
    for (let rockCount = 0; rockCount < 2022; rockCount++) {
      const rockTemplate = this.rocks[rockCount % this.rocks.length]!;
      let currentRock = rockTemplate;
      let rockY = towerHeight + 3;
      

      
      while (true) {
        const windChar = windPattern[windIndex % windPattern.length];
        windIndex++;
        
        if (windChar === '<') {
          const pushedRock = this.tryMoveRockLeft(currentRock, rockY, tower);
          if (pushedRock.shape !== currentRock.shape) {
            currentRock = pushedRock;
          }
        } else if (windChar === '>') {
          const pushedRock = this.tryMoveRockRight(currentRock, rockY, tower);
          if (pushedRock.shape !== currentRock.shape) {
            currentRock = pushedRock;
          }
        }
        
        const downResult = this.tryMoveRockDown(currentRock, rockY, tower);
        if (!downResult.canMove) {
          const positionedRock = this.positionRock(currentRock, rockY);
          tower = this.placeRockInTower(positionedRock, tower);
          
          const newHeight = rockY + currentRock.height;
          if (newHeight > towerHeight) {
            towerHeight = newHeight;
          }
          

          break;
        } else {
          rockY = downResult.newY;
        }
      }
    }
    
    return towerHeight;
  }

  private printRock(rock: Rock): void {
    for (let level = rock.height - 1; level >= 0; level--) {
      const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
      const levelValue = Number((rock.shape >> levelShift) & BigInt(this.LEVEL_MASK));
      const binary = levelValue.toString(2).padStart(7, '0');
      const visual = binary.replace(/1/g, '#').replace(/0/g, '.');
      console.log(`${binary} → ${visual}`);
    }
  }

  private printTower(tower: number[]): void {
    for (let i = tower.length - 1; i >= 0; i--) {
      const row = tower[i] ?? 0;
      const binary = row.toString(2).padStart(7, '0');
      const visual = binary.replace(/1/g, '#').replace(/0/g, '.');
      console.log(`${i.toString().padStart(2, ' ')}: ${binary} → |${visual}|`);
    }
    console.log(`    --------- → |-------|`);
  }

  private printBigNumberTower(towerNumber: bigint, maxLevels: number): void {
    for (let level = maxLevels - 1; level >= 0; level--) {
      const levelValue = this.getTowerLevel(towerNumber, level);
      const binary = levelValue.toString(2).padStart(7, '0');
      const visual = binary.replace(/1/g, '#').replace(/0/g, '.');
      console.log(`${level.toString().padStart(2, ' ')}: ${binary} → |${visual}|`);
    }
    console.log(`    --------- → |-------|`);
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);
    
    return 0;
  }
}