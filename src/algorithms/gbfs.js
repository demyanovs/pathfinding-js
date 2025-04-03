import PriorityQueue from "../utils/priorityQueue.js";
import { Node } from "../index.js";

class GBFS {
    constructor(grid) {
        this.grid = grid;
        this.pq = new PriorityQueue();
    }

    findPath(start, target) {
        let rows = this.grid.grid.length;
        let cols = this.grid.grid[0].length;
        let prev = Array.from({ length: rows }, () => Array(cols).fill(null));
        let visited = Array.from({ length: rows }, () => Array(cols).fill(false));

        const startNode = this.grid.getNode(start[0], start[1]);
        this.pq.enqueue(startNode, this.heuristic(start, target));

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        while (!this.pq.isEmpty()) {
            const node = this.pq.dequeue();
            const x = node.x;
            const y = node.y;

            if (visited[x][y]) {
                continue;
            }

            visited[x][y] = true;

            if (x === target[0] && y === target[1]) {
                break;
            }

            for (let [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && !visited[nx][ny]) {
                    if (!this.grid.getNode(nx, ny).isPassable) {
                        continue;
                    }

                    prev[nx][ny] = [x, y];
                    this.pq.enqueue(new Node(nx, ny), this.heuristic([nx, ny], target));
                }
            }
        }

        return this.buildShortestPath(prev, start, target);
    }

    heuristic(node, target) {
        // Manhattan distance
        return Math.abs(node[0] - target[0]) + Math.abs(node[1] - target[1]);
    }

    buildShortestPath(prev, start, end) {
        let path = [];
        let current = end;

        while (current) {
            path.unshift(current);
            current = prev[current[0]][current[1]];
        }

        return path[0][0] === start[0] && path[0][1] === start[1] ? path : [];
    }
}

export default GBFS;