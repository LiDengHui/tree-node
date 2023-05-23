import {Node} from './Node'

export interface TreeNode<T = any> {
  name: PropertyKey;
  data: T | undefined;
  children: Array<TreeNode<T>>;
}

export class NodeUtils {
  static convertNodeToJSON<T>(node: Node<T>): TreeNode<T> {
    const json: TreeNode<T> = {
      name: node.name,
      data: node.data,
      children: []
    };

    for (const childNode of node.children.values()) {
      const childJson = NodeUtils.convertNodeToJSON(childNode);
      json.children.push(childJson);
    }

    return json;
  }

  static convertJSONToNode<T>(json: TreeNode<T>): Node<T> {
    const node = new Node<T>(json.name, json.data);

    for (const childJson of json.children) {
      const childNode = NodeUtils.convertJSONToNode<T>(childJson);
      node.addChild(childNode);
    }

    return node;
  }
}
