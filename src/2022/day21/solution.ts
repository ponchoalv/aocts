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
  private humanDepth: number = 0;
  private humanDepthFound: boolean = false;
  private EPSILON = 0.5; // Small step for derivative approximation (cannot be 1 because would make test.txt failed)

  private parseMonkeyList(input: string) {
    const lines = this.lines(input);
    this.monkeyBussiness.clear();

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

  // this function should trend to 0 if we found
  private getDifferenceBetweenRootOperands(
    monkeyName: string,
    depth: number,
    guess: number
  ): number {
    const monkeyOperation: MonkeyOperation =
      this.monkeyBussiness.get(monkeyName)!;

    const key = `${monkeyName}-${depth}`;

    if (this.memo.has(key) && this.humanDepthFound && depth > this.humanDepth) {
      return this.memo.get(key)!;
    }

    if (monkeyName === "root") {
      return (
        this.getDifferenceBetweenRootOperands(
          monkeyOperation.left! as string,
          depth + 1,
          guess
        ) -
        this.getDifferenceBetweenRootOperands(
          monkeyOperation.right!,
          depth + 1,
          guess
        )
      );
    }

    if (monkeyName === "humn") {
      this.humanDepth = depth;
      this.humanDepthFound = true;
      return guess;
    }

    let result: number;
    switch (monkeyOperation.operation) {
      case Operation.PLUS:
        result =
          this.getDifferenceBetweenRootOperands(
            monkeyOperation.left! as string,
            depth + 1,
            guess
          ) +
          this.getDifferenceBetweenRootOperands(
            monkeyOperation.right!,
            depth + 1,
            guess
          );

        this.memo.set(key, result);
        return result;
      case Operation.LESS:
        result =
          this.getDifferenceBetweenRootOperands(
            monkeyOperation.left! as string,
            depth + 1,
            guess
          ) -
          this.getDifferenceBetweenRootOperands(
            monkeyOperation.right!,
            depth + 1,
            guess
          );
        this.memo.set(key, result);
        return result;
      case Operation.MULTIPLY:
        result =
          this.getDifferenceBetweenRootOperands(
            monkeyOperation.left! as string,
            depth + 1,
            guess
          ) *
          this.getDifferenceBetweenRootOperands(
            monkeyOperation.right!,
            depth + 1,
            guess
          );
        this.memo.set(key, result);
        return result;
      case Operation.DIVISION:
        result =
          this.getDifferenceBetweenRootOperands(
            monkeyOperation.left! as string,
            depth + 1,
            guess
          ) /
          this.getDifferenceBetweenRootOperands(
            monkeyOperation.right!,
            depth + 1,
            guess
          );
        this.memo.set(key, result);
        return result;
      default:
        this.memo.set(key, monkeyOperation.left as number);
        return monkeyOperation.left as number;
    }
  }

  private approximateDerivative(func: (num: number) => number, x: number) {
    return (func(x + this.EPSILON) - func(x)) / this.EPSILON;
  }

  private newtonSolver(
    func: (num: number) => number,
    initialGuess: number,
    tolerance: number = 1e-6,
    maxIterations: number = 100
  ): number | null {
    let x = initialGuess;

    for (let i = 0; i < maxIterations; i++) {
      let fX = func(x);
      let fPrimeX = this.approximateDerivative(func, x);

      // Check for convergence
      if (Math.abs(fX) < tolerance) {
        return x;
      }

      // Check for zero derivative (a flat spot, which makes the method fail)
      if (Math.abs(fPrimeX) < this.EPSILON) {
        console.error("Newton's method failed due to zero derivative.");
        return null;
      }

      // Newton's Formula: x_n+1 = x_n - f(x_n) / f'(x_n)
      x = x - fX / fPrimeX;
    }

    console.warn("Max iterations reached.");
    return x;
  }

  part1(input: string, isTest: boolean = false): string | number {
    this.parseMonkeyList(input);

    return this.getNumberForMonkey("root");
  }

  part2(input: string, isTest: boolean = false): string | number {
    this.parseMonkeyList(input);
    const targetFunc = (guess: number) => {
      return this.getDifferenceBetweenRootOperands("root", 0, guess);
    };

    return Math.round(this.newtonSolver(targetFunc, 200, 0.5, 100) ?? 0);
  }
}
