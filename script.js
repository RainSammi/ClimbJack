(() => {
  const $ = (id) => document.getElementById(id);
  const content = window.BOOK_CONTENT;
  const state = { started: false, ready: false, opened: false, index: 0, mobileSide: 0, busy: false };
  const isMobile = () => window.matchMedia('(max-width: 700px)').matches;
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
    if (data.type === 'gallery') {
      const images = data.images || [];
      const label = (data.labels && data.labels[0]) || '';
      inner += `<div class="artwork gallery-artwork${data.pixel ? ' gallery-pixel' : ''}" data-gallery="true" tabindex="0" aria-label="${attr(data.title)}，可左右切換圖片">
        ${images.map((src, i) => `<img class="gallery-image${i === 0 ? ' is-active' : ''}" src="${attr(src)}" alt="${attr(data.title)} 第 ${i+1} 張" draggable="false" loading="lazy" onerror="this.classList.add('gallery-missing')">`).join('')}
        <span class="art-tag">${escapeHTML(data.tag || '')}</span>
        <button class="gallery-arrow gallery-prev" type="button" aria-label="上一張圖片">‹</button>
        <button class="gallery-arrow gallery-next" type="button" aria-label="下一張圖片">›</button>
        <span class="gallery-counter" aria-live="polite">1 / ${images.length}${label ? ` · ${escapeHTML(label)}` : ''}</span>
      </div><h2 class="art-title">${escapeHTML(data.title)}</h2><p class="caption">${escapeHTML(data.caption)}</p>`;
    } else if (data.type === 'image') {
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

  function setupGalleries() {
    const spread = content[state.index];
    pages.querySelectorAll('[data-gallery]').forEach(box => {
      const imgs = [...box.querySelectorAll('.gallery-image')];
      const data = box.closest('.page').classList.contains('left') ? spread.left : spread.right;
      const labels = data.labels || [];
      const counter = box.querySelector('.gallery-counter');
      let current = 0;
      const show = (n) => {
        current = (n + imgs.length) % imgs.length;
        imgs.forEach((img, i) => img.classList.toggle('is-active', i === current));
        counter.textContent = `${current + 1} / ${imgs.length}${labels[current] ? ' · ' + labels[current] : ''}`;
      };
      box.querySelector('.gallery-prev').addEventListener('click', e => {e.stopPropagation(); show(current - 1);});
      box.querySelector('.gallery-next').addEventListener('click', e => {e.stopPropagation(); show(current + 1);});
      box.addEventListener('keydown', e => { if (['ArrowLeft','ArrowRight'].includes(e.key)) {e.preventDefault();e.stopPropagation();show(current + (e.key === 'ArrowRight' ? 1 : -1));} });
      let downX = null;
      box.addEventListener('touchstart', e => {downX = e.changedTouches[0].clientX;}, {passive:true});
      box.addEventListener('touchend', e => {if(downX !== null) {const diff=e.changedTouches[0].clientX-downX;if(Math.abs(diff)>35) show(current+(diff<0?1:-1));downX=null;}}, {passive:true});
      // 桌面拖曳也能換圖，點擊控制按鈕不受影響。
      let dragX = null;
      box.addEventListener('pointerdown', e => {if(e.pointerType === 'mouse' && !e.target.closest('button')) dragX=e.clientX;});
      box.addEventListener('pointerup', e => {if(dragX !== null) {const diff=e.clientX-dragX;if(Math.abs(diff)>45) show(current+(diff<0?1:-1));dragX=null;} });
    });
  }

  function render() {
    const spread = content[state.index];
    pages.innerHTML = renderSide(spread.left, 'left', spread.chapter, state.index * 2 + 1) + renderSide(spread.right, 'right', spread.chapter, state.index * 2 + 2);
    if (isMobile()) {
      const hiddenSide = state.mobileSide === 0 ? '.page.right' : '.page.left';
      pages.querySelector(hiddenSide)?.classList.add('mobile-hidden');
    }
    setupPanoramas();
    setupGalleries();
    const mobile = isMobile();
    const pageNum = state.index * 2 + state.mobileSide + 1;
    $('pageIndicator').textContent = state.opened ? (mobile ? `${pageNum} / ${content.length * 2}` : `${state.index * 2 + 1} — ${state.index * 2 + 2} / ${content.length * 2}`) : '';
    prev.disabled = !state.opened || state.busy || (mobile ? pageNum === 1 : state.index === 0);
    next.disabled = !state.ready || state.busy || (state.opened && (mobile ? pageNum === content.length * 2 : state.index === content.length - 1));
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
    state.mobileSide = 0;
    state.busy = false;
    $('hint').hidden = false;
    $('hint').textContent = '點擊箭頭翻頁，或使用上方選單快速跳到章節';
    render();
  }

  async function flipTo(index, side = 0) {
    if (state.busy || !state.opened || index < 0 || index >= content.length || (index === state.index && (!isMobile() || side === state.mobileSide))) return;
    state.busy = true;
    render();
    const sheet = $('turnSheet');
    sheet.classList.remove('flip');
    void sheet.offsetWidth;
    const forwards = index > state.index || (index === state.index && side > state.mobileSide);
    sheet.style.transformOrigin = forwards ? 'left center' : 'right center';
    sheet.classList.add('flip');
    await wait(360);
    state.index = index;
    state.mobileSide = side;
    render();
    await wait(440);
    sheet.classList.remove('flip');
    state.busy = false;
    render();
  }

  async function jumpTo(index) {
    $('navLinks').classList.remove('show');
    $('menuToggle').setAttribute('aria-expanded', 'false');
    if (state.opened) await flipTo(index, 0);
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
    // 封面閱讀提示：只做輕微浮動與提亮，不掀頁、不顯示尚未開啟的內頁。
    cover.classList.add('rewind');
    await wait(1550);
    cover.classList.remove('rewind');
    state.ready = true;
    render();
  }

  function turnPage(direction) {
    if (!state.opened) return;
    if (!isMobile()) return flipTo(state.index + direction);
    const absolute = state.index * 2 + state.mobileSide + direction;
    if (absolute < 0 || absolute >= content.length * 2) return;
    return flipTo(Math.floor(absolute / 2), absolute % 2);
  }

  $('startButton').addEventListener('click', start);
  cover.addEventListener('click', openBook);
  next.addEventListener('click', () => state.opened ? turnPage(1) : openBook());
  prev.addEventListener('click', () => turnPage(-1));
  $('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    if (!state.ready || state.busy) return;
    state.opened = false;
    state.index = 0;
    state.mobileSide = 0;
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
    if (e.target.closest?.('.panorama-viewport, [data-gallery]')) return;
    if (e.key === 'ArrowRight') state.opened ? turnPage(1) : openBook();
    if (e.key === 'ArrowLeft') turnPage(-1);
  });
  // 手機輕掃翻頁：觸控開始與結束的水平距離大於 55px 時切換。
  let touchX = null;
  const shell = $('bookShell');
  shell.addEventListener('touchstart', e => { touchX = e.target.closest('.panorama-page, [data-gallery]') ? null : e.changedTouches[0].clientX; }, {passive:true});
  shell.addEventListener('touchend', e => {
    if (touchX === null || !state.opened) return;
    const delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 55) turnPage(delta < 0 ? 1 : -1);
    touchX = null;
  }, {passive:true});

  window.matchMedia('(max-width: 700px)').addEventListener('change', () => {state.mobileSide = 0; render();});
  buildNav();
  render();
})();
