class BFS {
    constructor(grid) {
        this.grid = grid;
    }

    findPath(start, target) {
        let rows = this.grid.grid.length;
        let cols = this.grid.grid[0].length;
        let prev = Array.from({ length: rows }, () => Array(cols).fill(null));
        let visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        let queue = [];

        queue.push(start);
        visited[start[0]][start[1]] = true;

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        while (queue.length > 0) {
            const node = queue.shift();
            const x = node[0];
            const y = node[1];

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
                    queue.push([nx, ny]);
                    visited[nx][ny] = true;
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

export default BFS;