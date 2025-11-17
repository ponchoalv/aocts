import { BaseSolution } from "../../templates/solution.js";

export default class Day20Solution extends BaseSolution {
  part1(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);
    const elems: [number, number][] = lines.map((line, idx) => [
      parseInt(line.trim()),
      idx,
    ]);
    const shuffled: [number, number][] = elems.map((arr) => [...arr]); // Deep copy
    const size = elems.length;

    for (const [value, initialIndex] of elems) {
      // tengo que buscar el indice en el array donde se movió el elemento
      let currentIdx = -1;
      for (let i = 0; i < size; i++) {
        if (shuffled[i]![1]! === initialIndex) {
          currentIdx = i;
          break;
        }
      }

      if (currentIdx === -1) continue;
      if (value === 0) continue; // 0 no se mueve

      // Calcular el nuevo indice modulo arithmetic:
      let moveDistance = value;
      let newIdx = currentIdx + moveDistance;

      newIdx = newIdx % (size - 1);

      // Modulo en js, si es negativo, se mantiene negativo, así que hay que corregir
      if (newIdx < 0) {
        newIdx += size - 1;
      }

      // pslice se encarga de todo el trabajo de mover los elementos
      const element: [number, number] = shuffled.splice(currentIdx, 1)[0]!; // elminar el element de la posicion actual
      shuffled.splice(newIdx, 0, element); // agregar el elemento en su nueva posición
    }

    const zeroIndex = shuffled.findIndex((e: [number, number]) => e[0] === 0);

    const sum = [1, 2, 3].reduce((acc, i) => {
      const offset = 1000 * i;
      const targetIndex = (zeroIndex + offset) % size;
      const targetValue: number = shuffled[targetIndex]![0]!;
      return acc + targetValue;
    }, 0);

    return sum;
  }

  part2(input: string, isTest: boolean = false): string | number {
    const lines = this.lines(input);

    // TODO: Implement part 2
    return 0;
  }
}
