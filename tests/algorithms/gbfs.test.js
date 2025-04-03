import GBFS from '../../src/algorithms/gbfs.js';
import GridMap from '../../src/utils/gridMap.js';

describe('BFS Algorithm', () => {
    test('should find the shortest path', () => {
        const grid = new GridMap(10, 20);

        const walls = [[6, 1], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [7, 7], [7, 4], [7, 8], [7, 9], [12, 3], [12, 4], [14, 0], [14, 1], [14, 2], [14, 3], [14, 7]];
        walls.forEach((wall) => {
            grid.setIsPassable(wall[0], wall[1], false);
        });

        const map = new GBFS(grid);
        const start = [3, 3];
        const end = [18, 6];
        const path = map.findPath(start, end);

        expect(path).toEqual([
            [3, 3], [3, 4], [3, 5],
            [3, 6], [4, 6], [5, 6],
            [5, 5], [5, 4], [5, 3],
            [5, 2], [6, 2], [7, 2],
            [7, 3], [8, 3], [8, 4],
            [8, 5], [8, 6], [9, 6],
            [10, 6], [11, 6], [12, 6],
            [13, 6], [14, 6], [15, 6],
            [16, 6], [17, 6], [18, 6],
        ]);
    });
});