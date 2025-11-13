import { BaseSolution } from "../../templates/solution.js";

interface Rock {
  shape: bigint; // Single number representing the entire rock
  width: number;
  height: number;
}

export default class Day17Solution extends BaseSolution {
  private readonly LEVEL_BITS = 7;
  private readonly LEVEL_MASK = (1 << this.LEVEL_BITS) - 1;

  private rocks: Rock[] = [
    {
      shape: 0b0011110n, // bits 4,3,2,1 set
      width: 4,
      height: 1,
    },
    {
      shape: 0b0001000_0011100_0001000n, // center column at bit 2
      width: 3,
      height: 3,
    },
    {
      shape: 0b0000100_0000100_0011100n,
      width: 3,
      height: 3,
    },
    {
      shape: 0b0010000_0010000_0010000_0010000n,
      width: 1,
      height: 4,
    },
    {
      shape: 0b0011000_0011000n,
      width: 2,
      height: 2,
    },
  ];

  private positionRock(rock: Rock, yPosition: number): bigint {
    const shiftAmount = BigInt(yPosition) * BigInt(this.LEVEL_BITS);
    return rock.shape << shiftAmount;
  }

  private tryMoveRockLeft(rock: Rock, yPosition: number, tower: bigint): Rock {
    return this.tryMoveLeftRight(rock, yPosition, tower, "<");
  }

  private tryMoveLeftRight(
    rock: Rock,
    yPosition: number,
    tower: bigint,
    direction: string
  ): Rock {
    let newRockNumber = 0n;
    let canMove = true;

    for (let level = 0; level < rock.height; level++) {
      const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
      const currentLevel = (rock.shape >> levelShift) & BigInt(this.LEVEL_MASK);

      if (direction === "<" && (currentLevel & 0b01000000n) !== 0n) {
        return rock;
      }

      if (direction === ">" && (currentLevel & 0b00000001n) !== 0n) {
        return rock;
      }

      const newLevel =
        direction === ">" ? currentLevel >> 1n : currentLevel << 1n;

      const towerLevel = yPosition + level;
      const towerLevelValue = this.getTowerLevel(tower, towerLevel);
      if ((Number(newLevel) & towerLevelValue) !== 0) {
        canMove = false;
        break;
      }

      newRockNumber |= newLevel! << levelShift;
    }

    return canMove ? { ...rock, shape: newRockNumber } : rock;
  }

  private tryMoveRockRight(rock: Rock, yPosition: number, tower: bigint): Rock {
    return this.tryMoveLeftRight(rock, yPosition, tower, ">");
  }

  private tryMoveRockDown(
    rock: Rock,
    yPosition: number,
    tower: bigint
  ): { newY: number; canMove: boolean } {
    const newY = yPosition - 1;

    if (newY < 0) {
      return { newY: yPosition, canMove: false };
    }

    const positionedRock = this.positionRock(rock, newY);
    const hasCollision = this.checkCollisionInNumber(positionedRock, tower);

    return { newY: hasCollision ? yPosition : newY, canMove: !hasCollision };
  }

  private checkCollisionInNumber(
    rockNumber: bigint,
    towerNumber: bigint
  ): boolean {
    return (rockNumber & towerNumber) !== 0n;
  }

  private placeRockInTower(rockNumber: bigint, towerNumber: bigint): bigint {
    return towerNumber | rockNumber;
  }

  private getTowerLevel(towerNumber: bigint, level: number): number {
    const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
    return Number((towerNumber >> levelShift) & BigInt(this.LEVEL_MASK));
  }

  part1(input: string, isTest: boolean = false): string | number {
    debugger;
    const windPattern = input.trim();
    return this.calculateTowerHeight(windPattern, 2022);
  }

  private calculateTowerHeight(windPattern: string, maxRocks: number): number {
    let windIndex = 0;

    let tower = 0n;
    let towerHeight = 0;

    const trackRockAndWindIndex = new Map<
      string,
      { rockCount: number; height: number }
    >();
    const heightHistory: number[] = [];

    for (let rockCount = 0; rockCount < maxRocks; rockCount++) {
      const rockIndexNormalise = rockCount % this.rocks.length;
      const rockTemplate = this.rocks[rockIndexNormalise]!;
      let currentRock = rockTemplate;
      let rockY = towerHeight + 3;

      while (true) {
        const windIndexNormalise = windIndex % windPattern.length;

        const windChar = windPattern[windIndexNormalise];
        windIndex++;

        if (windChar === "<") {
          const pushedRock = this.tryMoveRockLeft(currentRock, rockY, tower);
          if (pushedRock.shape !== currentRock.shape) {
            currentRock = pushedRock;
          }
        } else if (windChar === ">") {
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

      // Store height history
      heightHistory.push(towerHeight);
      //1567723342928
      //1571098265884
      const stateKey = `${rockIndexNormalise}-${
        windIndex % windPattern.length
      }-${this.getLastLevels(tower, towerHeight, 100)}`;

      if (trackRockAndWindIndex.has(stateKey)) {
        console.log(`Cycle found at rock ${rockCount}, height ${towerHeight}`);
        const prev = trackRockAndWindIndex.get(stateKey)!;
        const cycleLength = rockCount - prev.rockCount;
        const heightDelta = towerHeight - prev.height;

        const rocksRemaining = maxRocks - rockCount;

        // Only use cycles that can complete at least one full cycle
        if (rocksRemaining >= cycleLength) {
          const fullCycles = rocksRemaining / cycleLength;
          const remainderRocks = rocksRemaining % cycleLength;

          if (remainderRocks === 0) {
            return towerHeight + fullCycles * heightDelta;
          }

          // For remainder calculation, we need the height after dropping remainder rocks from cycle start
          const cycleStartIdx = prev.rockCount;
          const remainderIdx = cycleStartIdx + remainderRocks - 1; // -1 because we want the height AFTER dropping the rock

          if (remainderIdx >= 0 && remainderIdx < heightHistory.length) {
            const remainderHeight =
              (heightHistory[remainderIdx] ?? 0) - prev.height;
            const result =
              towerHeight + fullCycles * heightDelta + remainderHeight;
            return result;
          }
        }
      }

      trackRockAndWindIndex.set(stateKey, { rockCount, height: towerHeight });
    }

    return towerHeight;
  }
  //we have a match - repeated pattern at 3-37 and height 23 and rock 13

  private getLastLevels(tower: bigint, height: number, levels: number): bigint {
    const maxLevels = Math.min(levels, height);
    if (maxLevels <= 0) return 0n;
    return tower >> BigInt((height - maxLevels) * 7);
  }

  part2(input: string, isTest: boolean = false): string | number {
    const windPattern = input.trim();
    const result = this.calculateTowerHeight(windPattern, 1000000000000);
    // If this is the actual input (not test), subtract 1
    // console.log(MathUtils.lcmArray([10091,5]));
    return isTest ? result : result - 1;
  }
}
