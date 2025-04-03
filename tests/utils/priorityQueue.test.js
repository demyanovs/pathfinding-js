import PriorityQueue from '../../src/utils/priorityQueue.js';

describe('PriorityQueue Utility', () => {
    test('should enqueue elements with priority', () => {
        const pq = new PriorityQueue();
        pq.enqueue('A', 2);
        pq.enqueue('B', 1);
        expect(pq.size()).toBe(2);
    });

    test('should dequeue elements in order of priority', () => {
        const pq = new PriorityQueue();
        pq.enqueue('A', 2);
        pq.enqueue('B', 1);
        expect(pq.dequeue()).toBe('B');
        expect(pq.dequeue()).toBe('A');
    });

    test('should return correct size', () => {
        const pq = new PriorityQueue();
        pq.enqueue('A', 2);
        pq.enqueue('B', 1);
        expect(pq.size()).toBe(2);
        pq.dequeue();
        expect(pq.size()).toBe(1);
    });

    test('should handle empty queue correctly', () => {
        const pq = new PriorityQueue();
        expect(pq.isEmpty()).toBe(true);
        pq.enqueue('A', 2);
        expect(pq.isEmpty()).toBe(false);
        pq.dequeue();
        expect(pq.isEmpty()).toBe(true);
    });
});