import {GBFS, GridMap} from "../../src/index.js";

const grid = new GridMap(10, 20);

const walls = [[6, 1], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [7, 7], [7, 4], [7, 8], [7, 9], [12, 3], [12, 4], [14, 0], [14, 1], [14, 2], [14, 3], [14, 7]];
walls.forEach((wall) => {
    grid.setIsPassable(wall[0], wall[1], false);
});

const map = new GBFS(grid);
const start = [3, 3];
const end = [18, 6];
const path = map.findPath(start, end);

console.log(path);