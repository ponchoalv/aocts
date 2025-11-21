import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { Solution } from "./templates/solution.js";

interface SolutionModule {
  default: new () => Solution;
}

interface BenchmarkResult {
  part1: {
    result: string | number;
    time: number;
  };
  part2: {
    result: string | number;
    time: number;
  };
  totalTime: number;
}

export class SolutionRunner {
  private year: number;
  private day: number;
  private onlyPart2: boolean;

  constructor(year: number, day: number, onlyPart2: boolean = false) {
    this.year = year;
    this.day = day;
    this.onlyPart2 = onlyPart2;
  }

  /**
   * Run solution with timing and formatting
   */
  async run(): Promise<void> {
    const dayStr = this.day.toString().padStart(2, "0");
    const solutionPath = join(
      process.cwd(),
      "src",
      this.year.toString(),
      `day${dayStr}`,
      "solution.ts"
    );
    const inputPath = join(
      process.cwd(),
      "src",
      this.year.toString(),
      `day${dayStr}`,
      "input.txt"
    );
    const testPath = join(
      process.cwd(),
      "src",
      this.year.toString(),
      `day${dayStr}`,
      "test.txt"
    );

    if (!existsSync(solutionPath)) {
      console.error(chalk.red(`Solution not found: ${solutionPath}`));
      return;
    }

    if (!existsSync(inputPath)) {
      console.error(chalk.red(`Input not found: ${inputPath}`));
      return;
    }

    try {
      const solutionModule = (await import(solutionPath)) as SolutionModule;
      const SolutionClass = solutionModule.default;
      const solution = new SolutionClass();

      const input = readFileSync(inputPath, "utf-8").trimEnd();

      console.log(
        chalk.blue.bold(`🎄 Advent of Code ${this.year} - Day ${this.day} 🎄`)
      );
      console.log();

      // Run with test input if available
      if (existsSync(testPath)) {
        const testInput = readFileSync(testPath, "utf-8").trimEnd();
        console.log(chalk.yellow("📝 Test Results:"));
        await this.runBenchmark(solution, testInput, true, this.onlyPart2);
        console.log();
      }

      // Run with actual input
      console.log(chalk.green("🚀 Actual Results:"));
      const benchmark = await this.runBenchmark(
        solution,
        input,
        false,
        this.onlyPart2
      );

      console.log();
      console.log(
        chalk.cyan(
          `⏱️  Total execution time: ${this.formatTime(benchmark.totalTime)}`
        )
      );

      if (benchmark.totalTime > 1000) {
        console.log(
          chalk.yellow(
            "⚠️  Solution took longer than 1 second. Consider optimizing."
          )
        );
      }
    } catch (error) {
      console.error(chalk.red("Error running solution:"), error);
    }
  }

  /**
   * Run benchmark for both parts
   */
  private async runBenchmark(
    solution: Solution,
    input: string,
    isTest: boolean = false,
    onlyPart2 = false
  ): Promise<BenchmarkResult> {
    const prefix = isTest ? "  " : "";
    let result1;
    let time1;

    if (!onlyPart2) {
      // Part 1
      const start1 = performance.now();
      result1 = solution.part1(input, isTest);
      const end1 = performance.now();
      time1 = end1 - start1;

      console.log(
        `${prefix}${chalk.bold("Part 1:")} ${chalk.white(result1)} ${chalk.gray(`(${this.formatTime(time1)})`)}`
      );
    }

    // Part 2
    const start2 = performance.now();
    const result2 = solution.part2(input, isTest);
    const end2 = performance.now();
    const time2 = end2 - start2;

    console.log(
      `${prefix}${chalk.bold("Part 2:")} ${chalk.white(result2)} ${chalk.gray(`(${this.formatTime(time2)})`)}`
    );

    return {
      part1: { result: result1!, time: time1! },
      part2: { result: result2, time: time2 },
      totalTime: time1 ?? 0 + time2,
    };
  }

  /**
   * Format time in appropriate units
   */
  private formatTime(ms: number): string {
    if (ms < 1) {
      return `${(ms * 1000).toFixed(2)}μs`;
    } else if (ms < 1000) {
      return `${ms.toFixed(2)}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  }
}

/**
 * Main runner function
 */
async function main() {
  const args = process.argv.slice(2);
  console.log(args);
  if (args.length < 2) {
    console.error("Usage: npm run solve <year> <day>");
    console.error("Example: npm run solve 2024 1");
    process.exit(1);
  }

  const year = parseInt(args[0]!, 10);
  const day = parseInt(args[1]!, 10);
  const onlyPart2 = args[2]! === "true";
  console.log(onlyPart2);

  if (isNaN(year) || isNaN(day)) {
    console.error("Year and day must be valid numbers");
    process.exit(1);
  }

  const runner = new SolutionRunner(year, day, onlyPart2);
  await runner.run();
}

// Run if this file is executed directly
if (
  process.argv[1]?.endsWith("runner.ts") ||
  process.argv[1]?.endsWith("runner.js")
) {
  main().catch(console.error);
}
