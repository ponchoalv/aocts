import { BaseSolution } from "../../templates/solution.js";

enum CubeType {
  Droplet,
  Steam,
}

export default class Day18Solution extends BaseSolution {
  private parseDroplets(input: string): {
    droplets: [[number, number, number]];
    trackDroplets: Map<string, number>;
  } {
    const lines = this.lines(input);
    let trackDroplets: Map<string, number> = new Map<string, number>();
    let droplets: [number, number, number] = [];

    for (const line of lines) {
      const [x, y, z] = line
        .split(",")
        .map((x) => x.trim())
        .map((x) => parseInt(x) + 1);

      droplets.push([x, y, z]);
      trackDroplets.set(`${x}-${y}-${z}`, CubeType.Droplet);
    }

    return { droplets, trackDroplets };
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

  private getAdjacentsWithinLimits(
    cube: [number, number, number],
    biggerX: number,
    biggerY: number,
    biggerZ: number
  ): [[number, number, number]] {
    return this.adjacent(cube)
      .filter(([x, y, z]) => x >= 0 && y >= 0 && z >= 0)
      .filter(([x, y, z]) => x <= biggerX && y <= biggerY && z <= biggerZ);
  }

  part1(input: string, isTest: boolean = false): string | number {
    const { droplets, trackDroplets } = this.parseDroplets(input);

    return droplets
      .map((it) => {
        return this.adjacent(it).filter(
          ([x, y, z]) => !trackDroplets.has(`${x}-${y}-${z}`) // if two blocks share a face do not count it
        ).length;
      })
      .reduce((prev, curr) => prev + curr, 0);
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);
    const { droplets, trackDroplets } = this.parseDroplets(input);

    // get the bigger value in each column (this will be a referece for external facing walls)
    const [biggerX, biggerY, biggerZ] = droplets
      .reduce(
        (prev, current) => {
          return [0, 1, 2].map((idx) =>
            current[idx] > prev[idx] ? current[idx] : prev[idx]
          );
        },
        [0, 0, 0]
      )
      .map((el) => el + 1); // increment + 1 for boundaries check

    let steamCells = [[0, 0, 0]];
    const visitedSteamCells: Set<string> = new Set<string>();
    while (steamCells.length > 0) {
      steamCells = steamCells
        .map(([x, y, z]) => {
          trackDroplets.set(`${x}-${y}-${z}`, CubeType.Steam);
          return [x, y, z];
        })
        .flatMap((el) =>
          this.getAdjacentsWithinLimits(el, biggerX, biggerY, biggerZ).filter(
            ([x, y, z]) => {
              if (
                !visitedSteamCells.has(`${x}-${y}-${z}`) &&
                !trackDroplets.has(`${x}-${y}-${z}`)
              ) {
                visitedSteamCells.add(`${x}-${y}-${z}`);
                return true;
              }
              return false;
            }
          )
        )
        .sort();
    }

    return droplets
      .map(
        (it) =>
          this.getAdjacentsWithinLimits(it, biggerX, biggerY, biggerZ).filter(
            ([x, y, z]) =>
              trackDroplets.get(`${x}-${y}-${z}`) === CubeType.Steam
          ).length
      )
      .reduce((prev, next) => prev + next, 0);
  }
}
