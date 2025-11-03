import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Script to generate a new day structure for Advent of Code
 */

function createNewDay(year: number, day: number): void {
  const dayStr = day.toString().padStart(2, '0');
  const dayDir = join(process.cwd(), 'src', year.toString(), `day${dayStr}`);

  if (existsSync(dayDir)) {
    console.log(`Day ${day} for year ${year} already exists!`);
    return;
  }

  // Create directory
  mkdirSync(dayDir, { recursive: true });

  // Create solution file
  const solutionTemplate = `import { BaseSolution } from '../../templates/solution.js';

export default class Day${dayStr}Solution extends BaseSolution {
  part1(input: string): string | number {
    const lines = this.lines(input);
    
    // TODO: Implement part 1
    return 0;
  }

  part2(input: string): string | number {
    const lines = this.lines(input);
    
    // TODO: Implement part 2
    return 0;
  }
}`;

  writeFileSync(join(dayDir, 'solution.ts'), solutionTemplate);

  // Create empty input files
  writeFileSync(join(dayDir, 'input.txt'), '');
  writeFileSync(join(dayDir, 'test.txt'), '');

  // Create README
  const readmeTemplate = `# Day ${day}: [Title]

## Part 1

[Description of part 1]

## Part 2

[Description of part 2]

## Notes

- [Any optimization notes or algorithm explanations]
`;

  writeFileSync(join(dayDir, 'README.md'), readmeTemplate);

  console.log(`✅ Created new day structure for ${year}/day${dayStr}`);
  console.log(`📁 Location: ${dayDir}`);
  console.log(`📝 Don't forget to add your puzzle input to input.txt`);
  console.log(`🧪 Add test cases to test.txt`);
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: npm run new-day <year> <day>');
    console.error('Example: npm run new-day 2024 1');
    process.exit(1);
  }

  const year = parseInt(args[0]!, 10);
  const day = parseInt(args[1]!, 10);

  if (isNaN(year) || isNaN(day) || day < 1 || day > 25) {
    console.error('Year must be a valid number and day must be between 1 and 25');
    process.exit(1);
  }

  createNewDay(year, day);
}

main();