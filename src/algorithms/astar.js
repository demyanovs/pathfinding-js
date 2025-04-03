import PriorityQueue from "../utils/priorityQueue.js";
import {Node} from "../index.js";

class AStar {
    constructor(grid) {
        this.grid = grid;
        this.pq = new PriorityQueue();
    }

    findPath(start, target) {
        const startNode = new Node(start[0], start[1]);
        const targetNode = new Node(target[0], target[1]);

        const rows = this.grid.grid.length;
        const cols = this.grid.grid[0].length;

        this.pq = new PriorityQueue();
        startNode.g = 0;
        startNode.h = this.heuristic(start, targetNode);
        startNode.f = startNode.h;
        this.pq.enqueue(startNode, startNode.f);

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        while (!this.pq.isEmpty()) {
            let current = this.pq.dequeue();
            if (current.x === targetNode.x && current.y === targetNode.y) {
                targetNode.parent = current.parent;
                break;
            }

            for (let [dx, dy] of directions) {
                const nx = current.x + dx;
                const ny = current.y + dy;

                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
                    let neighbor = this.grid.getNode(nx, ny);
                    if (!neighbor.isPassable) {
                        continue;
                    }

                    let tentativeG = current.g + 1;
                    if (tentativeG < neighbor.g) {
                        neighbor.g = tentativeG;
                        neighbor.h = this.heuristic(neighbor, targetNode);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.parent = current;
                        this.pq.enqueue(neighbor, neighbor.f);
                    }
                }
            }
        }

        return this.buildShortestPath(targetNode);
    }

    heuristic(a, b) {
        // Manhattan distance
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    buildShortestPath(target) {
        let path = [];
        let current = target;
        while (current) {
            path.unshift([current.x, current.y]);
            current = current.parent;
        }

        return path;
    }
}

export default AStar;