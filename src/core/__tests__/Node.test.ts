import {Node} from '../Node';
import {EventListener} from "../Node";

describe('Node', () => {
  let rootNode: Node<string>;

  beforeEach(() => {
    rootNode = new Node<string>("root");
  });

  test('initializes with empty children and path', () => {
    expect(rootNode.children.size).toBe(0);
    expect(rootNode.path).toEqual(['root']);
  });

  test('sets and retrieves data correctly', () => {
    rootNode.data = 'Root Data';
    expect(rootNode.data).toBe('Root Data');
  });

  test('adds and retrieves child nodes', () => {
    const childNode = new Node<string>("child");
    rootNode.addChild(childNode);

    expect(rootNode.children.size).toBe(1);
    expect(rootNode.children.get('child')).toBe(childNode);
  });
  describe("getRoot", () => {
    it("should return the root node", () => {
      const root = new Node("root");
      const child1 = new Node("child1");
      const child2 = new Node("child2");
      const grandchild = new Node("grandchild");

      root.addChild(child1);
      root.addChild(child2);
      child1.addChild(grandchild);

      const rootNode = grandchild.root;
      expect(rootNode).toBe(root);
    });

    it("should return itself if it is the root node", () => {
      const root = new Node("root");
      const rootNode = root.root;
      expect(rootNode).toBe(root);
    });
  });

  describe('addEventListener', () => {
    it('should add event listener to the node', () => {
      const node = new Node('root');
      const event = 'click';
      const listener = jest.fn();

      node.addEventListener(event, listener);

      expect(node.eventListeners.get(event)).toEqual([listener]);
    });

    it('should add multiple event listeners to the same event', () => {
      const node = new Node('root');
      const event = 'click';
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      node.addEventListener(event, listener1);
      node.addEventListener(event, listener2);

      expect(node.eventListeners.get(event)).toEqual([listener1, listener2]);
    });
  });

  describe("emitEvent", () => {
    it("should trigger event listeners and propagate event to children and parent", () => {
      const node1 = new Node<string>("node1");
      const node2 = new Node<string>("node2");
      const node3 = new Node<string>("node3");

      const eventListener1 = jest.fn() as EventListener<string>;
      const eventListener2 = jest.fn() as EventListener<string>;

      node1.addChild(node2);
      node2.addChild(node3);

      node1.addEventListener("customEvent", eventListener1);
      node2.addEventListener("customEvent", eventListener2);

      const eventData = {message: "Hello, World!"};
      node2.emitEvent("customEvent", eventData);


      expect(eventListener2).toHaveBeenCalledWith({
        eventData,
        target: node2,
        current: node2,
        isChild: false,
      });

      expect(eventListener1).toHaveBeenCalledWith({
        eventData,
        target: node2,
        current: node1,
        isChild: true,
      });
    });

    it("should not trigger event listeners if no listeners are registered", () => {
      const node = new Node<string>("node");

      const eventListener = jest.fn() as EventListener<string>
      node.addEventListener("customEvent", eventListener);

      node.emitEvent("customEvent");

      expect(eventListener).toHaveBeenCalled();
    });
  });

  test('traverses all nodes and calls callback', () => {
    const dir1Node = new Node<string>('dir1');
    const file1Node = new Node<string>('file1');
    const file2Node = new Node<string>('file2');

    rootNode.addChild(dir1Node);
    dir1Node.addChild(file1Node);
    dir1Node.addChild(file2Node);

    const callback = jest.fn();
    rootNode.traverse(callback);

    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback).toHaveBeenCalledWith(rootNode);
    expect(callback).toHaveBeenCalledWith(dir1Node);
    expect(callback).toHaveBeenCalledWith(file1Node);
    expect(callback).toHaveBeenCalledWith(file2Node);
  });
  test('returns undefined for invalid path', () => {
    const path = ['dir1', 'file1'];
    const node = rootNode.getNodeByPath(path);

    expect(node).toBeUndefined();
  });

  test('returns correct node for valid path', () => {
    const dir1Node = new Node<string>('dir1');
    const file1Node = new Node<string>('file1');
    const file2Node = new Node<string>('file2');

    rootNode.addChild(dir1Node);
    dir1Node.addChild(file1Node);
    dir1Node.addChild(file2Node);

    const path = ['dir1', 'file1'];
    const node = rootNode.getNodeByPath(path);

    expect(node).toBe(file1Node);
  });


  test('returns undefined if no node satisfies the condition', () => {
    const dir1Node = new Node<string>('dir1');
    const file1Node = new Node<string>('file1');

    rootNode.addChild(dir1Node);
    dir1Node.addChild(file1Node);

    const condition = (node: Node<string>) => node.data === 'File 2 Data';
    const foundNode = rootNode.findNodeByCondition(condition);

    expect(foundNode).toBeUndefined();
  });

  test('returns correct node if a node satisfies the condition', () => {
    const dir1Node = new Node<string>('dir1', 'dir 1 Data');
    const file1Node = new Node<string>('file1', 'File 1 Data');

    rootNode.addChild(dir1Node);
    dir1Node.addChild(file1Node);

    const condition = (node: Node<string>) => node.data === 'File 1 Data';
    const foundNode = rootNode.findNodeByCondition(condition);

    expect(foundNode).toBe(file1Node);
  });
  it('should add the child node to the children map', () => {
    const parentNode = new Node<string>('Parent', 'Parent Data');
    const childNode = new Node<string>('Child', 'Child Data');

    expect(parentNode.children.size).toBe(0);

    parentNode.addChild(childNode);

    expect(parentNode.children.size).toBe(1);
    expect(parentNode.children.get(childNode.name)).toBe(childNode);
  });
  describe("removeNodeByPath", () => {
    it("should remove the node by path", () => {
      const root = new Node("root");
      const child1 = new Node("child1");
      const child2 = new Node("child2");
      const grandchild = new Node("grandchild");

      root.addChild(child1);
      root.addChild(child2);
      child1.addChild(grandchild);

      expect(root.children.size).toBe(2);
      expect(child1.children.size).toBe(1);

      const removed = root.remove(["child1", "grandchild"]);

      expect(removed).toBe(true);
      expect(root.children.size).toBe(2);
      expect(child1.children.size).toBe(0);
    });

    it("should return false if node not found", () => {
      const root = new Node("root");
      const child = new Node("child");
      root.addChild(child);

      const removed = root.remove(["child", "grandchild"]);

      expect(removed).toBe(false);
      expect(root.children.size).toBe(1);
    });

    it("should return false if trying to remove root node", () => {
      const root = new Node("root");
      const removed = root.remove([]);

      expect(removed).toBe(false);
    });
  });
});
