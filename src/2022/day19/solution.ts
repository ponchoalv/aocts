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

enum RobotType {
  ORE_ROBOT,
  CLAY_ROBOT,
  OBSIDIAN_ROBOT,
  GEODE_ROBOT,
}

export default class Day19Solution extends BaseSolution {
  private maxGeodes = 0;
  private memo = new Map<string, number>();

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

  private getMaxGeode(root: MineralCollector): number {
    this.maxGeodes = 0;
    this.memo.clear();
    return this.dfs(root);
  }

  private dfs(state: MineralCollector): number {
    // If time is up, update max
    if (state.minutes >= 24) {
      this.maxGeodes = Math.max(this.maxGeodes, state.geode);
      return this.maxGeodes;
    }

    const minutesLeft = 24 - state.minutes;

    // --- PRUNE: optimistic upper bound ---
    const optimistic =
      state.geode +
      state.robotFactory.geodeRobots * minutesLeft +
      (minutesLeft * (minutesLeft - 1)) / 2; // triangular
    if (optimistic <= this.maxGeodes) return 0;

    // --- MEMO KEY ---
    const key = this.makeKey(state);
    const memoVal = this.memo.get(key);
    if (memoVal !== undefined && memoVal >= state.geode) return 0;
    this.memo.set(key, state.geode);

    let best = 0;

    // --- Generate all build options ---
    const buildable: RobotType[] = [];
    [
      RobotType.GEODE_ROBOT,
      RobotType.OBSIDIAN_ROBOT,
      RobotType.CLAY_ROBOT,
      RobotType.ORE_ROBOT,
    ].forEach((type) => {
      if (this.couldCreateRobot(type, state) && this.robotUseful(type, state)) {
        buildable.push(type);
      }
    });

    // Option 1: build each buildable robot
    for (const type of buildable) {
      const next = this.cloneState(state);
      this.buildRobot(type, next);
      this.collectMinerals(state, next);
      next.minutes++;
      best = Math.max(best, this.dfs(next));
    }

    // Option 2: build nothing
    {
      const next = this.cloneState(state);
      this.collectMinerals(state, next);
      next.minutes++;
      best = Math.max(best, this.dfs(next));
    }

    this.maxGeodes = Math.max(this.maxGeodes, best);
    return best;
  }

  private cloneState(s: MineralCollector): MineralCollector {
    return {
      blueprint: s.blueprint,
      robotFactory: { ...s.robotFactory },
      ore: s.ore,
      clay: s.clay,
      obsidian: s.obsidian,
      geode: s.geode,
      minutes: s.minutes,
    };
  }

  private makeKey(s: MineralCollector): string {
    return [
      s.minutes,
      s.ore,
      s.clay,
      s.obsidian,
      s.geode,
      s.robotFactory.oreRobots,
      s.robotFactory.clayRobots,
      s.robotFactory.obsidianRobots,
      s.robotFactory.geodeRobots,
    ].join(",");
  }

  private robotUseful(type: RobotType, state: MineralCollector): boolean {
    const bp = state.blueprint;

    const maxOreNeeded = Math.max(
      bp.oreRobotCost.ore!,
      bp.clayRobotCost.ore!,
      bp.obsidianRobotCost.ore!,
      bp.geodeRobotCost.ore!
    );
    if (type === RobotType.ORE_ROBOT) {
      return state.robotFactory.oreRobots < maxOreNeeded;
    }
    const maxClayNeeded = bp.obsidianRobotCost.clay ?? 0;
    if (type === RobotType.CLAY_ROBOT) {
      return state.robotFactory.clayRobots < maxClayNeeded;
    }
    const maxObsNeeded = bp.geodeRobotCost.obsidian ?? 0;
    if (type === RobotType.OBSIDIAN_ROBOT) {
      return state.robotFactory.obsidianRobots < maxObsNeeded;
    }
    return true; // geode robots always useful
  }

