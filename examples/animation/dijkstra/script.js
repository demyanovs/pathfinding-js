class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cost = 1;
        this.isForest = false;
        this.isPassable = true;
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(node, cost) {
        node.cost = cost;
        if (this.isEmpty()) {
            this.items.push(node);
        } else {
            const index = this.binarySearchInsertIndex(cost);
            this.items.splice(index, 0, node);
        }
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }

    binarySearchInsertIndex(cost) {
        let low = 0;
        let high = this.items.length;

        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (this.items[mid].cost < cost) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        return low;
    }
}

class GridMap {
    grid = [];
    cellSize = 36;
    mapPadding = 36;
    canvas = document.getElementById("canvas");
    context = this.canvas.getContext("2d");
    path = [];
    startNode = {};
    goalNode = {};
    animationSpeed = 14;
    forestImage = {};
    colors = {
        board: '#EAE7E1',
        startNode: '#214ECA',
        goalNode: '#E52E2E',
        adjacent: '#00A30E',
        explored: '#878787',
        path: '#6CA1DA',
        wall: '#993A15',
        forest: '#00A30E',
    };

    pq = null;

    constructor(grid) {
        this.grid = grid;
        this.pq = new PriorityQueue();

        const self = this;

        const handleClick = function (e) {
            const coord = self.getCursorPosition(e);
            const node = self.coordsToNode(coord.x, coord.y);
            const isPassable = self.grid[node[0]][node[1]].isPassable;
            self.grid[node[0]][node[1]].isPassable = !isPassable;

            if (isPassable) {
                self.fillNode(node, self.colors.wall);
            } else {
                self.fillNode(node, self.colors.board);
            }
        };

        this.canvas.addEventListener('mousedown', handleClick);

        this.reset();
    }

    async findPath(start, target) {
        let rows = this.grid.length;
        let cols = this.grid[0].length;
        let pathCost = Array.from({length: rows}, () => Array(cols).fill(Infinity));
        let prev = Array.from({length: rows}, () => Array(cols).fill(null));
        let visited = Array.from({length: rows}, () => Array(cols).fill(false));

        pathCost[start[0]][start[1]] = 0;

        this.pq.enqueue(start, 0);

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        while (!this.pq.isEmpty()) {
            await GridMap.wait();

            let node = this.pq.dequeue();
            const x = node[0];
            const y = node[1];

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
                    if (!this.grid[nx][ny].isPassable) {
                        continue;
                    }

                    document.querySelector('.path-find-container .reachable .reachable-list').innerHTML = JSON.stringify(this.pq.items);
                    this.fillNode(start, this.colors.startNode);
                    this.fillNode(target, this.colors.goalNode);

                    // Calculate path cost from current node to the neighbouring node.
                    let newPathCost = pathCost[x][y] + this.grid[nx][ny].cost;
                    // Update neighbouring non-visited node
                    // with a new cost if the path is less than the current path.
                    if (newPathCost < pathCost[nx][ny]) {
                        pathCost[nx][ny] = newPathCost;
                        // Where we came from
                        prev[nx][ny] = [x, y];
                        this.pq.enqueue([nx, ny], newPathCost);
                        this.fillNode([nx, ny], this.colors.adjacent);
                        this.drawForest([nx, ny]);

                    }
                }
            }

