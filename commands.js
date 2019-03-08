// jshint esversion:6


function execute_command() {
  add_output(inputline.innerHTML);
  set_input_state(InputStates.Idle);

  let args = input_text.trim().split(" ");
  if (args.length >= 1 && args[0] !== "") {
    if (args[0] in Commands) {
      let cmd = args[0];
      if ("alt" in Commands[args[0]])
        cmd = Commands[args[0]].alt;

      Commands[cmd].callback(args);
    } else {
      unknown_command(args);
    }
  }

  set_input_state(InputStates.Normal);
  input_new_line();
}

// Commands
const Commands = Object.freeze(
  {
    "help" : { id: 1, callback: help_command, desc: "this command" },
    "move" : { id: 2, callback: cd_command, desc: "move to adjacent room (.. is parent)" },
    "cd"   : { id: 102, alt: "move" },
    "see"  : { id: 3, callback: ls_command, desc: "show current room" },
    "ls"   : { id: 103, alt: "see" },
    "map"  : { id: 4, callback: map_command, desc: "show known map" },
    "inv"  : { id: 5, callback: inv_command, desc: "show inventory items" },
    "take" : { id: 6, callback: take_command, desc: "take item from the room to inventory" },
    "dispose" : { id: 7, callback: dispose_command, desc: "dispose item from inventory to the room" }
  }
);


function help_command(args) {
  let text = "commands available:\n";

  for (let cmd in Commands) if (Commands.hasOwnProperty(cmd)) {
    if ("alt" in Commands[cmd]) continue;
    text += "  " + cmd + " - " + Commands[cmd].desc + "\n";
  }

  add_output(text);
}

function unknown_command(args) { add_output("command not found: " + args[0]); }
function ls_command(args)      { add_output(list_sub()); }
function map_command(args)     { add_output(show_map()); }
function inv_command(args)     { add_output(show_inv()); }

function cd_command(args) {
  if (args.length > 1) change_dir(args[1]);
  else console.log("invalid cd?");
}

function take_command(args) {
  if (args.length == 1) {
    add_output("You can't take nothing!");
    return;
  }

  add_output(add_to_inv(args[1]));
}

function dispose_command(args) {
  if (args.length == 1) {
    add_output("You can't dispose nothing!");
    return;
  }

  add_output(remove_from_inv(args[1]));
}
