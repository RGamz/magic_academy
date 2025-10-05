function play(id){ document.getElementById(id).play(); }
function next(curr,next){ 
  document.getElementById(curr).classList.add('hidden');
  document.getElementById(next).classList.remove('hidden');
}

// мини-игра «кликни слово к картинке»
const picks = {};
document.addEventListener('click', e => {
  if(e.target.classList.contains('pick')){
    const k = e.target.dataset.key;
    picks[k] = 'img';
    document.getElementById('result').textContent = `Tu as choisi l'image: ${k}`;
  }
  if(e.target.classList.contains('choice')){
    const k = e.target.dataset.key;
    const ok = picks[k] === 'img';
    document.getElementById('result').textContent = ok ? 'Correct ✅' : 'Essaie encore ❌';
  }
});
