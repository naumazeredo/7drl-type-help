// jshint esversion:6

class Node {
  constructor(name, parent = null, children = []) {
    this.name = name;
    this.parent = parent;
    this.children = children;
  }

  add_children(node_list) {
    for (let node of node_list) {
      node.parent = this;
    }

    this.children.push(...node_list);
  }
}

class Tree {
  constructor(root) {
    this.root = root;
  }
}

let nodes = [];

nodes.push(new Node("node 0"));
nodes.push(new Node("node 1"));
nodes.push(new Node("node 2"));

nodes[0].add_children([ nodes[1], nodes[2] ]);

for (let node of nodes) {
  console.log(node);
}
