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
      shape: 0b0011110n,
      width: 4,
      height: 1,
    },
    {
      shape: 0b0001000_0011100_0001000n,
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
    direction: WindDirection
  ): Rock {
    let newRockNumber = 0n;
    let canMove = true;

    for (let level = 0; level < rock.height; level++) {
      const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
      const currentLevel = (rock.shape >> levelShift) & BigInt(this.LEVEL_MASK);
      const newLevel = direction === WindDirection.Right ? currentLevel >> 1n : currentLevel << 1n;

      if (direction == WindDirection.Left && (newLevel & 0b10000000n) !== 0n) {
        canMove = false;
        break;
      }
      
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
    const windPattern = input.trim();
    let windIndex = 0;

    let tower = 0n;
    let towerHeight = 0;

    // 🔍 DEMO: Level extraction for multi-level pieces
    // if (isTest) {
    //   console.log("\n🔍 DEMO: How to extract individual levels from cross:");
    //   const cross = this.rocks[1]!; // Cross shape
    //   console.log(`Cross shape: ${cross.shape.toString(2).padStart(21, '0')}`);
    //   console.log(`Cross has ${cross.height} levels`);
    //
    //   for (let level = 0; level < cross.height; level++) {
    //     const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
    //     const levelValue = (cross.shape >> levelShift) & BigInt(this.LEVEL_MASK);
    //     const binary = levelValue.toString(2).padStart(7, '0');
    //     const visual = binary.replace(/1/g, '#').replace(/0/g, '.');
    //     console.log(`Level ${level}: ${binary} = ${visual} (decimal: ${levelValue})`);
    //   }
    //
    //   console.log("\n🔄 Now let's move level 1 (middle) to the right:");
    //   const level1Shift = BigInt(1) * BigInt(this.LEVEL_BITS);
    //   const level1Value = (cross.shape >> level1Shift) & BigInt(this.LEVEL_MASK);
    //   console.log(`Original level 1: ${level1Value.toString(2).padStart(7, '0')} = ${level1Value.toString(2).padStart(7, '0').replace(/1/g, '#').replace(/0/g, '.')}`);
    //
    //   const movedLevel1 = level1Value >> 1n;
    //   console.log(`Moved right:      ${movedLevel1.toString(2).padStart(7, '0')} = ${movedLevel1.toString(2).padStart(7, '0').replace(/1/g, '#').replace(/0/g, '.')}`);
    //
    //   console.log("\n🔧 Reconstructing the whole cross with moved level 1:");
    //   // Keep levels 0 and 2 the same, but replace level 1
    //   const level0 = (cross.shape >> 0n) & BigInt(this.LEVEL_MASK);
    //   const level2 = (cross.shape >> 14n) & BigInt(this.LEVEL_MASK);
    //
    //   const newCross = level0 | (movedLevel1 << 7n) | (level2 << 14n);
    //   console.log(`New cross: ${newCross.toString(2).padStart(21, '0')}`);
    //
    //   // Show each level of the new cross
    //   for (let level = 0; level < 3; level++) {
    //     const levelShift = BigInt(level) * BigInt(this.LEVEL_BITS);
    //     const levelValue = (newCross >> levelShift) & BigInt(this.LEVEL_MASK);
    //     const binary = levelValue.toString(2).padStart(7, '0');
    //     const visual = binary.replace(/1/g, '#').replace(/0/g, '.');
    //     console.log(`New Level ${level}: ${binary} = ${visual}`);
    //   }
    //
    //   console.log("\n" + "=".repeat(50));
    // }

    for (let rockCount = 0; rockCount < 2022; rockCount++) {
      const rockTemplate = this.rocks[rockCount % this.rocks.length]!;
      let currentRock = rockTemplate;
      let rockY = towerHeight + 3;

      // const rockNames = [
      //   "horizontal line",
      //   "cross",
      //   "L-shape",
      //   "vertical line",
      //   "square",
      // ];
      // console.log(
      //   `\n🧱 Rock ${rockCount} (${rockNames[rockCount % rockNames.length]}):`,
      // );
      // console.log(`Starting Y: ${rockY}, Tower height: ${towerHeight}`);
      // console.log(
      //   `Rock shape: ${currentRock.shape.toString(2).padStart(21, "0")} (${currentRock.height} levels high)`,
      // );

      while (true) {
        const windChar = windPattern[windIndex % windPattern.length];
        windIndex++;
        // console.log(`Step: Y=${rockY}, Wind: ${windChar}`);

        if (windChar === "<") {
          const pushedRock = this.tryMoveRockLeft(currentRock, rockY, tower);
          if (pushedRock.shape !== currentRock.shape) {
            currentRock = pushedRock;
            // console.log(`✅ Moved LEFT successfully`);
          } else {
            // console.log(`❌ Left movement BLOCKED - checking why...`);
            // if (rockCount === 1 && rockY <= 2) {
            //   console.log(`Tower state:`);
            //   this.printBigNumberTower(tower, 10);
            //   console.log(`Cross position at Y=${rockY}:`);
            //   const crossPreview = this.positionRock(currentRock, rockY);
            //   this.printBigNumberTower(crossPreview, 10);
            // }
          }
        } else if (windChar === ">") {
          const pushedRock = this.tryMoveRockRight(currentRock, rockY, tower);
          if (pushedRock.shape !== currentRock.shape) {
            currentRock = pushedRock;
            // console.log(`✅ Moved RIGHT successfully`);
          } else {
            // console.log(`❌ Right movement BLOCKED`);
          }
        }

        // console.log(
        //   `After wind, rock shape: ${currentRock.shape.toString(2).padStart(7*currentRock.height, "0")}`,
        // );

        const downResult = this.tryMoveRockDown(currentRock, rockY, tower);
        if (!downResult.canMove) {
          const positionedRock = this.positionRock(currentRock, rockY);
          tower = this.placeRockInTower(positionedRock, tower);

          const newHeight = rockY + currentRock.height;
          if (newHeight > towerHeight) {
            towerHeight = newHeight;
          }

          windIndex++;
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
      const levelValue = Number(
        (rock.shape >> levelShift) & BigInt(this.LEVEL_MASK)
      );
      const binary = levelValue.toString(2).padStart(7, "0");
      const visual = binary.replace(/1/g, "#").replace(/0/g, ".");
      // console.log(`${binary} → ${visual}`);
    }
  }

  private printTower(tower: number[]): void {
    for (let i = tower.length - 1; i >= 0; i--) {
      const row = tower[i] ?? 0;
      const binary = row.toString(2).padStart(7, "0");
      const visual = binary.replace(/1/g, "#").replace(/0/g, ".");
      // console.log(`${i.toString().padStart(2, " ")}: ${binary} → |${visual}|`);
    }
    // console.log(`    --------- → |-------|`);
  }

  private printBigNumberTower(towerNumber: bigint, maxLevels: number): void {
    for (let level = maxLevels - 1; level >= 0; level--) {
      const levelValue = this.getTowerLevel(towerNumber, level);
      const binary = levelValue.toString(2).padStart(7, "0");
      const visual = binary.replace(/1/g, "#").replace(/0/g, ".");
      // console.log(
      //   `${level.toString().padStart(2, " ")}: ${binary} → |${visual}|`,
      // );
    }
    // console.log(`    --------- → |-------|`);
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);

    return 0;
  }
}
