// jshint esversion:6

const Types = Object.freeze({
  Dir: 1,
  File: 2,
  Inv: 3
});

class Node {
  constructor(name, type = null) {
    this.name = name;
    this.parent = null;
    this.children = {};
    this.type = type;
    this.is_known = false;
    this.depth = 0;
  }

  add_child(node) {
    this.children[node.name] = node;
    node.parent = this;
    node.depth = this.depth + 1;
  }

  remove_child(node) {
    if(typeof(node) === 'string') delete this.children[node];
    else delete this.children[node.name];
  }
}

class Tree {
  constructor(root) {
    this.root = root;
  }
}

let rooms = [];
let items = [];
let position;
let inv = new Node("inv", Types.Inv);
let inv_length = 0;
let inv_max = 7;

function generate_random_tree(n_rooms = 30, n_items = 50) {
  for(let i = 0; i < n_rooms; i++) {
    rooms.push(new Node("room_" + i, Types.Dir));
  }
  for(let i = 1; i < n_rooms; i++) {
    let parent = Math.floor(Math.random()*i);
    rooms[parent].add_child(rooms[i]);
  }
  rooms[0].name = "";

  for(let i = 0; i < n_items; i++) {
    items.push(new Node("item_" + i, Types.File));
    let parent = Math.floor(Math.random()*n_rooms);
    rooms[parent].add_child(items[i]);
  }
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
  if(dest in position.children) {
    return choose_pos(position.children[dest]);
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
  if (node == null) node = position;

  var ans = ".";
  if(node.parent != null) ans += " ..";
  for(let i in node.children) if(node.children.hasOwnProperty(i)) {
    ans += " " + i;
  }
  return ans;
}

function show_map_dfs(node, min_depth) {
  let ans = "";

  if(node.is_known === true || (node.parent != null && node.parent.is_known === true)) {
    for(let i = 0; i < node.depth-min_depth; i++) ans += "| ";
    ans += node.name;
    if(node.name === "") ans += "/";

    if(node.is_known === false && node.type === Types.Dir) ans += "(?)";

    ans += "\n";
  }

  for(let v in node.children) {
    ans += show_map_dfs(node.children[v], min_depth);
  }

  return ans;
}

function show_map() {
  let min_depth = position.depth;
  for(let i of rooms) if(i.is_known === true) {
    min_depth = Math.min(i.depth, min_depth);
  }

  return show_map_dfs(rooms[0], min_depth);
}

function show_inv() {
  ans = "(" + inv_length + "/" + inv_max + "):";
  for(let v in inv.children) ans += " " + v;
  if (inv_length == 0) ans += " (nothing)";
  return ans;
}

function add_to_inv(item) {
  if(inv_length >= inv_max) {
    return "Inventory is full";
  }

  if (item in position.children) {
    if(position.children[item].type === Types.Dir) {
      return item + " is not and item!";
    }
    inv.add_child(position.children[item]);
    position.remove_child(item);
    inv_length++;
    return item + " added to inventory!";
  }

  return item + " is not here!";
}

function remove_from_inv(item) {
  if (item in inv.children) {
    position.add_child(inv.children[item]);
    inv.remove_child(item);
    inv_length--;
    return item + " was thrown to the ground!";
  }
  return item + " is not in inventory!";
}

generate_random_tree(3, 10);

choose_pos(rooms[0]);

console.log(position);

