// jshint esversion:6

const ps0 = document.getElementById('PS0');
const psr = document.getElementById('PSR');

function get_ps0_html() {
  return "you@lab " + show_dir() + " $ ";
}

function get_psr_html() {
  return "(inv " + inv_length + "/" + inv_max + ")";
}

function update_ps_html() {
  ps0.innerHTML = get_ps0_html();
  psr.innerHTML = get_psr_html();
}
