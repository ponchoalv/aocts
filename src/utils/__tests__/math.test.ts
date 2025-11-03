import { MathUtils } from '../math';

describe('MathUtils', () => {
  describe('gcd', () => {
    test('should calculate greatest common divisor correctly', () => {
      expect(MathUtils.gcd(12, 8)).toBe(4);
      expect(MathUtils.gcd(17, 13)).toBe(1);
      expect(MathUtils.gcd(100, 25)).toBe(25);
    });

    test('should handle negative numbers', () => {
      expect(MathUtils.gcd(-12, 8)).toBe(4);
      expect(MathUtils.gcd(12, -8)).toBe(4);
      expect(MathUtils.gcd(-12, -8)).toBe(4);
    });
  });

  describe('lcm', () => {
    test('should calculate least common multiple correctly', () => {
      expect(MathUtils.lcm(12, 8)).toBe(24);
      expect(MathUtils.lcm(17, 13)).toBe(221);
      expect(MathUtils.lcm(5, 7)).toBe(35);
    });
  });

  describe('isPrime', () => {
    test('should identify prime numbers correctly', () => {
      expect(MathUtils.isPrime(2)).toBe(true);
      expect(MathUtils.isPrime(3)).toBe(true);
      expect(MathUtils.isPrime(17)).toBe(true);
      expect(MathUtils.isPrime(97)).toBe(true);
    });

    test('should identify non-prime numbers correctly', () => {
      expect(MathUtils.isPrime(1)).toBe(false);
      expect(MathUtils.isPrime(4)).toBe(false);
      expect(MathUtils.isPrime(15)).toBe(false);
      expect(MathUtils.isPrime(100)).toBe(false);
    });
  });

  describe('manhattanDistance', () => {
    test('should calculate Manhattan distance correctly', () => {
      expect(MathUtils.manhattanDistance(0, 0, 3, 4)).toBe(7);
      expect(MathUtils.manhattanDistance(1, 1, 1, 1)).toBe(0);
      expect(MathUtils.manhattanDistance(-2, -3, 1, 2)).toBe(8);
    });
  });

  describe('sieveOfEratosthenes', () => {
    test('should generate primes up to n', () => {
      const primes = MathUtils.sieveOfEratosthenes(20);
      expect(primes).toEqual([2, 3, 5, 7, 11, 13, 17, 19]);
    });

    test('should handle edge cases', () => {
      expect(MathUtils.sieveOfEratosthenes(1)).toEqual([]);
      expect(MathUtils.sieveOfEratosthenes(2)).toEqual([2]);
    });
  });
});