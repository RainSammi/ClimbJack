(() => {
  const $ = (id) => document.getElementById(id);
  const content = window.BOOK_CONTENT;
  const state = { started: false, ready: false, opened: false, index: 0, busy: false };
  const nav = $('navLinks');
  const book = $('book');
  const cover = $('bookCover');
  const pages = $('bookPages');
  const next = $('nextButton');
  const prev = $('prevButton');
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const escapeHTML = (text) => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const attr = escapeHTML;

  function renderSide(data, side, chapter, number) {
    let inner = `<div class="chapter">${escapeHTML(chapter)}</div>`;
    if (data.type === 'panorama') {
      // 長條場景獨立於書本翻頁：書頁上下無留白，左右可滑動／按箭頭。
      return `<article class="page ${side} panorama-page" aria-label="${attr(data.title)}">
        <div class="panorama-viewport" tabindex="0" role="region" aria-label="可左右探索的長條場景：${attr(data.title)}">
          <img class="panorama-img" src="${attr(data.image)}" alt="${attr(data.title)}" draggable="false">
        </div>
        <div class="panorama-overlay"><span>${escapeHTML(chapter)}</span><strong>${escapeHTML(data.title)}</strong></div>
        <button type="button" class="panorama-arrow panorama-prev" aria-label="場景向左移動">‹</button>
        <button type="button" class="panorama-arrow panorama-next" aria-label="場景向右移動">›</button>
        <div class="panorama-note">← 滑動探索場景 →</div>
        <div class="page-num">— ${number} —</div>
      </article>`;
    }
    if (data.type === 'image') {
      const image = data.image ? `<img src="${attr(data.image)}" alt="${attr(data.title)}" onerror="this.style.display='none'">` : '';
      inner += `<div class="artwork${data.image ? ' has-image' : ''}${data.image && data.image.endsWith('.gif') ? ' sprite-art' : ''}">${image}<span class="art-tag">${escapeHTML(data.tag)}</span><div class="art-symbol" aria-hidden="true">🌿</div><span class="placeholder-label">IMAGE PLACEHOLDER</span></div><h2 class="art-title">${escapeHTML(data.title)}</h2><p class="caption">${escapeHTML(data.caption)}</p>`;
    } else {
      inner += `<h2>${escapeHTML(data.title)}</h2><div class="subtitle">${escapeHTML(data.subtitle)}</div>`;
      if (data.type === 'text') {
        inner += (data.paragraphs || []).map(t => `<p>${escapeHTML(t)}</p>`).join('');
        if (data.chips) inner += `<div class="chips">${data.chips.map(t => `<span>${escapeHTML(t)}</span>`).join('')}</div>`;
      }
      if (data.type === 'features') inner += data.features.map(([icon, title, desc]) => `<div class="feature"><span class="feature-icon">${escapeHTML(icon)}</span><div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(desc)}</p></div></div>`).join('');
      if (data.type === 'credits') inner += data.members.map(([name, role]) => `<div class="member"><strong>${escapeHTML(name)}</strong><span>${escapeHTML(role)}</span></div>`).join('');
    }
    return `<article class="page ${side}">${inner}<div class="page-num">— ${number} —</div></article>`;
  }

  function setupPanoramas() {
    pages.querySelectorAll('.panorama-page').forEach(page => {
      const viewport = page.querySelector('.panorama-viewport');
      const left = page.querySelector('.panorama-prev');
      const right = page.querySelector('.panorama-next');
      const update = () => {
        const max = viewport.scrollWidth - viewport.clientWidth;
        left.disabled = viewport.scrollLeft <= 2;
        right.disabled = viewport.scrollLeft >= max - 2;
      };
      left.addEventListener('click', e => { e.stopPropagation(); viewport.scrollBy({left: -viewport.clientWidth * .7, behavior:'smooth'}); });
      right.addEventListener('click', e => { e.stopPropagation(); viewport.scrollBy({left: viewport.clientWidth * .7, behavior:'smooth'}); });
      viewport.addEventListener('scroll', update, {passive:true});
      viewport.querySelector('img').addEventListener('load', update);
      viewport.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.stopPropagation(); e.preventDefault();
          viewport.scrollBy({left: (e.key === 'ArrowRight' ? 1 : -1) * viewport.clientWidth * .7, behavior:'smooth'});
        }
      });
      // Desktop pointer-drag scroll; touch uses native overflow scroll.
      let startX = 0, startLeft = 0, dragging = false;
      viewport.addEventListener('pointerdown', e => {
        if (e.pointerType === 'touch') return;
        dragging = true; startX = e.clientX; startLeft = viewport.scrollLeft;
        viewport.setPointerCapture(e.pointerId);
        viewport.classList.add('dragging');
      });
      viewport.addEventListener('pointermove', e => {if(dragging) viewport.scrollLeft = startLeft - (e.clientX-startX);});
      const stop = () => {dragging = false; viewport.classList.remove('dragging');};
      viewport.addEventListener('pointerup', stop);
      viewport.addEventListener('pointercancel', stop);
      update();
    });
  }

  function render() {
    const spread = content[state.index];
    pages.innerHTML = renderSide(spread.left, 'left', spread.chapter, state.index * 2 + 1) + renderSide(spread.right, 'right', spread.chapter, state.index * 2 + 2);
    setupPanoramas();
    $('pageIndicator').textContent = state.opened ? `${state.index * 2 + 1} — ${state.index * 2 + 2} / ${content.length * 2}` : '';
    prev.disabled = !state.opened || state.index === 0 || state.busy;
    next.disabled = !state.ready || state.busy || (state.opened && state.index === content.length - 1);
    next.querySelector('span').textContent = state.opened ? '下一頁' : '打開書本';
    Array.from(nav.children).forEach((b, i) => {
      b.classList.toggle('active', state.opened && state.index === i);
      b.disabled = !state.opened || state.busy;
    });
  }

  function buildNav() {
    nav.innerHTML = '';
    content.forEach((spread, i) => {
      const button = document.createElement('button');
      button.className = 'nav-item';
      button.textContent = spread.menu;
      button.addEventListener('click', () => jumpTo(i));
      nav.appendChild(button);
    });
  }

  async function openBook() {
    if (!state.ready || state.busy || state.opened) return;
    state.busy = true;
    cover.classList.add('hidden');
    book.classList.add('open');
    await wait(850);
    state.opened = true;
    state.busy = false;
    $('hint').hidden = false;
    $('hint').textContent = '點擊箭頭翻頁，或使用上方選單快速跳到章節';
    render();
  }

  async function flipTo(index) {
    if (state.busy || !state.opened || index < 0 || index >= content.length || index === state.index) return;
    state.busy = true;
    render();
    const sheet = $('turnSheet');
    sheet.classList.remove('flip');
    void sheet.offsetWidth;
    sheet.style.transformOrigin = index > state.index ? 'left center' : 'right center';
    sheet.classList.add('flip');
    await wait(360);
    state.index = index;
    render();
    await wait(440);
    sheet.classList.remove('flip');
    state.busy = false;
    render();
  }

  async function jumpTo(index) {
    $('navLinks').classList.remove('show');
    $('menuToggle').setAttribute('aria-expanded', 'false');
    if (state.opened) await flipTo(index);
  }

  async function start() {
    if (state.started) return;
    state.started = true;
    $('startScreen').classList.add('hidden');
    $('world').classList.add('growing');
    await wait(2650);
    $('world').classList.add('finished');
    $('topNav').classList.add('visible');
    await wait(650);
    $('storyStage').classList.add('visible');
    await wait(600);
    // 開場書頁倒帶／翻回封面的示意動畫：封面短暫前後翻轉。
    cover.classList.add('rewind');
    await wait(1550);
    cover.classList.remove('rewind');
    state.ready = true;
    render();
  }

  $('startButton').addEventListener('click', start);
  cover.addEventListener('click', openBook);
  next.addEventListener('click', () => state.opened ? flipTo(state.index + 1) : openBook());
  prev.addEventListener('click', () => flipTo(state.index - 1));
  $('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    if (!state.ready || state.busy) return;
    state.opened = false;
    state.index = 0;
    cover.classList.remove('hidden');
    book.classList.remove('open');
    $('hint').hidden = true;
    render();
  });
  $('menuToggle').addEventListener('click', () => {
    const showing = nav.classList.toggle('show');
    $('menuToggle').setAttribute('aria-expanded', String(showing));
  });
  document.addEventListener('keydown', (e) => {
    if (!state.ready) return;
    if (e.target.closest?.('.panorama-viewport')) return;
    if (e.key === 'ArrowRight') state.opened ? flipTo(state.index + 1) : openBook();
    if (e.key === 'ArrowLeft') flipTo(state.index - 1);
  });
  // 手機輕掃翻頁：觸控開始與結束的水平距離大於 55px 時切換。
  let touchX = null;
  const shell = $('bookShell');
  shell.addEventListener('touchstart', e => { touchX = e.target.closest('.panorama-page') ? null : e.changedTouches[0].clientX; }, {passive:true});
  shell.addEventListener('touchend', e => {
    if (touchX === null || !state.opened) return;
    const delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 55) flipTo(state.index + (delta < 0 ? 1 : -1));
    touchX = null;
  }, {passive:true});

  buildNav();
  render();
})();