            this.fillNode([x, y], this.colors.explored);
            this.drawForest([x, y]);
        }

        this.enableControls();

        return this.buildShortestPath(prev, start, target);
    }

    resetQueue() {
        this.pq = new PriorityQueue();
    }

    buildShortestPath(prev, start, end) {
        let path = [];
        let current = end;
        let cost = 0;

        console.log(prev);


        while (current) {
            path.unshift(current);
            current = prev[current[0]][current[1]];
            if (current) {
                cost += this.grid[current[0]][current[1]].cost;
            }
        }

        document.getElementById('cost-value').innerHTML = cost.toString();

        return path[0][0] === start[0] && path[0][1] === start[1] ? path : [];
    }

    drawPath(path, start, end) {
        path.forEach((node) => {
            this.fillNode(node, this.colors.path);
            this.drawForest(node);
        });

        this.fillNode(start, this.colors.startNode);
        this.fillNode(end, this.colors.goalNode);
    }

    drawBoard() {
        // horizontal
        this.context.font = "18px Arial";
        this.context.fillStyle = 'black';
        const gCols = this.grid.length;
        const gRows = this.grid[0].length;

        for (let i = 0; i <= gCols; i++) {
            this.context.moveTo(i * this.cellSize + this.cellSize, this.mapPadding);
            this.context.lineTo(i * this.cellSize + this.cellSize, this.cellSize * (gRows + 1));
            if (i < gCols) {
                this.context.fillText(i.toString(), this.cellSize * i + 10 + this.cellSize, this.mapPadding - 5);
            }
        }

        for (let i = 0; i <= gRows; i++) {
            this.context.moveTo(this.mapPadding, i * this.cellSize + this.cellSize);
            this.context.lineTo(this.cellSize * (gCols + 1), i * this.cellSize + this.cellSize);
            if (i < gRows) {
                this.context.fillText(i.toString(), this.mapPadding - 25, this.cellSize * i - this.cellSize / 2 + this.cellSize + this.cellSize);
            }
        }

        this.context.strokeStyle = "black";
        this.context.stroke();
    }

    drawWalls() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (!this.grid[i][j].isPassable) {
                    this.fillNode([i, j], this.colors.wall);
                }
            }
        }
    }

    drawForests() {
        const image = new Image();
        image.src = 'https://demyanov.dev/images/articles/algorithms/forest.png';
        image.onload = () => {
            const nodes = this.getNodes();
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.isForest) {
                    this.context.drawImage(
                        image,
                        this.cellSize * (node.x) + this.mapPadding + 4,
                        this.cellSize * (node.y) + this.mapPadding + 4,
                        30,
                        30,
                    );

                }
            }
        };
    }

    drawForest(n) {
        const node = this.grid[n[0]][n[1]];
        if (node.isForest) {
            const image = new Image();
            image.src = 'https://demyanov.dev/images/articles/algorithms/forest.png';
            image.onload = () => {
                this.context.drawImage(
                    image,
                    this.cellSize * (node.x) + this.mapPadding + 4,
                    this.cellSize * (node.y) + this.mapPadding + 4,
                    30,
                    30,
                );
            };
        }
    }

    getNodes() {
        const nodes = [];
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                nodes.push(this.grid[i][j]);
            }
        }

        return nodes;
    }

    fillNode(node, color) {
        this.context.fillStyle = color;
        this.context.fillRect(
            this.cellSize * (node[0]) + this.mapPadding,
            this.cellSize * (node[1]) + this.mapPadding,
            this.cellSize,
            this.cellSize);
        this.context.stroke();
    }

    clearCanvas() {
        const gCols = this.grid.length;
        const gRows = this.grid[0].length;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.colors.board;
        this.context.fillRect(this.mapPadding, this.mapPadding, gCols * this.cellSize, gRows * this.cellSize);
    }

    reset() {
        this.path = [];
        this.resetQueue();
        this.clearCanvas();
        this.drawBoard();
        this.drawWalls();
        this.drawForests();

        document.querySelector('.path-find-container .path .path-list').innerHTML = '...';
        document.getElementById('cost-value').innerHTML = '...';
    }

    disableControls() {
        document.querySelector('#start-button').disabled = true;
    }

    enableControls() {
        document.querySelector('#start-button').disabled = false;
    }

    coordsToNode(x, y) {
        return [
            Math.ceil((x - this.mapPadding) / this.cellSize) - 1,
            Math.ceil((y - this.mapPadding) / this.cellSize) - 1,
        ];
    }

    getCursorPosition(event) {
        const rect = this.canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        return {x, y};
    }

    static wait() {
        return new Promise(function (resolve) {
            setTimeout(resolve, map.animationSpeed);
        });
    }
}

function getStartNode() {
    return [
        parseInt(document.getElementById('x_start').value),
        parseInt(document.getElementById('y_start').value),
    ];
}

function getGoalNode() {
    return [
        parseInt(document.getElementById('x_goal').value),
        parseInt(document.getElementById('y_goal').value),
    ];
}

const grid = [];
const rows = 10;
const cols = 20;

// x axis
for (let i = 0; i < cols; i++) {
    const row = [];
    // y axis
    for (let j = 0; j < rows; j++) {
        const node = new Node(i, j);
        node.pathCost = 0;
        row.push(node);
    }

    grid.push(row);
}

const forests = [[8, 0], [8, 1], [9, 7], [8, 6], [6, 2], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [8, 2], [10, 3], [11, 4], [14, 4], [14, 5], [14, 6], [16, 5]];
forests.forEach((forest) => {
    grid[forest[0]][forest[1]].isForest = true;
    grid[forest[0]][forest[1]].cost = 3;
});

const walls = [[6, 1], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [7, 7], [7, 4], [7, 8], [7, 9], [12, 3], [12, 4], [14, 0], [14, 1], [14, 2], [14, 3], [14, 7]];
walls.forEach((wall) => {
    grid[wall[0]][wall[1]].isPassable = false;
});

let map = null;

async function start() {
    map.reset();
    const start = getStartNode();
    const end = getGoalNode();
    map.disableControls()

    const path = await map.findPath(start, end);
    document.querySelector('.path-find-container .path .path-list').innerHTML = JSON.stringify(path);
    map.drawPath(path, start, end)
}

window.addEventListener("load", async () => {
    map = new GridMap(grid);
    const startNode = getStartNode();
    const endNode = getGoalNode();
    map.disableControls();

    const path = await map.findPath(startNode, endNode);
    document.querySelector('.path-find-container .path .path-list').innerHTML = JSON.stringify(path);
    map.drawPath(path, startNode, endNode)

    document.getElementById('start-button').addEventListener('click', start);
});
