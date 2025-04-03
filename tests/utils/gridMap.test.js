import GridMap from '../../src/utils/gridMap.js';

describe('GridMap Utility', () => {
    test('should create a grid with specified dimensions', () => {
        const grid = new GridMap(10, 20);
        expect(grid.grid.length).toBe(20);
        expect(grid.grid[0].length).toBe(10);
    });

    test('should set and get passable status of a cell', () => {
        const grid = new GridMap(10, 20);
        grid.setIsPassable(5, 5, false);
        expect(grid.isPassable(5, 5)).toBe(false);
        grid.setIsPassable(5, 5, true);
        expect(grid.isPassable(5, 5)).toBe(true);
    });

    test('should set and get node cost', () => {
        const grid = new GridMap(10, 20);
        grid.setNodeCost(5, 5, 3);
        expect(grid.getNodeCost(5, 5)).toBe(3);
    });

    test('should get node', () => {
        const grid = new GridMap(10, 20);
        const node = grid.getNode(5, 5);
        expect(node).toBeDefined();
        expect(node.x).toBe(5);
        expect(node.y).toBe(5);
    });
});