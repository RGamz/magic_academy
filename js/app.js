function play(id){ document.getElementById(id).play(); }
function next(curr,next){ 
  document.getElementById(curr).classList.add('hidden');
  document.getElementById(next).classList.remove('hidden');
}