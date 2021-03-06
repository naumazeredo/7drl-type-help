// jshint esversion:6

const inputline = document.getElementById('inputline');

let input_visible = true;

const InputStates = Object.freeze({
  Normal : { id: 1, terminal: true },
  History: { id: 2, terminal: true },
  Idle   : { id: 3, terminal: false }
});

let input_state = InputStates.Normal;

function set_input_visible(visible) {
  input_visible = visible;
  inputline.style.display = input_visible ? "block" : "none";
}

function input_new_line() {
  if (input_text.length > 0) {
    history.unshift(input_text);
  }

  input_text = "";
  input_cursor = 0;
  update_ps_html();
  update_user_input_html();

}

function set_input_state(state) {
  input_state = state;
  if (state.terminal != input_visible) set_input_visible(state.terminal);
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
    inputline.scrollIntoView();

    if (key == 37) input_cursor = Math.max(0, input_cursor-1);
    else if (key == 39) input_cursor = Math.min(input_text.length, input_cursor+1);
    else {
      set_input_state(InputStates.History);
      handle_input(event);
      return;
    }
  } else if (is_printable(key) && input_text.length < 64) {
    inputline.scrollIntoView();
    input_text =
      input_text.slice(0, input_cursor) +
      event.key +
      input_text.slice(input_cursor);
    input_cursor++;
  } else if (is_enter(key)) {
    inputline.scrollIntoView();
    execute_command();
  } else if (is_backspace(key)) {
    if (input_cursor > 0) {
      input_text =
        input_text.slice(0, input_cursor-1) +
        input_text.slice(input_cursor);
      input_cursor--;
    }
    inputline.scrollIntoView();
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
