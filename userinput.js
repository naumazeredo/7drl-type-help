// jshint esversion:6

const userinput = document.getElementById('userinput');

let input_text = "";
let input_cursor = 0;

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
