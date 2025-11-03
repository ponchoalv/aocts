import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { SolutionRunner } from '../src/runner.js';

/**
 * Benchmark script for comparing solution performance
 */

interface BenchmarkResult {
  year: number;
  day: number;
  part1Time: number;
  part2Time: number;
  totalTime: number;
}

class Benchmarker {
  async benchmarkDay(year: number, day: number): Promise<BenchmarkResult | null> {
    const dayStr = day.toString().padStart(2, '0');
    const solutionPath = join(process.cwd(), 'src', year.toString(), `day${dayStr}`, 'solution.ts');
    
    if (!existsSync(solutionPath)) {
      return null;
    }

    const runner = new SolutionRunner(year, day);
    
    // Mock the console.log to capture timing without output
    const originalLog = console.log;
    const times: number[] = [];
    
    console.log = (...args) => {
      const timeMatch = args.join(' ').match(/\(([\d.]+)(μs|ms|s)\)/);
      if (timeMatch) {
        let timeMs = parseFloat(timeMatch[1]!);
        const unit = timeMatch[2];
        
        if (unit === 'μs') timeMs /= 1000;
        else if (unit === 's') timeMs *= 1000;
        
        times.push(timeMs);
      }
    };

    try {
      await runner.run();
      console.log = originalLog;
      
      if (times.length >= 2) {
        return {
          year,
          day,
          part1Time: times[0]!,
          part2Time: times[1]!,
          totalTime: times[0]! + times[1]!
        };
      }
    } catch (error) {
      console.log = originalLog;
      console.error(`Error benchmarking ${year}/day${dayStr}:`, error);
    }

    return null;
  }

  async benchmarkYear(year: number): Promise<BenchmarkResult[]> {
    const yearDir = join(process.cwd(), 'src', year.toString());
    
    if (!existsSync(yearDir)) {
      console.error(`Year ${year} not found`);
      return [];
    }

    const days = readdirSync(yearDir)
      .filter(dir => dir.startsWith('day'))
      .map(dir => parseInt(dir.substring(3), 10))
      .filter(day => !isNaN(day))
      .sort((a, b) => a - b);

    const results: BenchmarkResult[] = [];

    console.log(`🏃 Benchmarking ${year}...`);
    
    for (const day of days) {
      process.stdout.write(`Day ${day}... `);
      const result = await this.benchmarkDay(year, day);
      
      if (result) {
        results.push(result);
        console.log(`✅ ${this.formatTime(result.totalTime)}`);
      } else {
        console.log('❌ Failed');
      }
    }

    return results;
  }

  displayResults(results: BenchmarkResult[]): void {
    if (results.length === 0) {
      console.log('No results to display');
      return;
    }

    console.log('\n📊 Benchmark Results:');
    console.log('─'.repeat(60));
    console.log('Day     Part 1      Part 2      Total');
    console.log('─'.repeat(60));

    let totalTime = 0;
    for (const result of results) {
      console.log(
        `${result.day.toString().padStart(2)} ` +
        `${this.formatTime(result.part1Time).padStart(10)} ` +
        `${this.formatTime(result.part2Time).padStart(10)} ` +
        `${this.formatTime(result.totalTime).padStart(10)}`
      );
      totalTime += result.totalTime;
    }

    console.log('─'.repeat(60));
    console.log(`Total:                            ${this.formatTime(totalTime).padStart(10)}`);

    // Performance analysis
    const slowest = results.reduce((prev, curr) => 
      curr.totalTime > prev.totalTime ? curr : prev
    );
    const fastest = results.reduce((prev, curr) => 
      curr.totalTime < prev.totalTime ? curr : prev
    );

    console.log('\n🔍 Performance Analysis:');
    console.log(`⚡ Fastest: Day ${fastest.day} (${this.formatTime(fastest.totalTime)})`);
    console.log(`🐌 Slowest: Day ${slowest.day} (${this.formatTime(slowest.totalTime)})`);
    console.log(`📈 Average: ${this.formatTime(totalTime / results.length)}`);

    const slowDays = results.filter(r => r.totalTime > 1000);
    if (slowDays.length > 0) {
      console.log(`⚠️  Days taking > 1s: ${slowDays.map(r => r.day).join(', ')}`);
    }
  }

  private formatTime(ms: number): string {
    if (ms < 1) {
      return `${(ms * 1000).toFixed(0)}μs`;
    } else if (ms < 1000) {
      return `${ms.toFixed(1)}ms`;
    } else {
      return `${(ms / 1000).toFixed(2)}s`;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const benchmarker = new Benchmarker();

  if (args.length === 0) {
    console.error('Usage: npm run benchmark <year> [day]');
    console.error('Examples:');
    console.error('  npm run benchmark 2024     # Benchmark all days in 2024');
    console.error('  npm run benchmark 2024 1   # Benchmark day 1 of 2024');
    process.exit(1);
  }

  const year = parseInt(args[0]!, 10);
  const day = args[1] ? parseInt(args[1], 10) : null;

  if (isNaN(year)) {
    console.error('Year must be a valid number');
    process.exit(1);
  }

  if (day !== null && (isNaN(day) || day < 1 || day > 25)) {
    console.error('Day must be between 1 and 25');
    process.exit(1);
  }

  if (day !== null) {
    // Benchmark specific day
    const result = await benchmarker.benchmarkDay(year, day);
    if (result) {
      benchmarker.displayResults([result]);
    } else {
      console.error(`Failed to benchmark ${year}/day${day}`);
    }
  } else {
    // Benchmark entire year
    const results = await benchmarker.benchmarkYear(year);
    benchmarker.displayResults(results);
  }
}

main().catch(console.error);