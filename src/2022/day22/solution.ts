import { BaseSolution } from "../../templates/solution.js";
import { Direction, Grid, GridUtils } from "@utils/grid.js";
import { InputParser } from "@utils/input";

interface DirectionToNumber {
  [key: string]: number;
}

const DIRECTION_TO_NUMBER: DirectionToNumber = {
  E: 0,
  S: 1,
  W: 2,
  N: 3,
} as const;

export default class Day22Solution extends BaseSolution {
  part1(input: string, isTest: boolean = false): string | number {
    const [inputGrid, instructionsInput] = input.split("\n\n");
    const instructions: (number | string)[] = [];

    const match = instructionsInput!.match(/(\d+)|[RL]/g);
    for (let i = 0; i < match!.length; i++) {
      if (!isNaN(parseInt(match![i]!))) {
        instructions.push(parseInt(match![i]!));
      } else {
        instructions.push(match![i]!);
      }
    }

    const gridData = InputParser.grid(inputGrid!);
    const grid = new Grid(gridData);

    let initialPosition: { x: number; y: number; value: string };
    for (const position of grid.positions()) {
      if (position.value !== " ") {
        initialPosition = position;
        break;
      }
    }

    console.log(initialPosition!);

    let currentPos: { x: number; y: number; value: string } = initialPosition!;
    let currentDirection: Direction = GridUtils.DIRECTIONS_4[1]!;

    console.log(`width: ${grid.width}, height: ${grid.height}`);
    for (const instruction of instructions) {
      // console.log(currentPos, currentDirection);
      if (instruction === "R") {
        currentDirection = GridUtils.rotateClockwise(currentDirection);
      } else if (instruction === "L") {
        currentDirection = GridUtils.rotateCounterClockwise(currentDirection);
      } else {
        // is a number
        console.log(currentDirection, instruction, currentPos);
        for (let i = 0; i < Number(instruction); i++) {
          // we move on current direction
          currentPos.x += currentDirection.dx;
          currentPos.x %= grid.width;
          currentPos.y += currentDirection.dy;
          currentPos.y %= grid.height;
          this.wrapPos(currentPos, grid);
          const currentValue = grid.get(currentPos.x, currentPos.y);
          if (currentValue === "#") {
            // wall, move back
            currentPos.x -= currentDirection.dx;
            currentPos.x %= grid.width;
            currentPos.y -= currentDirection.dy;
            currentPos.y %= grid.height;
            this.wrapPos(currentPos, grid);
          } else if (!currentValue || currentValue === " ") {
            // empty or out of bounds, move with wrap %
            let tempPos = { ...currentPos };

            // find the next not empty space wraping
            while (
              !grid.get(tempPos.x, tempPos.y) ||
              grid.get(tempPos.x, tempPos.y) === " "
            ) {
              tempPos.x += currentDirection.dx % grid.width;
              tempPos.x %= grid.width;
              tempPos.y += currentDirection.dy % grid.height;
              tempPos.y %= grid.height;
              this.wrapPos(tempPos, grid);
            }

            // after looking for the next not empty tile we might land in a #
            // this means we need to go back from were we started - 1
            if (grid.get(tempPos.x, tempPos.y) === "#") {
              currentPos.x -= 2 * currentDirection.dx;
              currentPos.x %= grid.width;
              currentPos.y -= 2 * currentDirection.dy;
              currentPos.y %= grid.height;
              this.wrapPos(currentPos, grid);
              tempPos = { ...currentPos };
            }
            currentPos = { ...tempPos };
          }
          currentPos.value = grid.get(currentPos.x, currentPos.y)!;
        }
      }
    }

    console.log(currentPos);

    // 35368 is to high
    // 43472
    return (
      1000 * (currentPos.y + 1) +
      4 * (currentPos.x + 1) +
      DIRECTION_TO_NUMBER[currentDirection.name]!
    );
  }

  private wrapPos(
    currentPos: { x: number; y: number; value: string },
    grid: Grid<string>
  ) {
    if (currentPos.x < 0) {
      // console.log("before wrap", currentPos);
      currentPos.x += grid.width - 1;
      currentPos.value = grid.get(currentPos.x, currentPos.y)!;
      // console.log("after wrap", currentPos);
    }

    if (currentPos.y < 0) {
      // console.log("before wrap", currentPos);
      currentPos.y += grid.height - 1;
      currentPos.value = grid.get(currentPos.x, currentPos.y)!;
      // console.log("after wrap", currentPos);
    }
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);

    // TODO: Implement part 2
    return 0;
  }
}
