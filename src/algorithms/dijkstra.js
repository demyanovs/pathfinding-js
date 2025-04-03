import PriorityQueue from "../utils/priorityQueue.js";
import { Node } from "../index.js";

class Dijkstra {
    constructor(grid) {
        this.grid = grid;
        this.pq = new PriorityQueue();
    }

    findPath(start, target) {
        const rows = this.grid.grid.length;
        const cols = this.grid.grid[0].length;
        let pathCost = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
        let prev = Array.from({ length: rows }, () => Array(cols).fill(null));
        let visited = Array.from({ length: rows }, () => Array(cols).fill(false));

        pathCost[start[0]][start[1]] = 0;

        const startNode = new Node(start[0], start[1]);
        this.pq.enqueue(startNode, 0);

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        while (!this.pq.isEmpty()) {
            let node = this.pq.dequeue();
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
                // Neighbour node
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && !visited[nx][ny]) {
                    // Skip if the node is not passable or already explored.
                    if (!this.grid.getNode(nx, ny).isPassable) {
                        continue;
                    }

                    // Calculate path cost from current node to the neighbouring node.
                    let newPathCost = pathCost[x][y] + this.grid.getNode(nx, ny).cost;

                    // Update neighbouring non-visited node
                    // with a new cost if the path is less than the current path.
                    if (newPathCost < pathCost[nx][ny]) {
                        pathCost[nx][ny] = newPathCost;
                        // Where we came from
                        prev[nx][ny] = [x, y];
                        this.pq.enqueue(new Node(nx, ny), newPathCost);

                    }
                }
            }
        }

        return this.buildShortestPath(prev, start, target);
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

export default Dijkstra;