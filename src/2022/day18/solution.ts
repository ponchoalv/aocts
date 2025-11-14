import { BaseSolution } from "../../templates/solution.js";

export default class Day18Solution extends BaseSolution {
  private parseDroplets(input: string): {
    droplets: [[number, number, number]];
    track_droplets: Map<string, number>;
  } {
    const lines = this.lines(input);
    let track_droplets: Map<string, number> = new Map<string, number>();
    let droplets: [number, number, number] = [];

    for (const line of lines) {
      const [x, y, z] = line
        .split(",")
        .map((x) => x.trim())
        .map((x) => parseInt(x) + 1);

      droplets.push([x, y, z]);
      track_droplets.set(`${x}-${y}-${z}`, 1);
    }

    return { droplets, track_droplets };
  }

  private adjacent(xs: [number, number, number]): [[number, number, number]] {
    const [x, y, z] = xs;

    return [
      [-1, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ].map(([dx, dy, dz]) => [x + dx, y + dy, z + dz]);
  }

  part1(input: string, isTest: boolean = false): string | number {
    const { droplets, track_droplets } = this.parseDroplets(input);

    return droplets
      .map((it) => {
        return this.adjacent(it).filter(
          ([x, y, z]) => !track_droplets.has(`${x}-${y}-${z}`)
        ).length;
      })
      .reduce((prev, curr) => prev + curr, 0);
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);

    // TODO: Implement part 2
    return 0;
  }
}
