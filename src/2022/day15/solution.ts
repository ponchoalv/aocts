import { BaseSolution } from "../../templates/solution.js";

interface SensorAndBeaconRow {
  sensorX: number;
  sensorY: number;
  beaconX: number;
  beaconY: number;
  distance: number;
}

export default class Day15Solution extends BaseSolution {
  private parseInput(input: string): Array<SensorAndBeaconRow> {
    const lines = this.lines(input);
    const coordinates: Array<SensorAndBeaconRow> = [];
    let minX = Infinity,
      maxX = -Infinity;
    let minY = Infinity,
      maxY = -Infinity;

    for (const line of lines) {
      const match = line.match(
        /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/,
      );
      2;
      if (match) {
        const [, sensorX, sensorY, beaconX, beaconY] = match;
        const numSensorX = parseInt(sensorX!, 10);
        const numSensorY = parseInt(sensorY!, 10);
        const numBeaconX = parseInt(beaconX!, 10);
        const numBeaconY = parseInt(beaconY!, 10);
        const coord = {
          sensorX: numSensorX,
          sensorY: numSensorY,
          beaconX: numBeaconX,
          beaconY: numBeaconY,
          distance:
            Math.abs(numSensorY - numBeaconY) +
            Math.abs(numSensorX - numBeaconX),
        };

        coordinates.push(coord);

        minX = Math.min(minX, coord.sensorX, coord.beaconX);
        maxX = Math.max(maxX, coord.sensorX, coord.beaconX);
        minY = Math.min(minY, coord.sensorY, coord.beaconY);
        maxY = Math.max(maxY, coord.sensorY, coord.beaconY);
      }
    }

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    console.log(`width: ${width}, height: ${height}`);
    // const data: string[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => '.'));

    // for (const { sensorX, sensorY, beaconX, beaconY } of coordinates) {
    //   data[sensorY - minY]![sensorX - minX] = 'S';
    //   data[beaconY - minY]![beaconX - minX] = 'B';
    // }
    return coordinates;
  }

  part1(input: string): string | number {
    const grid = this.parseInput(input);
    console.log(grid);

    return 0;
  }

  part2(input: string): string | number {
    const lines = this.lines(input);

    // TODO: Implement part 2
    return 0;
  }
}