  private couldCreateRobot(
    robotType: RobotType,
    mineralCollector: MineralCollector
  ): boolean {
    switch (robotType) {
      case RobotType.ORE_ROBOT:
        return (
          (mineralCollector.blueprint.oreRobotCost.ore ?? 0) <=
            mineralCollector.ore &&
          (mineralCollector.blueprint.oreRobotCost.clay ?? 0) <=
            mineralCollector.clay &&
          (mineralCollector.blueprint.oreRobotCost.obsidian ?? 0) <=
            mineralCollector.obsidian
        );
      case RobotType.CLAY_ROBOT:
        return (
          (mineralCollector.blueprint.clayRobotCost.ore ?? 0) <=
            mineralCollector.ore &&
          (mineralCollector.blueprint.clayRobotCost.clay ?? 0) <=
            mineralCollector.clay &&
          (mineralCollector.blueprint.clayRobotCost.obsidian ?? 0) <=
            mineralCollector.obsidian
        );
      case RobotType.OBSIDIAN_ROBOT:
        return (
          (mineralCollector.blueprint.obsidianRobotCost.ore ?? 0) <=
            mineralCollector.ore &&
          (mineralCollector.blueprint.obsidianRobotCost.clay ?? 0) <=
            mineralCollector.clay &&
          (mineralCollector.blueprint.obsidianRobotCost.obsidian ?? 0) <=
            mineralCollector.obsidian
        );
      case RobotType.GEODE_ROBOT:
        return (
          (mineralCollector.blueprint.geodeRobotCost.ore ?? 0) <=
            mineralCollector.ore &&
          (mineralCollector.blueprint.geodeRobotCost.clay ?? 0) <=
            mineralCollector.clay &&
          (mineralCollector.blueprint.geodeRobotCost.obsidian ?? 0) <=
            mineralCollector.obsidian
        );

      default:
        return false;
    }
  }

  private buildRobot(
    robotType: RobotType,
    mineralCollector: MineralCollector
  ): MineralCollector {
    switch (robotType) {
      case RobotType.ORE_ROBOT:
        mineralCollector.ore -=
          mineralCollector.blueprint.oreRobotCost.ore ?? 0;
        mineralCollector.clay -=
          mineralCollector.blueprint.oreRobotCost.clay ?? 0;
        mineralCollector.obsidian -=
          mineralCollector.blueprint.oreRobotCost.obsidian ?? 0;
        mineralCollector.robotFactory.oreRobots += 1;
        return mineralCollector;
      case RobotType.CLAY_ROBOT:
        mineralCollector.ore -=
          mineralCollector.blueprint.clayRobotCost.ore ?? 0;
        mineralCollector.clay -=
          mineralCollector.blueprint.clayRobotCost.clay ?? 0;
        mineralCollector.obsidian -=
          mineralCollector.blueprint.clayRobotCost.obsidian ?? 0;
        mineralCollector.robotFactory.clayRobots += 1;
        return mineralCollector;
      case RobotType.OBSIDIAN_ROBOT:
        mineralCollector.ore -=
          mineralCollector.blueprint.obsidianRobotCost.ore ?? 0;
        mineralCollector.clay -=
          mineralCollector.blueprint.obsidianRobotCost.clay ?? 0;
        mineralCollector.obsidian -=
          mineralCollector.blueprint.obsidianRobotCost.obsidian ?? 0;
        mineralCollector.robotFactory.obsidianRobots += 1;
        return mineralCollector;
      case RobotType.GEODE_ROBOT:
        mineralCollector.ore -=
          mineralCollector.blueprint.geodeRobotCost.ore ?? 0;
        mineralCollector.clay -=
          mineralCollector.blueprint.geodeRobotCost.clay ?? 0;
        mineralCollector.obsidian -=
          mineralCollector.blueprint.geodeRobotCost.obsidian ?? 0;
        mineralCollector.robotFactory.geodeRobots += 1;
        return mineralCollector;

      default:
        return mineralCollector;
    }

    return mineralCollector;
  }

  private collectMinerals(
    mineralCollectorPrevious: MineralCollector,
    mineralCollector: MineralCollector
  ) {
    mineralCollector.ore += mineralCollectorPrevious.robotFactory.oreRobots;
    mineralCollector.clay += mineralCollectorPrevious.robotFactory.clayRobots;
    mineralCollector.obsidian +=
      mineralCollectorPrevious.robotFactory.obsidianRobots;
    mineralCollector.geode += mineralCollectorPrevious.robotFactory.geodeRobots;
  }

  part1(input: string, isTest: boolean = false): string | number {
    const blueprints = this.parseBlueprints(input);
    const robotFactory: RobotFactory = {
      oreRobots: 1,
      clayRobots: 0,
      obsidianRobots: 0,
      geodeRobots: 0,
    };

    return blueprints
      .map((blueprint) => {
        const mineralCollector = this.initMineralCollector(
          blueprint,
          robotFactory
        );
        debugger;
        return this.getMaxGeode(mineralCollector) * blueprint.id;
      })
      .reduce((prev, current) => prev + current, 0);
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);

    // TODO: Implement part 2
    return 0;
  }
}
