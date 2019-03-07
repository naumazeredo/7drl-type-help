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
  Normal: 1,
  History: 2
});

let input_state = InputStates.Normal;

function get_ps0_html() {
  return "$ ";
}

function update_ps0_html() {
  ps0.innerHTML = get_ps0_html();
}

function toggle_input() {
  input_visible = !input_visible;
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
    history.push(input_text);
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
function handle_input(event) {
  let key = event.keyCode || event.which;

  if (input_state == InputStates.Normal) {
    if (event.ctrlKey) {
      console.log("Ctrl");
    } else if (is_arrows(key)) {
      if (key == 37) input_cursor = Math.max(0, input_cursor-1);
      else if (key == 39) input_cursor = Math.min(input_text.length, input_cursor+1);
      else {
        input_state = InputStates.History;
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
      past.innerHTML += '<div>' + inputline.innerHTML + '</div>';
      input_new_line();
    } else if (is_backspace(key)) {
      if (input_cursor > 0) {
        input_text =
          input_text.slice(0, input_cursor-1) +
          input_text.slice(input_cursor);
        input_cursor--;
      }
    }

    update_user_input_html();
  } else if (input_state == InputStates.History) {
    if (key != 38 && key != 40) {
      input_state = InputStates.Normal;
      reset_history_search();
      handle_input(event);
      return;
    }

    history_search(key == 38);
    update_user_input_html();
  }
}

document.addEventListener('keydown', event => {
  handle_input(event);
});


//
input_new_line();
