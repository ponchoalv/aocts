# Day 7: The Sum of Its Parts

## Problem Description

You find yourself standing on a snow-covered coastline; apparently, you landed a little off course. The region is too hilly to see the North Pole from here, but you do spot some Elves that seem to be trying to unpack something that washed ashore. It's quite cold out, so you decide to risk creating a paradox by asking them for directions.

"Oh, are you the search party?" one of the Elves asks. "We've been expecting you; the North Pole told us you were coming. We're trying to unpack this equipment, but we can't quite figure out which step to perform first. Maybe you can help."

### Part 1

The instructions specify a series of steps and requirements about which steps must be finished before others can begin. Each step is designated by a single letter. For example, if step A must be finished before step B can begin, then A must be completed first.

Your first goal is to determine the order in which the steps should be completed. If more than one step is ready, choose the step which is first alphabetically.

### Part 2

As you're about to begin construction, four of the Elves offer to help. "The sun will set soon; it'll go faster if we work together." Now, you need to account for multiple workers and the time each step takes to complete.

Each step takes 60 seconds plus an amount corresponding to its letter: A=1, B=2, C=3, and so on. So, step A takes 61 seconds, while step Z takes 86 seconds. With 5 workers, what is the total time required to complete all steps?

## Solution Approach

- **Part 1**: Topological sorting with alphabetical ordering for ties
- **Part 2**: Simulation with multiple workers and timing constraints

The solution uses a dependency graph where each node tracks:
- Parent dependencies (prerequisites)
- Child dependencies (what this step enables)
- Completion status
- Work time for part 2