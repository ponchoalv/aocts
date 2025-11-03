/**
 * Solution template for Advent of Code challenges
 */

export interface Solution {
  part1(input: string): string | number;
  part2(input: string): string | number;
}

export abstract class BaseSolution implements Solution {
  abstract part1(input: string): string | number;
  abstract part2(input: string): string | number;

  /**
   * Parse input into lines
   */
  protected lines(input: string): string[] {
    return input.trim().split('\n');
  }

  /**
   * Parse input into numbers
   */
  protected numbers(input: string): number[] {
    return this.lines(input).map(line => parseInt(line, 10));
  }

  /**
   * Parse input into grid
   */
  protected grid(input: string): string[][] {
    return this.lines(input).map(line => [...line]);
  }

  /**
   * Parse input into number grid
   */
  protected numberGrid(input: string): number[][] {
    return this.lines(input).map(line => [...line].map(c => parseInt(c, 10)));
  }

  /**
   * Extract all numbers from input
   */
  protected extractNumbers(input: string): number[] {
    return input.match(/-?\d+/g)?.map(n => parseInt(n, 10)) ?? [];
  }

  /**
   * Split input by blank lines
   */
  protected sections(input: string): string[] {
    return input.trim().split('\n\n');
  }
}