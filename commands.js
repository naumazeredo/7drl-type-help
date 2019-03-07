// jshint esversion:6

const history   = document.getElementById('history');
const inputline = document.getElementById('inputline');
const userinput = document.getElementById('userinput');
const ps0       = document.getElementById('PS0');

let input_text = "";
let input_cursor = 0;

let input_visible = true;

let test = 0;

function get_ps0_html() {
  return (test ? "(" + test + ") " : "") + "$ ";
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
  input_text = "";
  input_cursor = 0;
  update_ps0_html();
  update_user_input_html();
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
document.addEventListener('keydown', e => {
  let key = e.keyCode;

  if (e.ctrlKey) {
    console.log("Ctrl");
  } else if (is_arrows(key)) {
    if (key == 37) input_cursor = Math.max(0, input_cursor-1);
    if (key == 39) input_cursor = Math.min(input_text.length, input_cursor+1);
  } else if (is_printable(key)) {
    input_text =
      input_text.slice(0, input_cursor) +
      e.key +
      input_text.slice(input_cursor);
    input_cursor++;
  } else if (is_enter(key)) {
    history.innerHTML += '<div>' + inputline.innerHTML + '</div>';
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
});


//
input_new_line();
