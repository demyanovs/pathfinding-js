class CanvasRenderer {
    cellSize = 36;
    mapPadding = 36;
    colors = {
        board: '#EAE7E1',
        startNode: '#214ECA',
        goalNode: '#E52E2E',
        adjacent: '#00A30E',
        explored: '#878787',
        path: '#6CA1DA',
        wall: '#993A15'
    };

    constructor(grid, canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.grid = grid;
    }

    render(path, start, end) {
        this.path = path;
        this.start = start;
        this.end = end;

        this.clearCanvas();
        this.drawBoard();
        this.drawWalls();
        this.drawPath();
        this.drawForests();
    }

    drawBoard() {
        // horizontal
        this.ctx.font = "18px Arial";
        this.ctx.fillStyle = 'black';
        const gCols = this.grid.grid.length;
        const gRows = this.grid.grid[0].length;

        for (let i = 0; i <= gCols; i++) {
            this.ctx.moveTo(i * this.cellSize + this.cellSize, this.mapPadding);
            this.ctx.lineTo(i * this.cellSize + this.cellSize, this.cellSize * (gRows + 1));
            if (i < gCols) {
                this.ctx.fillText(i.toString(), this.cellSize * i + 15 + this.cellSize, this.mapPadding - 5);
            }
        }

        for (let i = 0; i <= gRows; i++) {
            this.ctx.moveTo(this.mapPadding, i * this.cellSize + this.cellSize);
            this.ctx.lineTo(this.cellSize * (gCols + 1), i * this.cellSize + this.cellSize);
            if (i < gRows) {
                this.ctx.fillText(i.toString(), this.mapPadding - 25, this.cellSize * i - this.cellSize / 2 + this.cellSize + this.cellSize);
            }
        }

        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }

    drawWalls() {
        const nodes = this.grid.getNodes();
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (!node.isPassable) {
                this.fillNode([node.x, node.y], this.colors.wall);
            }
        }
    }

    drawPath() {
        this.path.forEach((node) => {
            this.fillNode([node[0], node[1]], this.colors.path);
        });

        this.fillNode(this.start, this.colors.startNode);
        this.fillNode(this.end, this.colors.goalNode);
    }

    fillNode(node, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            this.cellSize * (node[0]) + this.mapPadding,
            this.cellSize * (node[1]) + this.mapPadding,
            this.cellSize,
            this.cellSize);
        this.ctx.stroke();
    }

    drawForests() {
        const image = new Image();
        image.src = 'https://demyanov.dev/images/articles/algorithms/forest.png';
        image.onload = () => {
            const nodes = this.grid.getNodes();
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if (node.isForest) {
                    this.ctx.drawImage(
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

    clearCanvas() {
        const gCols = this.grid.grid.length;
        const gRows = this.grid.grid[0].length;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.colors.board;
        this.ctx.fillRect(this.mapPadding, this.mapPadding, gCols * this.cellSize, gRows * this.cellSize);
    }
}

export default CanvasRenderer;