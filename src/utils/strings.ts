/**
 * High-performance string manipulation utilities for Advent of Code
 */

/**
 * KMP (Knuth-Morris-Pratt) string matching algorithm
 */
export class StringUtils {
  /**
   * Build KMP failure function
   */
  private static buildKMPTable(pattern: string): number[] {
    const table = new Array(pattern.length).fill(0);
    let j = 0;

    for (let i = 1; i < pattern.length; i++) {
      while (j > 0 && pattern[i] !== pattern[j]) {
        j = table[j - 1]!;
      }
      if (pattern[i] === pattern[j]) {
        j++;
      }
      table[i] = j;
    }

    return table;
  }

  /**
   * Find all occurrences of pattern in text using KMP
   */
  static findAllOccurrences(text: string, pattern: string): number[] {
    if (pattern.length === 0) return [];

    const table = this.buildKMPTable(pattern);
    const occurrences: number[] = [];
    let j = 0;

    for (let i = 0; i < text.length; i++) {
      while (j > 0 && text[i] !== pattern[j]) {
        j = table[j - 1]!;
      }
      if (text[i] === pattern[j]) {
        j++;
      }
      if (j === pattern.length) {
        occurrences.push(i - j + 1);
        j = table[j - 1]!;
      }
    }

    return occurrences;
  }

  /**
   * Rolling hash for efficient substring comparisons
   */
  static createRollingHash(s?: string): RollingHash {
    return new RollingHash(s);
  }
}

/**
 * Rolling hash class for efficient substring comparisons
 */
export class RollingHash {
  private static readonly BASE = 31;
  private static readonly MOD = 1e9 + 7;

  private hash: number = 0;
  private power: number = 1;
  private length: number = 0;

  constructor(s?: string) {
    if (s) {
      for (const char of s) {
        this.addChar(char);
      }
    }
  }

  addChar(char: string): void {
    this.hash = (this.hash * RollingHash.BASE + char.charCodeAt(0)) % RollingHash.MOD;
    if (this.length > 0) {
      this.power = (this.power * RollingHash.BASE) % RollingHash.MOD;
    }
    this.length++;
  }

  removeChar(char: string): void {
    if (this.length === 0) return;
    
    this.hash = (this.hash - (char.charCodeAt(0) * this.power) % RollingHash.MOD + RollingHash.MOD) % RollingHash.MOD;
    if (this.length > 1) {
      this.power = Math.floor(this.power / RollingHash.BASE);
    } else {
      this.power = 1;
    }
    this.length--;
  }

  getHash(): number {
    return this.hash;
  }

  static computeHash(s: string): number {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash * this.BASE + s.charCodeAt(i)) % this.MOD;
    }
    return hash;
  }

  /**
   * Fast character frequency counting
   */
  static charFrequency(s: string): Map<string, number> {
    const freq = new Map<string, number>();
    for (const char of s) {
      freq.set(char, (freq.get(char) ?? 0) + 1);
    }
    return freq;
  }

  /**
   * Check if two strings are anagrams
   */
  static areAnagrams(s1: string, s2: string): boolean {
    if (s1.length !== s2.length) return false;
    
    const freq1 = this.charFrequency(s1);
    const freq2 = this.charFrequency(s2);
    
    if (freq1.size !== freq2.size) return false;
    
    for (const [char, count] of freq1) {
      if (freq2.get(char) !== count) return false;
    }
    
    return true;
  }

  /**
   * Find longest common subsequence length
   */
  static longestCommonSubsequence(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i]![j] = dp[i - 1]![j - 1]! + 1;
        } else {
          dp[i]![j] = Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
        }
      }
    }

    return dp[m]![n]!;
  }

  /**
   * Find edit distance (Levenshtein distance)
   */
  static editDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    // Initialize base cases
    for (let i = 0; i <= m; i++) dp[i]![0] = i;
    for (let j = 0; j <= n; j++) dp[0]![j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i]![j] = dp[i - 1]![j - 1];
        } else {
          dp[i]![j] = 1 + Math.min(
            dp[i - 1]![j]!,     // deletion
            dp[i]![j - 1]!,     // insertion
            dp[i - 1]![j - 1]!  // substitution
          );
        }
      }
    }

    return dp[m]![n]!;
  }

  /**
   * Generate all permutations of a string
   */
  static permutations(s: string): string[] {
    if (s.length <= 1) return [s];
    
    const result: string[] = [];
    const chars = [...s];
    
    const backtrack = (current: string[], remaining: string[]) => {
      if (remaining.length === 0) {
        result.push(current.join(''));
        return;
      }
      
      for (let i = 0; i < remaining.length; i++) {
        const char = remaining[i]!;
        const newCurrent = [...current, char];
        const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
        backtrack(newCurrent, newRemaining);
      }
    };
    
    backtrack([], chars);
    return result;
  }

  /**
   * Generate all combinations of a string
   */
  static combinations(s: string, length: number): string[] {
    if (length > s.length) return [];
    if (length === 0) return [''];
    
    const result: string[] = [];
    const chars = [...s];
    
    const backtrack = (start: number, current: string[]) => {
      if (current.length === length) {
        result.push(current.join(''));
        return;
      }
      
      for (let i = start; i < chars.length; i++) {
        current.push(chars[i]!);
        backtrack(i + 1, current);
        current.pop();
      }
    };
    
    backtrack(0, []);
    return result;
  }

  /**
   * Reverse a string
   */
  static reverse(s: string): string {
    return [...s].reverse().join('');
  }

  /**
   * Check if string is palindrome
   */
  static isPalindrome(s: string): boolean {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    
    return true;
  }

  /**
   * Find longest palindromic substring
   */
  static longestPalindrome(s: string): string {
    if (s.length < 2) return s;
    
    let start = 0;
    let maxLength = 1;
    
    const expandAroundCenter = (left: number, right: number): number => {
      while (left >= 0 && right < s.length && s[left] === s[right]) {
        const currentLength = right - left + 1;
        if (currentLength > maxLength) {
          start = left;
          maxLength = currentLength;
        }
        left--;
        right++;
      }
      return right - left - 1;
    };
    
    for (let i = 0; i < s.length; i++) {
      // Odd length palindromes
      expandAroundCenter(i, i);
      // Even length palindromes
      expandAroundCenter(i, i + 1);
    }
    
    return s.substring(start, start + maxLength);
  }

  /**
   * Convert string to title case
   */
  static toTitleCase(s: string): string {
    return s.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

  /**
   * Count words in string
   */
  static wordCount(s: string): number {
    return s.trim().split(/\s+/).length;
  }

  /**
   * Extract all words from string
   */
  static extractWords(s: string): string[] {
    return s.match(/\b\w+\b/g) ?? [];
  }
}