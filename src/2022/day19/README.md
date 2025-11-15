# Day 19: [Not Enough Minerals]

## data for domain of the problem

From reading the problem we can imagine a model like this

```typescript
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
```

## we have this input:

Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 12 clay. Each geode robot costs 3 ore and 8 obsidian.

We can imagine an starting point like this:

```typescript
const bluePrint {
	id: 1,
	oreRobotCost: {ore: 4},
	clayRobotCost: {ore: 4},
	obsidianRobotCost: {ore: 4, clay: 12},
	geodeRobotCots: {ore: 3, obsidian: 8}
}

const robotFactory  = {
	oreRobots: 1;
	clayRobots: 0;
	obsidianRobots: 0;
	geodeRobots: 0;
}

const mineralColector = {
	robotFactory: {
		oreRobots: 1,
		clayRobots: 0,
		obsidianRobots: 0,
		geodeRobots: 0,
	},

    ore: 0,
    clay: 0,
    obsidian: 0,
    geode: 0,

    time: 0
}

OreMiningRate = robotFactory.oreRobots
clayMiningRate = robotFactory.clayRobots
obsidianMiningRate = robotFactory.obsidianRobots
geodeMiningRate = robotFactory.geodeRobots
```

### How to get the max ammount of geode in 24 minutes?

DFS with prunning maybe? we prune branches:

- that do no prioritize creating robots for getting geode.
- We do not try to build robots if we are close to be out of time.
- get the max geode

## Part 1

[Description of part 1]

## Part 2

[Description of part 2]

## Notes

- [Any optimization notes or algorithm explanations]
