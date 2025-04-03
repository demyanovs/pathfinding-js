import Node from "./Node.js";

class GridMap {
    constructor(rows, cols) {
        const grid = [];
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

        this.grid = grid;
    }

    setIsPassable(x, y, isPassable) {
        this.grid[x][y].isPassable = isPassable;
    }

    isPassable(x, y) {
        return this.grid[x][y].isPassable;
    }

    getNode(x, y) {
        return this.grid[x][y];
    }

    setNode(x, y, node) {
        this.grid[x][y] = node;
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

    setNodeCost(x, y, cost) {
        this.grid[x][y].cost = cost;
    }

    getNodeCost(x, y) {
        return this.grid[x][y].cost;
    }
}

export default GridMap;