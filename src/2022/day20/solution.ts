import { BaseSolution } from "../../templates/solution.js";

export default class Day20Solution extends BaseSolution {
  part1(input: string, isTest: boolean = false): string | number {
    const elements = this.lines(input).map((num, idx) => [parseInt(num), idx]);
    const toShuffle = [...elements];
    const size = elements.length;

    elements.forEach((it) => {
      const count = it[0]! % (size - 1);
      for (
        let idx: number = it[1]!, endIdx = (it[1]! + count) % size, newIdx;
        idx != endIdx;
        idx = newIdx
      ) {
        debugger;
        newIdx = (idx! + 1) % size;
        const tmp = toShuffle[idx!];
        toShuffle[idx!] = toShuffle[newIdx]!;
        toShuffle[idx]![1] = idx!;
        toShuffle[newIdx] = tmp!;
        toShuffle[newIdx]![1]! = newIdx!;
      }
    });

    console.log(elements);
    console.log(toShuffle);

    // TODO: Implement part 1
    return 0;
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);

    // TODO: Implement part 2
    return 0;
  }
}
