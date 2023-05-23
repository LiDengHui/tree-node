# tree-node-lib

这是一个Node类和相关接口的代码库，用于创建一个节点树结构并实现事件监听和触发功能。

## 接口

### EventData

```ts
export interface EventData<T = any, U = any> {
  eventData?: U;
  target: Node<T>;
  current: Node<T>;
  isChild: boolean;
}
```

`EventData`接口定义了事件数据的结构，包括`eventData`、`target`、`current`和`isChild`四个属性。

`eventData`：事件数据，类型为泛型U，可选。
`target`：事件目标节点，类型为Node<T>。
`current`：当前节点，类型为Node<T>。
`isChild`：是否为子节点触发的事件，类型为布尔值。

### EventListener

```ts
export type EventListener<T = any> = (options: EventData<T>) => void;
```

`EventListener`类型定义了事件监听器的结构，接受一个参数`options`，类型为`EventData<T>`，并且没有返回值。


## 类

### Node

```ts

export class Node<T = any> {
  children: Map<PropertyKey, Node<T>>;
  data: T | undefined;
  name: PropertyKey;
  eventListeners: Map<string, EventListener<T>[]>;
  parent: Node<T> | undefined;

  constructor(name: PropertyKey, data: T | undefined = undefined, parent?: Node<T>) {
    // ...
  }

  get path(): PropertyKey[] {
    // ...
  }

  addEventListener(event: string, listener: EventListener<T>): void {
    // ...
  }

  emitEvent(event: string, eventData?: any): void {
    // ...
  }

  private _emitEvent(event: string, eventObj: EventData<T>): void {
    // ...
  }

  findNodeByCondition(condition: (node: Node<T>) => boolean): Node<T> | undefined {
    // ...
  }

  addChild(childNode: Node<T>): void {
    // ...
  }

  traverse(callback: (node: Node<T>) => void): void {
    // ...
  }

  getNodeByPath(path: PropertyKey[]): Node<T> | undefined {
    // ...
  }

  get root(): Node<T> {
    // ...
  }

  remove(path: PropertyKey[] = []): boolean {
    // ...
  }
}
```

`Node`类表示节点，用于构建节点树结构。具有以下属性和方法：

    children：子节点的映射表，类型为Map<PropertyKey, Node<T>>。
    data：节点数据，类型为泛型T或undefined。
    name：节点名称，类型为PropertyKey。
    eventListeners：事件监听器的映射表，类型为Map<string, EventListener<T>[]>。
    parent：父节点，类型为Node<T>或undefined。

构造函数

    constructor(name: PropertyKey, data: T | undefined = undefined, parent?: Node<T>)：创建一个节点对象。
    name：节点名称。
    data：节点数据，默认为undefined。
    parent：父节点，默认为undefined。

方法

    get path(): PropertyKey[]：获取节点的路径，返回一个由PropertyKey组成的数组。
    addEventListener(event: string, listener: EventListener<T>): void：添加事件监听器。
        event：事件名称。
        listener：事件监听器回调函数。
    emitEvent(event: string, eventData?: any): void：触发事件。
        event：事件名称。
        eventData：事件数据，可选。
    findNodeByCondition(condition: (node: Node<T>) => boolean): Node<T> | undefined：根据条件查找节点。
        condition：条件判断函数，接受一个节点参数，返回布尔值。
    addChild(childNode: Node<T>): void：添加子节点。
        childNode：要添加的子节点对象。
    traverse(callback: (node: Node<T>) => void): void：遍历节点树，并对每个节点执行回调函数。
        callback：回调函数，接受一个节点参数。
    getNodeByPath(path: PropertyKey[]): Node<T> | undefined：根据路径获取节点。
        path：节点路径，由PropertyKey组成的数组。
    get root(): Node<T>：获取根节点。
    remove(path: PropertyKey[] = []): boolean：移除节点。
        path：节点路径，默认为空数组。

以上是该代码库的基本结构和功能说明，使用者可以根据需要创建和操作节点树，并进行事件监听和触发操作。


## 接口

```ts
export interface TreeNode<T = any> {
  name: PropertyKey;
  data: T | undefined;
  children: Array<TreeNode<T>>;
}
```
`TreeNode`接口定义了节点树的结构，包括`name`、`data`和`children`三个属性。

    name：节点名称，类型为PropertyKey。
    data：节点数据，类型为泛型T或undefined。
    children：子节点数组，类型为Array<TreeNode<T>>。

## 类

### NodeUtils

```ts
export class NodeUtils {
  static convertNodeToJSON<T>(node: Node<T>): TreeNode<T> {
    // ...
  }

  static convertJSONToNode<T>(json: TreeNode<T>): Node<T> {
    // ...
  }
}

```

`NodeUtils`类是一个节点操作的工具类，提供了将`Node`对象转换为JSON对象和将JSON对象转换为`Node`对象的方法。

方法

    static convertNodeToJSON<T>(node: Node<T>): TreeNode<T>：将Node对象转换为JSON对象。
        node：要转换的Node对象。
    static convertJSONToNode<T>(json: TreeNode<T>): Node<T>：将JSON对象转换为Node对象。
        json：要转换的JSON对象。

以上是该代码库的基本结构和功能说明，使用者可以通过NodeUtils工具类进行Node对象和JSON对象之间的转换操作。
