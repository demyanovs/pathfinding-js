class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isPassable = true;
        this.g = Infinity; // Cost from start node
        this.h = 0; // Heuristic cost
        this.f = Infinity; // Total cost
        this.parent = null;
        this.cost = 1; // Cost for weighted graph
    }
}

export default Node;