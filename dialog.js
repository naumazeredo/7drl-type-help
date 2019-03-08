// jshint esversion:6

const past      = document.getElementById('past');
const inputline = document.getElementById('inputline');
const userinput = document.getElementById('userinput');
const ps0       = document.getElementById('PS0');

let history = [];

let history_search_pos = -1;
let history_search_text = "";
let history_search_cursor = 0;

let input_text = "";
let input_cursor = 0;

let input_visible = true;

const InputStates = Object.freeze({
  Normal : { id: 1, terminal: true },
  History: { id: 2, terminal: true },
  Idle   : { id: 3, terminal: false }
});

let input_state = InputStates.Normal;

const help_text =
"commands available:<br/><br/>" +
"  help     - this command<br/>" +
"  cd &lt;dir&gt; - change directory to dir (.. is parent)<br/>" +
"  ls       - list subdirectories<br/>";


function get_ps0_html() {
  return "$ ";
}

function update_ps0_html() {
  ps0.innerHTML = get_ps0_html();
}

function set_input_visible(visible) {
  input_visible = visible;
  inputline.style.display = input_visible ? "block" : "none";
}

function get_user_input_html() {
  return input_text.slice(0, input_cursor) +
    '<span class="cursor"><span></span></span>' +
    input_text.slice(input_cursor);
}

function update_user_input_html() {
  userinput.innerHTML = get_user_input_html();
}

function input_new_line() {
  if (input_text.length > 0) {
    history.unshift(input_text);
  }

  input_text = "";
  input_cursor = 0;
  update_ps0_html();
  update_user_input_html();
}

function reset_history_search() {
  history_search_pos = -1;
  history_search_text = "";
  history_search_cursor = 0;
}

function history_search(up) {
  if (history_search_pos == -1) {
    history_search_text = input_text;
    history_search_cursor = input_cursor;
  }

  history_search_pos =
    Math.max(
      -1,
      Math.min(
        history.length-1,
        history_search_pos + (up?1:-1)
      )
    );

  if (history_search_pos == -1) {
    input_text = history_search_text;
    input_cursor = history_search_cursor;
  } else {
    input_text = history[history_search_pos];
    input_cursor = input_text.length;
  }
}

function set_input_state(state) {
  input_state = state;
  if (state.terminal != input_visible) set_input_visible(state.terminal);
}

function add_output(html) {
  past.innerHTML += '<div>' + html + '</div>';
}

function execute_command() {
  add_output(inputline.innerHTML);
  set_input_state(InputStates.Idle);

  let args = input_text.trim().split(" ");
  if (args.length >= 1) {
    if (args[0] in Commands) {
      Commands[args[0]].callback(args);
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
    "help": { id: 1, callback: help_command },
    "cd"  : { id: 2, callback: args => console.log("not implemented") },
    "ls"  : { id: 3, callback: args => console.log("not implemented") }
  }
);

function help_command(args) {
  add_output(help_text);
}

function unknown_command(args) {
  add_output("command not found: " + args[0]);
}

// input handler auxiliar functions
function is_printable(keycode) {
  return (keycode == 32)                  || // space
         (keycode > 47 && keycode < 58)   || // number keys
         (keycode > 64 && keycode < 91)   || // letter keys
         (keycode > 95 && keycode < 112)  || // numpad keys
         (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
         (keycode > 218 && keycode < 223);   // [\]' (in order)
}
function is_enter(keycode) { return keycode == 13; }
function is_backspace(keycode) { return keycode == 8 || keycode == 46; }
function is_arrows(keycode) { return keycode >= 37 && keycode <= 40; }

// input handler
function handle_normal_state(event) {
  let key = event.keyCode || event.which;
  if (event.ctrlKey) {
    //console.log("Ctrl");
  } else if (is_arrows(key)) {
    if (key == 37) input_cursor = Math.max(0, input_cursor-1);
    else if (key == 39) input_cursor = Math.min(input_text.length, input_cursor+1);
    else {
      set_input_state(InputStates.History);
      handle_input(event);
      return;
    }
  } else if (is_printable(key)) {
    input_text =
      input_text.slice(0, input_cursor) +
      event.key +
      input_text.slice(input_cursor);
    input_cursor++;
  } else if (is_enter(key)) {
    execute_command();
  } else if (is_backspace(key)) {
    if (input_cursor > 0) {
      input_text =
        input_text.slice(0, input_cursor-1) +
        input_text.slice(input_cursor);
      input_cursor--;
    }
  }

  update_user_input_html();
}

function handle_history_state(event) {
  let key = event.keyCode || event.which;
  if (key != 38 && key != 40) {
    set_input_state(InputStates.Normal);
    reset_history_search();
    handle_input(event);
    return;
  }

  history_search(key == 38);
  update_user_input_html();
}

function handle_input(event) {
  switch (input_state.id) {
    case InputStates.Normal.id : handle_normal_state(event);  break;
    case InputStates.History.id: handle_history_state(event); break;
    case InputStates.Idle.id   :                              break;
  }
}

document.addEventListener('keydown', event => handle_input(event));


//
input_new_line();
