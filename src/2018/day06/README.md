# Day 6: Chronal Coordinates

## Part 1

Find the largest area that isn't infinite. For each coordinate, calculate the area of locations that are closest to it using Manhattan distance. Areas that extend to the edge of the coordinate space are considered infinite.

The example should return 17 for the test input.

## Part 2

Find the size of the region containing all locations which have a total distance to all given coordinates of less than 10000.

The example should return 16 for the test input (with a threshold of 32 instead of 10000).

## Notes

- Uses Manhattan distance for all calculations
- Leverages `MathUtils.manhattanDistance()` from our utility library
- Uses `Counter` for efficient area tracking
- Algorithm complexity: O(n * area) where n is number of coordinates
- Memory optimized by not storing the entire grid in memory

## Algorithm

**Part 1:**
1. Parse input coordinates
2. Find bounding box with padding to detect infinite areas
3. For each point in the area, find the closest coordinate
4. Track areas and mark coordinates that touch the boundary as infinite
5. Return the largest finite area

**Part 2:**
1. For each point in the bounding box, calculate total distance to all coordinates
2. Count points where total distance < 10000
3. Return the count
