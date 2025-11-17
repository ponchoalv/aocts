# Day 21: Monkey Math

## Part 1

find the root number from this table

```
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
```

the result would be `152`

for getting the result of root: pppw + sjmn

getNumber(pppw) + getNumber(sjmn) ->

```
enum Operation {
	PLUS,
	LESS,
	MULTIPLY,
	DIVISION,
	NOP,
}

interface MonkeyOperation {
	left: number;
	right?: number;
	operation: Operation;
}

Map<string, MonkeyOperation>

getNumber(monkeyName: string): number {
	const operation = map.get(monkeyName);
	switch operation.operation {
		case PLUS:
			getNumber(operation.left) + getNumber(operation.right)
		...
		case NOP:
			return operation.left
	}
}

```

recursively look for the root number.

## Part 2

Part 2 was harder.

I optimise the recursive function to use memo for all depth's after `humn` was spotter which wouldn't be affected, and then with if / else to step faster I found the value in arround 8s.
On the second optmization I read about solvers and implement a naive version of newton's method (Newton–Raphson method) which require some derivative calculation.

```
f'(x) = (f(x + h) - f(x)) / h
```

Set the the H value in something high, like 1, because we are looking for bigs numbers (from force brute 1st iteration I know that).

Now the problem gets solve in around 5ms (with an m4 macbook / mac mini)

## Notes

- this video was super helpfull to visualize how newton's method work [video](https://www.youtube.com/watch?v=1uN8cBGVpfs)
- wikipedia article also usefull [link](https://en.wikipedia.org/wiki/Newton%27s_method)
