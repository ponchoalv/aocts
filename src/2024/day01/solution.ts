import { BaseSolution } from '../../templates/solution.js';

export default class Day01Solution extends BaseSolution {
  part1(input: string): string | number {
    const lines = this.lines(input);
    
    // Example: Sum all numbers in input
    const numbers = this.extractNumbers(input);
    return numbers.reduce((sum, num) => sum + num, 0);
  }

  part2(input: string): string | number {
    const lines = this.lines(input);
    
    // Example: Product of all numbers
    const numbers = this.extractNumbers(input);
    return numbers.reduce((product, num) => product * num, 1);
  }
}