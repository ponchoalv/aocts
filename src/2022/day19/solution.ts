import { BaseSolution } from "../../templates/solution.js";

interface RobotCost {
  ore: number;
  clay: number;
  obsidian: number;
}

interface BluePrint {
  id: number;
  oreRobotCost: RobotCost;
  clayRobotCost: RobotCost;
  obsidianRobotCost: RobotCost;
  geodeRobotCost: RobotCost;
}

interface RobotFactory {
  oreRobots: number;
  clayRobots: number;
  obsidianRobots: number;
  geodeRobots: number;
}

interface MineralCollector {
  robotFactory: RobotFactory;
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
  minutes: number;
}

export default class Day19Solution extends BaseSolution {
  private parseBlueprints(input: string): BluePrint[] {
    const blueprints: BluePrint[] = new Array<BluePrint>();
    const lines = this.lines(input);

    for (const line of lines) {
      const blueprint: BluePrint = {};

      const match = line.match(
        /^Blueprint (\d+): ([\w\s]+). ([\w\s]+). ([\w\s]+). ([\w\s]+)\.$/
      );
      if (match) {
        const [, id, oreCost, clayCost, obsidianCost, geodeCost] = match;
        blueprint.id = id;

        [oreCost, clayCost, obsidianCost, geodeCost].forEach((it) => {
          const costMatch = it.match(
            /Each (\w+) robot costs (\d+) (\w+)( and (\d+) (\w+))?/
          );
          if (costMatch) {
            const value1: number = parseInt(costMatch[2]);
            let cost: RobotCost = {};
            cost[`${costMatch[3]}`] = value1;

            if (costMatch[5]) {
              const value2 = parseInt(costMatch[5]);
              cost[`${costMatch[6]}`] = value2;
            }

            blueprint[`${costMatch[1]}RobotCost`] = cost;
          }
        });

        // console.log(id, oreCost, clayCost, obsidianCost, geodeCost);
        // console.log(oreMatch);
        // console.log(blueprint);
        blueprints.push(blueprint);
      }
    }

    return blueprints;
  }
  part1(input: string, isTest: boolean = false): string | number {
    const blueprints = this.parseBlueprints(input);
    console.log(blueprints);
    return 0;
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);

    // TODO: Implement part 2
    return 0;
  }
}
