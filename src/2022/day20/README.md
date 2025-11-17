# Day 20: Grove Positioning System

## Part 1

```
Initial arrangement:
1, 2, -3, 3, -2, 0, 4
              newIndex => si num > 0 idx+num % length => 1
              all numbers from idx 1 - N => move to the left % 7
1 moves between 2 and -3: new index (0 + 1) % 7 1%7
2, 1, -3, 3, -2, 0, 4
			  newIndex => si num > 0 idx+num % length =>
2 moves between -3 and 3: new index (0 + 2) % 7 => 2
1, -3, 2, 3, -2, 0, 4
			  newIndex => si num < 0 (idx + num + lenght - 1) % length
-3 moves between -2 and 0: new index (1 -3 +(7-1)) % 7 => 4
1, 2, 3, -2, -3, 0, 4

3 moves between 0 and 4:
1, 2, -2, -3, 0, 3, 4

-2 moves between 4 and 1:
1, 2, -3, 0, 3, 4, -2

0 does not move:
1, 2, -3, 0, 3, 4, -2

4 moves between -3 and 0:
1, 2, -3, 4, 0, 3, -2
```

0 -> 1
1 -> 2
2 -> -3
3 -> 3
4 -> -2
5 -> 0
6 -> 4

move to 1%7 -> 1

```
1000th, 2000th, and 3000th numbers after the value 0, wrapping around the list as necessary. In the above example, the 1000th number after 0 is 4, the 2000th is -3, and the 3000th is 2; adding these together produces 3.
```

result -> idxOf(0) -> 4
get(1000th) -> ((1000%len(numbers)) + idxOf(0)) % len(numbers)
valueAt(3) (4) -> ((1000%7) + 4) % 7

## Part 2

same stuff, just multiply every number by `811589153` and repeate 10 times the rotate algorithm, example:

```
Initial arrangement:
811589153, 1623178306, -2434767459, 2434767459, -1623178306, 0, 3246356612

After 1 round of mixing:
0, -2434767459, 3246356612, -1623178306, 2434767459, 1623178306, 811589153

After 2 rounds of mixing:
0, 2434767459, 1623178306, 3246356612, -2434767459, -1623178306, 811589153

After 3 rounds of mixing:
0, 811589153, 2434767459, 3246356612, 1623178306, -1623178306, -2434767459

After 4 rounds of mixing:
0, 1623178306, -2434767459, 811589153, 2434767459, 3246356612, -1623178306

After 5 rounds of mixing:
0, 811589153, -1623178306, 1623178306, -2434767459, 3246356612, 2434767459

After 6 rounds of mixing:
0, 811589153, -1623178306, 3246356612, -2434767459, 1623178306, 2434767459

After 7 rounds of mixing:
0, -2434767459, 2434767459, 1623178306, -1623178306, 811589153, 3246356612

After 8 rounds of mixing:
0, 1623178306, 3246356612, 811589153, -2434767459, 2434767459, -1623178306

After 9 rounds of mixing:
0, 811589153, 1623178306, -2434767459, 3246356612, 2434767459, -1623178306

After 10 rounds of mixing:
0, -2434767459, 1623178306, 3246356612, -1623178306, 2434767459, 811589153

```

will return `1623178306`

## Notes

- [Any optimization notes or algorithm explanations]
