# Day 22: Monkey Map

## Part 1

### Path finding on a wraped and uneven map:

```
        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5
```

Starting position is top left (1,1) facing right
Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^)

```typescript
enum Facing {
  RIGHT, // 0
  DOWN, // 1
  LEFT, // 2
  UP, // 3
}
```

The result should be calculated as 1000 times the row number plus 4 times the column number plus 0 if we are facing right, 1 if we are facing down, 2 if we are facing left, and 3 if we are facing up.

```
1000 * r + 4 * c + Facing
```

With the example input this is:

```
        >>v#
        .#v.
        #.v.
        ..v.
...#...v..v#
>>>v...>#.>>
..#v...#....
...>>>>v..#.
        ...#....
        .....#..
        .#......
        ......#.

1000 * 6 + 4 * 8 + 0: 6032
```

I need to mover in a direction with the following logic, if next is blank, recursively move forward until a "." is found, if a "#" is found go back to the starting point (wrap control).

so moveInDirection will take the current position, the direction we are moving to (dx, yx) and Enum >< v^

## Part 2

[Description of part 2]

## Notes

- [Any optimization notes or algorithm explanations]
