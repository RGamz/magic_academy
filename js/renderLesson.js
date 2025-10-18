window.renderLessonFromContent = async function(contentPath, slug){
  const $title = document.getElementById('lesson-title');
  const $leaf  = document.getElementById('crumb-leaf');
  const $img   = document.getElementById('lesson-image');
  const $tasks = document.getElementById('tasks');

  if(!slug){
    $tasks.innerHTML = `<div class="bubble">Не указан id урока (?id=lesson_x).</div>`;
    return;
  }

  try{
    const res = await fetch(contentPath, {cache: 'no-store'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const content = await res.json();

    const data = content.lessons && content.lessons[slug];
    if(!data){
      $tasks.innerHTML = `<div class="bubble">Урок <code>${slug}</code> не найден в <code>${contentPath}</code>.</div>`;
      return;
    }

    // Заголовки/крошки
    if (data.title) { document.title = data.title; $title.textContent = data.title; }
    if (Array.isArray(data.breadcrumb) && data.breadcrumb.length){
      $leaf.textContent = data.breadcrumb[data.breadcrumb.length - 1];
    } else {
      $leaf.textContent = slug.replace(/_/g,' ');
    }

    // Картинка
    if (data.mainImage) {
      $img.src = data.mainImage;
      $img.alt = data.imageAlt || 'Illustration du cours';
    }

    // Задачи
    const tasks = Array.isArray(data.tasks) ? data.tasks : [];
    $tasks.innerHTML = tasks.map((t, idx) => {
      const audioId = `a${idx+1}`;
      const linesHtml = (t.lines || []).map(line => `<p>${line}</p>`).join('');
      const audios = t.audios || (t.audio ? [t.audio] : []);
      const audioHtml = audios.map((src,i) =>
        `<audio id="${audioId}${i||''}" src="${src}" controls preload="metadata"></audio>`
      ).join('');

      return `
        <details class="task">
          <summary class="task-summary">
            <span class="bubble"><b>${t.title || 'Задача'}</b></span>
          </summary>
          <div class="task-body">
            ${audioHtml}
            <div class="text">${linesHtml}</div>
          </div>
        </details>
      `;
    }).join('') + `
      <div class="actions row" style="margin-top:12px">
        ${tasks.map((t, i) => (t.audio || (t.audios && t.audios.length))
          ? `<button class="btn" onclick="(function(){
               const el = document.getElementById('a${i+1}');
               if(el) el.play();
             })()">▶️ Rejouer ${i+1}</button>` : ''
        ).join('')}
        <a class="btn ghost" href="../index.html">⟵ Accueil</a>
      </div>
    `;
  }catch(err){
    console.error(err);
    $tasks.innerHTML = `
      <div class="bubble">Не удалось загрузить <code>${contentPath}</code>.<br>
      Проверь файл и пути.</div>`;
  }
}
