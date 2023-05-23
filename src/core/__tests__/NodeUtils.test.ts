import {Node, NodeUtils} from "../";

describe('NodeUtils', () => {
  describe('convertNodeToJSON', () => {
    it('should convert a Node object to JSON', () => {
      const rootNode = new Node<string>('Root', 'Root Data');
      const childNode = new Node<string>('Child', 'Child Data');
      rootNode.addChild(childNode);

      const jsonTree = NodeUtils.convertNodeToJSON(rootNode);

      expect(jsonTree).toEqual({
        name: 'Root',
        data: 'Root Data',
        children: [
          {
            name: 'Child',
            data: 'Child Data',
            children: []
          }
        ]
      });
    });
  });

  describe('convertJSONToNode', () => {
    it('should convert a JSON object to Node', () => {
      const jsonTree = {
        name: 'Root',
        data: 'Root Data',
        children: [
          {
            name: 'Child',
            data: 'Child Data',
            children: []
          }
        ]
      };

      const rootNode = NodeUtils.convertJSONToNode<string>(jsonTree);

      expect(rootNode.name).toBe('Root');
      expect(rootNode.data).toBe('Root Data');
      expect(rootNode.children.size).toBe(1);
      expect(rootNode.children.get('Child')).toBeDefined();
      expect(rootNode.children.get('Child')!.data).toBe('Child Data');
    });
  });





});
