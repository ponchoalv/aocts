import { BaseSolution } from "../../templates/solution.js";

enum WindDirection {
  Left = -1,
  Right = 1,
}

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
    return this.tryMoveLeftRight(rock, yPosition, tower, WindDirection.Left);
  }

  private tryMoveLeftRight(
    rock: Rock,
    yPosition: number,
    tower: bigint,
    direction: WindDirection,
  ): Rock {
    let newRockNumber = 0n;
    let canMove = true;

    for (let level = 0; level < rock.height; level++) {
      const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
      const currentLevel = (rock.shape >> levelShift) & BigInt(this.LEVEL_MASK);

      if (
        direction === WindDirection.Left &&
        (currentLevel & 0b01000000n) !== 0n
      ) {
        return rock;
      }

      if (
        direction === WindDirection.Right &&
        (currentLevel & 0b00000001n) !== 0n
      ) {
        return rock;
      }

      const newLevel =
        direction === WindDirection.Right
          ? currentLevel >> 1n
          : currentLevel << 1n;

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
    return this.tryMoveLeftRight(rock, yPosition, tower, WindDirection.Right);
  }

  private tryMoveRockDown(
    rock: Rock,
    yPosition: number,
    tower: bigint,
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
    towerNumber: bigint,
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
    const windPattern = input.trim();
    return this.calculateTowerHeight(windPattern, 2022);
  }

  private calculateTowerHeight(windPattern: string, maxRocks: number): number {
    let windIndex = 0;

    let tower = 0n;
    let towerHeight = 0;

    const trackRockAndWindIndex = new Set<string>();

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

      // console.log(
      //   `towerHeight-${towerHeight}-${(tower >> BigInt(towerHeight * 7 - 4 * 7)).toString(2).padStart(4 * 7, "0")}`,
      // );
      debugger;

      if (
        trackRockAndWindIndex.has(
          `${rockIndexNormalise}-${windIndex % windPattern.length}-${this.getLastLevels(tower, towerHeight, 100)}`,
        ) &&
        (maxRocks - 1) % rockCount === 0
      ) {
        console.log(
          `we have a match - repeated pattern at ${rockIndexNormalise}-${windIndex % windPattern.length} and height ${towerHeight} and rock ${rockCount} and last level shape ${this.getLastLevels(
            tower,
            towerHeight,
            10,
          )
            .toString(2)
            .padStart(10 * 7, "0")}`,
        );
        // 1514285714288
        return towerHeight * ((maxRocks - 1) / rockCount);
      } else {
        trackRockAndWindIndex.add(
          `${rockIndexNormalise}-${windIndex % windPattern.length}-${this.getLastLevels(tower, towerHeight, 100)}`,
        );
      }
    }
    //519 and rock 337
    return towerHeight;
  }
  //we have a match - repeated pattern at 3-37 and height 23 and rock 13

  private getLastLevels(tower: bigint, height: number, levels: number): number {
    return Number(tower >> BigInt(height * 7 - levels * 7));
  }

  private printRock(rock: Rock): void {
    for (let level = rock.height - 1; level >= 0; level--) {
      const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
      const levelValue = Number(
        (rock.shape >> levelShift) & BigInt(this.LEVEL_MASK),
      );
      const binary = levelValue.toString(2).padStart(7, "0");
      const visual = binary.replace(/1/g, "#").replace(/0/g, ".");
    }
  }

  private printTower(tower: number[]): void {
    for (let i = tower.length - 1; i >= 0; i--) {
      const row = tower[i] ?? 0;
      const binary = row.toString(2).padStart(7, "0");
      const visual = binary.replace(/1/g, "#").replace(/0/g, ".");
    }
  }

  private printBigNumberTower(towerNumber: bigint, maxLevels: number): void {
    for (let level = maxLevels - 1; level >= 0; level--) {
      const levelValue = this.getTowerLevel(towerNumber, level);
      const binary = levelValue.toString(2).padStart(7, "0");
      const visual = binary.replace(/1/g, "#").replace(/0/g, ".");
    }
  }

  part2(input: string, isTest: boolean = false): string | number {
    const windPattern = input.trim();
    return this.calculateTowerHeight(windPattern, 1000000000000);
  }
}
