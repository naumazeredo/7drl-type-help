// jshint esversion:6

let history = [];

let history_search_pos = -1;
let history_search_text = "";
let history_search_cursor = 0;

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
