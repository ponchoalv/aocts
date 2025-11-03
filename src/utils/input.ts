import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * High-performance input parsing utilities for Advent of Code
 */
export class InputParser {
  private static numberRegex = /-?\d+/g;
  private static digitRegex = /\d/g;

  /**
   * Read input file as string
   */
  static readInput(year: number, day: number, filename = 'input.txt'): string {
    const dayStr = day.toString().padStart(2, '0');
    const path = join(process.cwd(), 'src', year.toString(), `day${dayStr}`, filename);
    return readFileSync(path, 'utf-8').trimEnd();
  }

  /**
   * Split input into lines (optimized)
   */
  static lines(input: string): string[] {
    return input.split('\n');
  }

  /**
   * Split input into lines and convert to numbers
   */
  static numbers(input: string): number[] {
    const lines = this.lines(input);
    const result = new Array<number>(lines.length);
    for (let i = 0; i < lines.length; i++) {
      result[i] = parseInt(lines[i]!, 10);
    }
    return result;
  }

  /**
   * Extract all numbers from input (including negatives)
   */
  static extractNumbers(input: string): number[] {
    const matches = input.match(this.numberRegex);
    if (!matches) return [];
    
    const result = new Array<number>(matches.length);
    for (let i = 0; i < matches.length; i++) {
      result[i] = parseInt(matches[i]!, 10);
    }
    return result;
  }

  /**
   * Extract all digits from input
   */
  static extractDigits(input: string): number[] {
    const matches = input.match(this.digitRegex);
    if (!matches) return [];
    
    const result = new Array<number>(matches.length);
    for (let i = 0; i < matches.length; i++) {
      result[i] = parseInt(matches[i]!, 10);
    }
    return result;
  }

  /**
   * Parse input into 2D grid of characters
   */
  static grid(input: string): string[][] {
    const lines = this.lines(input);
    const result = new Array<string[]>(lines.length);
    for (let i = 0; i < lines.length; i++) {
      result[i] = [...lines[i]!];
    }
    return result;
  }

  /**
   * Parse input into 2D grid of numbers
   */
  static numberGrid(input: string): number[][] {
    const lines = this.lines(input);
    const result = new Array<number[]>(lines.length);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      const row = new Array<number>(line.length);
      for (let j = 0; j < line.length; j++) {
        row[j] = parseInt(line[j]!, 10);
      }
      result[i] = row;
    }
    return result;
  }

  /**
   * Split input by blank lines
   */
  static sections(input: string): string[] {
    return input.split('\n\n');
  }

  /**
   * Parse comma-separated values
   */
  static csv(input: string): string[] {
    return input.split(',');
  }

  /**
   * Parse comma-separated numbers
   */
  static csvNumbers(input: string): number[] {
    const parts = this.csv(input);
    const result = new Array<number>(parts.length);
    for (let i = 0; i < parts.length; i++) {
      result[i] = parseInt(parts[i]!.trim(), 10);
    }
    return result;
  }
}