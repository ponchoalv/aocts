import { BaseSolution } from "../../templates/solution.js";

interface RobotCost {
  ore?: number;
  clay?: number;
  obsidian?: number;
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
  blueprint: BluePrint;
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
      const blueprint: any = {};

      const match = line.match(
        /^Blueprint (\d+): ([\w\s]+). ([\w\s]+). ([\w\s]+). ([\w\s]+)\.$/
      );
      if (match) {
        const [, id, oreCost, clayCost, obsidianCost, geodeCost] = match;
        blueprint.id = parseInt(id!);

        [oreCost, clayCost, obsidianCost, geodeCost].forEach((it) => {
          const costMatch = it!.match(
            /Each (\w+) robot costs (\d+) (\w+)( and (\d+) (\w+))?/
          );
          if (costMatch) {
            const value1: number = parseInt(costMatch[2]!);
            const cost: any = {};
            cost[`${costMatch[3]}`] = value1;

            if (costMatch[5]) {
              const value2 = parseInt(costMatch[5]);
              cost[`${costMatch[6]}`] = value2;
            }
            const robotCost: RobotCost = { ...cost };
            blueprint[`${costMatch[1]}RobotCost`] = robotCost;
          }
        });
        const bluetPrintFormatted: BluePrint = { ...blueprint };
        blueprints.push(bluetPrintFormatted);
      }
    }

    return blueprints;
  }

  private initMineralCollector(
    blueprint: BluePrint,
    robotFactory: RobotFactory
  ): MineralCollector {
    return {
      robotFactory,
      blueprint,
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
      minutes: 0,
    };
  }

  part1(input: string, isTest: boolean = false): string | number {
    const blueprints = this.parseBlueprints(input);
    const robotFactory: RobotFactory = {
      oreRobots: 1,
      clayRobots: 0,
      obsidianRobots: 0,
      geodeRobots: 0,
    };
    const mineralCollector = this.initMineralCollector(
      blueprints[0]!,
      robotFactory
    );

    console.log(mineralCollector);
    return 0;
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);

    // TODO: Implement part 2
    return 0;
  }
}
