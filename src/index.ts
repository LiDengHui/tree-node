import {NodeUtils} from "./lib";


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


console.log(rootNode)
