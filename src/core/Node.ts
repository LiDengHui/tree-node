export interface EventData<T = any, U = any> {
  eventData?: U;
  target: Node<T>;
  current: Node<T>;
  isChild: boolean;
}

export type EventListener<T = any> = (options: EventData<T>) => void;

export class Node<T = any> {
  children: Map<PropertyKey, Node<T>>;
  data: T | undefined;
  name: PropertyKey;
  eventListeners: Map<string, EventListener<T>[]>;
  parent: Node<T> | undefined;

  constructor(name: PropertyKey, data: T | undefined = undefined, parent?: Node<T>) {
    this.children = new Map<PropertyKey, Node<T>>();
    this.name = name;
    this.data = data;
    this.eventListeners = new Map<string, EventListener<T>[]>();
    this.parent = parent;
  }

  get path(): PropertyKey[] {
    if (!this.parent) {
      return [this.name];
    }
    const parentPath = this.parent.path;
    return [...parentPath, this.name];
  }

  addEventListener(event: string, listener: EventListener<T>): void {
    const listeners = this.eventListeners.get(event) ?? [];
    this.eventListeners.set(event, [...listeners, listener]);
  }

  emitEvent(event: string, eventData?: any): void {
    const eventObj: EventData<T> = {
      eventData,
      target: this,
      current: this,
      isChild: false,
    };
    this._emitEvent(event, eventObj);
  }

  private _emitEvent(event: string, eventObj: EventData<T>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(eventObj));
    }
    if (this.parent) {
      this.parent._emitEvent(event, {...eventObj, current: this.parent, isChild: true});
    }
  }


  findNodeByCondition(condition: (node: Node<T>) => boolean): Node<T> | undefined {
    if (condition(this)) {
      return this;
    }

    for (const childNode of this.children.values()) {
      const foundNode = childNode.findNodeByCondition(condition);
      if (foundNode) {
        return foundNode;
      }
    }
    return undefined;
  }

  addChild(childNode: Node<T>): void {
    this.children.set(childNode.name, childNode);
    childNode.parent = this;
  }

  traverse(callback: (node: Node<T>) => void): void {
    callback(this);
    this.children.forEach((child) => child.traverse(callback));
  }

  getNodeByPath(path: PropertyKey[]): Node<T> | undefined {
    if (path.length === 0) {
      return this;
    }

    const [segment, ...rest] = path;
    const childNode = this.children.get(segment);

    if (!childNode) {
      return undefined;
    }

    return childNode.getNodeByPath(rest);
  }

  get root(): Node<T> {
    let node: Node<T> = this;
    while (node.parent) {
      node = node.parent;
    }
    return node;
  }


  remove(path: PropertyKey[] = []): boolean {
    if (path.length === 0) {
      if (this.parent) {
        this.parent.children.delete(this.name);
        return true;
      }
      return false;
    }

    const [segment, ...rest] = path;
    const childNode = this.children.get(segment);

    if (!childNode) {
      return false;
    }

    return childNode.remove(rest);
  }

}
