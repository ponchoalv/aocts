import { BaseSolution } from "../../templates/solution.js";

enum Operation {
  PLUS,
  LESS,
  MULTIPLY,
  DIVISION,
  NOP,
}

interface MonkeyOperation {
  left: number | string;
  right?: string | undefined;
  operation: Operation;
}

export default class Day21Solution extends BaseSolution {
  private monkeyBussiness: Map<string, MonkeyOperation> = new Map<
    string,
    MonkeyOperation
  >();

  private memo: Map<string, number> = new Map<string, number>();
  private human: number = 0;
  private humanDepth: number = 0;
  private humanDepthFound: boolean = false;

  private parseMonkeyList(input: string) {
    const lines = this.lines(input);
    this.monkeyBussiness.clear();
    this.human = 0;

    for (const line of lines) {
      const match = line.match(/^(\w+): (\w+)( ([\+-\/\*]+) (\w+))?$/);
      if (match) {
        const [
          ,
          monkeyName,
          leftValue,
          secondOperation,
          operation,
          rightValue,
        ] = match;

        const monkeyOperation: MonkeyOperation = {
          left: isNaN(parseInt(leftValue!))
            ? leftValue!
            : parseInt(leftValue!)!,
          right: rightValue,
          operation: this.stringToMonkeyOpereation(operation),
        };
        this.monkeyBussiness.set(monkeyName!, monkeyOperation);
      }
    }
  }

  private stringToMonkeyOpereation(operation: string | undefined): Operation {
    switch (operation) {
      case "+":
        return Operation.PLUS;
      case "-":
        return Operation.LESS;
      case "*":
        return Operation.MULTIPLY;
      case "/":
        return Operation.DIVISION;
      default:
        return Operation.NOP;
    }
  }

  private getNumberForMonkey(monkeyName: string): number {
    const monkeyOperation: MonkeyOperation =
      this.monkeyBussiness.get(monkeyName)!;

    switch (monkeyOperation.operation) {
      case Operation.PLUS:
        return (
          this.getNumberForMonkey(monkeyOperation.left! as string) +
          this.getNumberForMonkey(monkeyOperation.right!)
        );
      case Operation.LESS:
        return (
          this.getNumberForMonkey(monkeyOperation.left! as string) -
          this.getNumberForMonkey(monkeyOperation.right!)
        );
      case Operation.MULTIPLY:
        return (
          this.getNumberForMonkey(monkeyOperation.left! as string) *
          this.getNumberForMonkey(monkeyOperation.right!)
        );
      case Operation.DIVISION:
        return (
          this.getNumberForMonkey(monkeyOperation.left! as string) /
          this.getNumberForMonkey(monkeyOperation.right!)
        );
      default:
        return monkeyOperation.left as number;
    }
  }

  private getNumbersForRoot(monkeyName: string, depth: number): number {
    const monkeyOperation: MonkeyOperation =
      this.monkeyBussiness.get(monkeyName)!;

    const key = `${monkeyName}-${depth}`;

    if (this.memo.has(key) && this.humanDepthFound && depth > this.humanDepth) {
      return this.memo.get(key)!;
    }

    if (monkeyName === "root") {
      return (
        this.getNumbersForRoot(monkeyOperation.left! as string, depth + 1) -
        this.getNumbersForRoot(monkeyOperation.right!, depth + 1)
      );
    }

    if (monkeyName === "humn") {
      this.humanDepth = depth;
      this.humanDepthFound = true;
      return this.human;
    }

    let result: number;
    switch (monkeyOperation.operation) {
      case Operation.PLUS:
        result =
          this.getNumbersForRoot(monkeyOperation.left! as string, depth + 1) +
          this.getNumbersForRoot(monkeyOperation.right!, depth + 1);

        this.memo.set(key, result);
        return result;
      case Operation.LESS:
        result =
          this.getNumbersForRoot(monkeyOperation.left! as string, depth + 1) -
          this.getNumbersForRoot(monkeyOperation.right!, depth + 1);
        this.memo.set(key, result);
        return result;
      case Operation.MULTIPLY:
        result =
          this.getNumbersForRoot(monkeyOperation.left! as string, depth + 1) *
          this.getNumbersForRoot(monkeyOperation.right!, depth + 1);
        this.memo.set(key, result);
        return result;
      case Operation.DIVISION:
        result =
          this.getNumbersForRoot(monkeyOperation.left! as string, depth + 1) /
          this.getNumbersForRoot(monkeyOperation.right!, depth + 1);
        this.memo.set(key, result);
        return result;
      default:
        this.memo.set(key, monkeyOperation.left as number);
        return monkeyOperation.left as number;
    }
  }

  part1(input: string, isTest: boolean = false): string | number {
    // console.log(this.monkeyBussiness.size);
    // console.log(this.monkeyBussiness);
    this.parseMonkeyList(input);

    return this.getNumberForMonkey("root");
  }

  part2(input: string, isTest: boolean = false): string | number {
    this.parseMonkeyList(input);
    let diff = this.getNumbersForRoot("root", 0);
    while (diff !== 0) {
      // if (diff % 10000) {
      //   console.log(this.human, diff);
      // }

      if (diff > 100000000) {
        this.human += 100000000;
      } else if (diff > 1000000) {
        this.human += 1000000;
      } else if (diff < 0 && Math.abs(diff) > 10000) {
        this.human -= 10000;
      } else {
        this.human += 1;
      }

      diff = this.getNumbersForRoot("root", 0);
    }

    return this.human;
  }
}
