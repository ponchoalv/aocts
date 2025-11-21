import { BaseSolution } from "../../templates/solution.js";
import { Direction, Grid, GridUtils } from "@utils/grid.js";
import { InputParser } from "@utils/input";

interface DirectionToNumber {
  [key: string]: number;
}

// what would be need to do for a particular face if it goes out of bounds
interface MovementOnWrap {
  east: (
    position: { x: number; y: number; value: string },
    direction: Direction
  ) => void;
  south: (
    position: { x: number; y: number; value: string },
    direction: Direction
  ) => void;
  west: (
    position: { x: number; y: number; value: string },
    direction: Direction
  ) => void;
  north: (
    position: { x: number; y: number; value: string },
    direction: Direction
  ) => void;
}

// what are the for wraps based on map face
interface MovementOnWrapMap {
  [key: string]: MovementOnWrap;
}

// Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^)
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
        // console.log(currentDirection, instruction, currentPos);
        for (let i = 0; i < Number(instruction); i++) {
          // we move on current direction
          this.moveAndWrapPos(currentPos, grid, currentDirection);
          const currentValue = grid.get(currentPos.x, currentPos.y);
          if (currentValue === "#") {
            // wall, move back
            this.moveAndWrapPos(currentPos, grid, currentDirection, true);
            break;
          } else if (!currentValue || currentValue === " ") {
            // empty or out of bounds, move with wrap %
            let tempPos = { ...currentPos };

            // find the next not empty space wraping
            while (
              !grid.get(tempPos.x, tempPos.y) ||
              grid.get(tempPos.x, tempPos.y) === " "
            ) {
              this.moveAndWrapPos(tempPos, grid, currentDirection);
            }

            // after looking for the next not empty tile we might land in a #
            // this means we need to go back from were we started - 1
            if (grid.get(tempPos.x, tempPos.y) === "#") {
              this.moveAndWrapPos(currentPos, grid, currentDirection, true);
              currentPos.value = grid.get(currentPos.x, currentPos.y)!;
              break;
            }
            currentPos = { ...tempPos };
          }
          currentPos.value = grid.get(currentPos.x, currentPos.y)!;
        }
      }
    }

    console.log(currentPos, currentDirection);

    // 1484 is the correct answer for our input
    return (
      1000 * (currentPos.y + 1) +
      4 * (currentPos.x + 1) +
      DIRECTION_TO_NUMBER[currentDirection.name]!
    );
  }

  private moveAndWrapPos(
    currentPos: { x: number; y: number; value: string },
    grid: Grid<string>,
    direction: Direction,
    rewind: boolean = false
  ) {
    if (rewind) {
      currentPos.x -= direction.dx;
      currentPos.x %= grid.width;
      currentPos.y -= direction.dy;
      currentPos.y %= grid.height;
    } else {
      currentPos.x += direction.dx;
      currentPos.x %= grid.width;
      currentPos.y += direction.dy;
      currentPos.y %= grid.height;
    }

    if (currentPos.x < 0) {
      currentPos.x += grid.width;
      currentPos.value = grid.get(currentPos.x, currentPos.y)!;
    }

    if (currentPos.y < 0) {
      currentPos.y += grid.height;
      currentPos.value = grid.get(currentPos.x, currentPos.y)!;
    }
  }

  part2(input: string, isTest: boolean = false): string | number {
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

    const faces: Set<string> = new Set<string>();
    const N = isTest ? 4 : 50;

    let MovementOnWrapMappings: MovementOnWrapMap;
    if (isTest) {
      // test faces Set(6) { '2-0', '0-1', '1-1', '2-1', '2-2', '3-2' }
      MovementOnWrapMappings = {
        "2-0": {
          // go to 3-2 diection south (clockwise)
          east: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("east"),
          // normal wrap
          south: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("south"),
          // go to 0-1 direction south (counter clockwise)
          west: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("west"),
          // continue normal wrap
          north: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("north"),
        },
        "0-1": {
          // normal wrap
          east: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("east"),
          // 2-2 direction up
          south: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("south"),
          // 3-2 directio up
          west: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("west"),
          // 2-0 down
          north: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("north"),
        },
        "1-1": {
          east: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("east"),
          south: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("south"),
          west: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("west"),
          north: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("north"),
        },
        "2-1": {
          east: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("east"),
          south: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("south"),
          west: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("west"),
          north: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("north"),
        },
        "2-2": {
          east: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("east"),
          south: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("south"),
          west: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("west"),
          north: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("north"),
        },
        "3-2": {
          east: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("east"),
          south: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("south"),
          west: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("west"),
          north: (
            position: { x: number; y: number; value: string },
            direction: Direction
          ) => console.log("north"),
        },
      };
    } else {
      // real input faces Set(6) { '1-0', '2-0', '1-1', '0-2', '1-2', '0-3' }
    }

    // console.log(grid);

    for (const position of grid.positions()) {
      if (position.value && position.value !== " ") {
        faces.add(
          `${Math.floor(position.x / N)}-${Math.floor(position.y / N)}`
        );
      }
    }

    console.log(faces);

    return 0;
  }
}
