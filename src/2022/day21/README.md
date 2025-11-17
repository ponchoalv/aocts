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

## Part 2

[Description of part 2]

## Notes

- [Any optimization notes or algorithm explanations]
