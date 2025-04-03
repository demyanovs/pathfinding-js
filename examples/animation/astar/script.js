class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isPassable = true;
        this.g = Infinity; // Cost from start node
        this.h = 0; // Heuristic cost
        this.f = Infinity; // Total cost
        this.parent = null;
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(node, priority) {
        const index = this.binarySearchInsertIndex(priority);
        this.items.splice(index, 0, {node, priority});
    }

    dequeue() {
        return this.items.shift().node;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    binarySearchInsertIndex(priority) {
        let low = 0;
        let high = this.items.length;

        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (this.items[mid].priority < priority) {
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
    colors = {
        board: '#EAE7E1',
        startNode: '#214ECA',
        goalNode: '#E52E2E',
        adjacent: '#00A30E',
        explored: '#878787',
        path: '#6CA1DA',
        wall: '#993A15',
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

        this.pq = new PriorityQueue();
        start.g = 0;
        start.h = this.heuristic(start, target);
        start.f = start.h;
        this.pq.enqueue(start, start.f);

        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        while (!this.pq.isEmpty()) {
            await GridMap.wait();

            let current = this.pq.dequeue();
            if (current.x === target.x && current.y === target.y) {
                break;
            }

            for (let [dx, dy] of directions) {
                const nx = current.x + dx;
                const ny = current.y + dy;

                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
                    let neighbor = this.grid[nx][ny];
                    if (!neighbor.isPassable) {
                        continue;
                    }

                    document.querySelector('.path-find-container .reachable .reachable-list').innerHTML = JSON.stringify(this.pq.items);
                    this.fillNode([start.x, start.y], this.colors.startNode);
                    this.fillNode([target.x, target.y], this.colors.goalNode);

                    let tentativeG = current.g + 1;

                    if (tentativeG < neighbor.g) {
                        neighbor.g = tentativeG;
                        neighbor.h = this.heuristic(neighbor, target);
                        neighbor.f = neighbor.g + neighbor.h;
                        neighbor.parent = current;
                        this.pq.enqueue(neighbor, neighbor.f);

                        this.fillNode([nx, ny], this.colors.adjacent);
                    }
                }
            }

            this.fillNode([current.x, current.y], this.colors.explored);
        }

        this.enableControls();

        return this.buildShortestPath(target);
    }

    heuristic(a, b) {
        // Manhattan distance
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    resetQueue() {
        this.pq = new PriorityQueue();
    }

    buildShortestPath(goal) {
        let path = [];
        let current = goal;
        while (current) {
            path.unshift([current.x, current.y]);
            current = current.parent;
        }

        return path;
    }

    drawPath(path, start, end) {
        path.forEach((node) => {
            this.fillNode(node, this.colors.path);
        });

        this.fillNode([start.x, start.y], this.colors.startNode);
        this.fillNode([end.x, end.y], this.colors.goalNode);
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
                this.context.fillText(i.toString(), this.cellSize * i + 15 + this.cellSize, this.mapPadding - 5);
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

        const rows = this.grid.length;
        const cols = this.grid[0].length;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const oldNode = this.grid[i][j];
                const node = new Node(i, j);
                node.isPassable = oldNode.isPassable;
                this.grid[i][j] = node;
            }
        }

        this.drawBoard();
        this.drawWalls();

        document.querySelector('.path-find-container .path .path-list').innerHTML = '...';
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

const walls = [[6, 1], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [7, 7], [7, 4], [7, 8], [7, 9], [12, 3], [12, 4], [14, 0], [14, 1], [14, 2], [14, 3], [14, 7]];
walls.forEach((wall) => {
    grid[wall[0]][wall[1]].isPassable = false;
});

let map = null;

async function start() {
    map.reset();
    const startT = getStartNode();
    const endT = getGoalNode();
    map.disableControls()

    const startX = grid[startT[0]][startT[1]];
    const endX = grid[endT[0]][endT[1]];

    const path = await map.findPath(startX, endX);
    document.querySelector('.path-find-container .path .path-list').innerHTML = JSON.stringify(path);
    map.drawPath(path, startX, endX)
}

window.addEventListener("load", async () => {
    map = new GridMap(grid);
    const startT = getStartNode();
    const endT = getGoalNode();
    map.disableControls();

    const startNode = grid[startT[0]][startT[1]];
    const endNode = grid[endT[0]][endT[1]];

    const path = await map.findPath(startNode, endNode);
    document.querySelector('.path-find-container .path .path-list').innerHTML = JSON.stringify(path);
    map.drawPath(path, startNode, endNode);

    document.getElementById('start-button').addEventListener('click', start);
});