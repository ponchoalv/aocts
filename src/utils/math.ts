/**
 * High-performance mathematical utilities for Advent of Code
 */
export class MathUtils {
  private static primeCache = new Map<number, boolean>();
  private static factorialCache = new Map<number, number>();

  /**
   * Fast GCD using Euclidean algorithm
   */
  static gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  /**
   * LCM using GCD
   */
  static lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b);
  }

  /**
   * LCM of array of numbers
   */
  static lcmArray(numbers: number[]): number {
    return numbers.reduce((acc, num) => this.lcm(acc, num), 1);
  }

  /**
   * GCD of array of numbers
   */
  static gcdArray(numbers: number[]): number {
    return numbers.reduce((acc, num) => this.gcd(acc, num));
  }

  /**
   * Fast modular exponentiation
   */
  static modPow(base: number, exp: number, mod: number): number {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  }

  /**
   * Sieve of Eratosthenes for generating primes up to n
   */
  static sieveOfEratosthenes(n: number): number[] {
    const isPrime = new Array(n + 1).fill(true);
    isPrime[0] = isPrime[1] = false;

    for (let i = 2; i * i <= n; i++) {
      if (isPrime[i]) {
        for (let j = i * i; j <= n; j += i) {
          isPrime[j] = false;
        }
      }
    }

    const primes: number[] = [];
    for (let i = 2; i <= n; i++) {
      if (isPrime[i]) {
        primes.push(i);
      }
    }
    return primes;
  }

  /**
   * Check if number is prime (with caching)
   */
  static isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    if (this.primeCache.has(n)) {
      return this.primeCache.get(n)!;
    }

    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) {
      if (n % i === 0) {
        this.primeCache.set(n, false);
        return false;
      }
    }

    this.primeCache.set(n, true);
    return true;
  }

  /**
   * Factorial with memoization
   */
  static factorial(n: number): number {
    if (n < 0) return 0;
    if (n <= 1) return 1;

    if (this.factorialCache.has(n)) {
      return this.factorialCache.get(n)!;
    }

    const result = n * this.factorial(n - 1);
    this.factorialCache.set(n, result);
    return result;
  }

  /**
   * Combinations (n choose k)
   */
  static combinations(n: number, k: number): number {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    k = Math.min(k, n - k); // Take advantage of symmetry
    
    let result = 1;
    for (let i = 0; i < k; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
  }

  /**
   * Manhattan distance between two points
   */
  static manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  /**
   * Euclidean distance between two points
   */
  static euclideanDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  /**
   * Sum of arithmetic sequence
   */
  static arithmeticSum(first: number, last: number, count: number): number {
    return (count * (first + last)) / 2;
  }

  /**
   * Sum of range [start, end] inclusive
   */
  static rangeSum(start: number, end: number): number {
    const count = end - start + 1;
    return (count * (start + end)) / 2;
  }

  /**
   * Clamp value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Check if number is in range [min, max] inclusive
   */
  static inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }
}