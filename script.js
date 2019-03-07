// jshint esversion:6

const Types = Object.freeze({
  Dir: 1,
  File: 2
});

class Node {
  constructor(name, type = null) {
    this.name = name;
    this.parent = null;
    this.children = [];
    this.type = type; //["dir", "file"]
    this.is_known = false;
    this.depth = 0;
  }

  add_children(node_list) {
    for (let node of node_list) {
      node.parent = this;
      node.depth = this.depth + 1;
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
let position;

//nodes.push(new Node("node 0"));
//nodes.push(new Node("node 1"));
//nodes.push(new Node("node 2"));

//nodes[0].add_children([ nodes[1], nodes[2] ]);

function generate_random_tree(rooms = 20) {
  for(let i = 0; i < rooms; i++) {
    nodes.push(new Node("room_" + i, Types.Dir));
  }
  for(let i = 1; i < rooms; i++) {
    let parent = Math.floor(Math.random()*i);
    nodes[parent].add_children([nodes[i]]);
  }
  nodes[0].name = "";
}

function choose_pos(node) {
  if(node.type != Types.Dir) {
    console.log("it is not a directory");
    return position;
  }
  position = node;
  position.is_known = true;
  return position;
}

function change_dir(dest = ".") {
  if(dest.localeCompare("..") === 0 && position.parent != null) {
    return choose_pos(position.parent);
  }
  for(let i of position.children) if(i.name.localeCompare(dest) === 0) {
    return choose_pos(i);
  }
  return position;
}

function show_dir(node = null) {
  if(node == null) node = position;

  if(node.parent === null) return "/";

  var ans = "";
  if(node.parent != null) {
    ans = show_dir(node.parent);
    if(node.parent.name.localeCompare("") != 0) ans += "/";
  }
  ans += node.name;
  return ans;
}

function list_sub(node = null) {
  if(node == null) node = position;

  var ans = ". ";
  if(node.parent != null) ans += ".. ";
  for(let i of node.children) {
    ans += i.name + " ";
  }
  return ans;
}

function show_map_dfs(node, min_depth) {
  let ans = "";

  if(node.is_known === true || (node.parent != null && node.parent.is_known === true)) {
    for(let i = 0; i < node.depth-min_depth; i++) ans += "|   ";
    ans += node.name;
    if(node.name.localeCompare("") === 0) ans += "/";

    if(node.is_known === false) ans += "(?)";

    ans += "\n";
  }

  for(let v of node.children) {
    ans += show_map_dfs(v, min_depth);
  }

  return ans;
}

function show_map() {
  let min_depth = position.depth;
  for(let i of nodes) if(i.is_known === true) {
    min_depth = Math.min(i.depth, min_depth);
  }

  return show_map_dfs(nodes[0], min_depth);
}

generate_random_tree(30);

choose_pos(nodes[0]);

console.log(position);

/*
for (let node of nodes) {
  console.log(node);
}
*/
