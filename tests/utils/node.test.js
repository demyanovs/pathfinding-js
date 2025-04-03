import Node from '../../src/utils/Node.js';

describe('Node Utility', () => {
    test('should create a node with specified coordinates', () => {
        const node = new Node(5, 10);
        expect(node.x).toBe(5);
        expect(node.y).toBe(10);
    });

    test('should set and get passable status', () => {
        const node = new Node(5, 10);
        node.isPassable = false;
        expect(node.isPassable).toBe(false);
        node.isPassable = true;
        expect(node.isPassable).toBe(true);
    });

    test('should set and get node cost', () => {
        const node = new Node(5, 10);
        node.cost = 3;
        expect(node.cost).toBe(3);
    });

    test('should set and get parent node', () => {
        const parentNode = new Node(4, 9);
        const node = new Node(5, 10);
        node.parent = parentNode;
        expect(node.parent).toBe(parentNode);
    });
});