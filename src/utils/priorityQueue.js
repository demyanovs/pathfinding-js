class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(node, priority) {
        // console.log("Enqueueing", node, priority);
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

    size() {
        return this.items.length;
    }
}

export default PriorityQueue;