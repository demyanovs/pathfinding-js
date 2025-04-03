import Dijkstra from '../../src/algorithms/dijkstra.js';
import GridMap from '../../src/utils/gridMap.js';

describe('BFS Algorithm', () => {
    test('should find the shortest path', () => {
        const grid = new GridMap(10, 20);

        const walls = [[6, 1], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [7, 7], [7, 4], [7, 8], [7, 9], [12, 3], [12, 4], [14, 0], [14, 1], [14, 2], [14, 3], [14, 7]];
        walls.forEach((wall) => {
            grid.setIsPassable(wall[0], wall[1], false);
        });

        const forests = [[8, 0], [8, 1], [9, 7], [8, 6], [6, 2], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [8, 2], [10, 3], [11, 4], [14, 4], [14, 5], [14, 6], [16, 5]];
        forests.forEach((forest) => {
            const node = grid.getNode(forest[0], forest[1]);
            node.isForest = true;
            grid.setNode(forest[0], forest[1], node);
            grid.setNodeCost(forest[0], forest[1], 3);
        });

        const map = new Dijkstra(grid);
        const start = [3, 3];
        const end = [18, 6];
        const path = map.findPath(start, end);

        expect(path).toEqual([
            [3, 3], [4, 3], [5, 3],
            [5, 2], [6, 2], [7, 2],
            [7, 3], [8, 3], [8, 4],
            [9, 4], [10, 4], [10, 5],
            [11, 5], [12, 5], [13, 5],
            [14, 5], [15, 5], [15, 6],
            [16, 6], [17, 6], [18, 6],
        ]);
    });
});