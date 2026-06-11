 /* ── DADOS DO CARDÁPIO ──────────────────────────── */
  const items = [
    { id:1, imagem:'./src/img/img1.jpeg', name:'Escolhas de saladas', desc:'Saladas de diversas cores e gostos', price:0.0, category:'saladas', badge:'' },
    { id:2, imagem:'./src/img/img2.jpeg', name:'Doce caseiro especial', desc:'Pudim com cobertura de claras em neve e salpicos de chocolate', price:0.0, category:'sobremesas', badge:'novo' },
    { id:3, imagem:'./src/img/img3.jpeg', name:'Saladas exóticas', desc:'Cebola, alface, tomate', price:0.0, category:'saladas', badge:'' },
    { id:4, imagem:'./src/img/img4.jpeg', name:'Feijoada Tropeira', desc:'Caldo temperado com linguiça e couve. Vem com torradinhas.', price:0.0, category:'sopas', badge:'destaque' },
  ];

  let cart = {};
  let activeFilter = 'all';

  function renderMenu(filter) {
    const grid = document.getElementById('menuGrid');
    const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);
    grid.innerHTML = filtered.map(item => `
      <div class="menu-card reveal" data-id="${item.id}">
        <img class="menu-card-image" src="${item.imagem}" alt="${item.name}">
        <div class="menu-card-body">
          <div class="menu-card-name">
            ${item.name}
            ${item.badge ? `<span class="badge-new">${item.badge}</span>` : ''}
          </div>
          <p class="menu-card-desc">${item.desc}</p>
          <div class="menu-card-footer">
            <span class="menu-card-price">R$ ${item.price.toFixed(2).replace('.',',')}</span>
            <button class="add-btn" onclick="addToCart(${item.id})">+</button>
          </div>
        </div>
      </div>
    `).join('');
    observeReveal();
  }

  function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    updateCartBadge();
    const item = items.find(i => i.id === id);
    showToast(`✓ ${item.name} adicionado!`);
  }

  function updateCartBadge() {
    const total = Object.values(cart).reduce((a,b) => a+b, 0);
    const badge = document.getElementById('cart-count');
    if (total > 0) { badge.style.display = 'flex'; badge.textContent = total; }
    else { badge.style.display = 'none'; }
  }

  function openCart() {
    const total = Object.values(cart).reduce((a,b) => a+b, 0);
    if (total === 0) { showToast('Seu carrinho está vazio 🛒'); return; }
    const lines = Object.entries(cart).map(([id, qty]) => {
      const item = items.find(i => i.id == id);
      return `${qty}x ${item.name} (R$ ${(item.price*qty).toFixed(2).replace('.',',')})`;
    }).join('\n');
    const msg = `Olá! Quero fazer um pedido:\n\n${lines}\n\nTotal: R$ ${Object.entries(cart).reduce((s,[id,q]) => s + items.find(i=>i.id==id).price*q, 0).toFixed(2).replace('.',',')}`;
    window.open('https://wa.me/5551980449707?text=' + encodeURIComponent(msg), '_blank');
  }

  /* ── FILTERS ────────────────────────────────────── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderMenu(activeFilter);
    });
  });

  /* ── TOAST ──────────────────────────────────────── */
  let toastTimer;
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ── WHATSAPP FORM ──────────────────────────────── */
  function sendWhatsApp() {
    const name = document.getElementById('fname').value.trim();
    const phone = document.getElementById('fphone').value.trim();
    const subject = document.getElementById('fsubject').value;
    const msg = document.getElementById('fmessage').value.trim();
    if (!name) { showToast('Por favor, informe seu nome.'); return; }
    const text = `Olá! Sou ${name}${phone ? ', WhatsApp: '+phone : ''}.\nAssunto: ${subject}\n\n${msg || '(sem mensagem)'}`;
    window.open('https://wa.me/5549988044371?text=' + encodeURIComponent(text), '_blank');
  }

  /* ── NAVBAR SCROLL ──────────────────────────────── */
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  });

  /* ── HAMBURGER ──────────────────────────────────── */
  document.getElementById('hamburger').addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    const isOpen = links.style.display === 'flex';
    links.style.display = isOpen ? '' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '70px'; links.style.left = '0'; links.style.right = '0';
    links.style.background = 'rgba(13,10,7,.98)';
    links.style.padding = '20px 24px';
    links.style.borderBottom = '1px solid var(--border)';
    if (!isOpen) links.style.display = 'flex';
  });

  /* ── SCROLL REVEAL ──────────────────────────────── */
  function observeReveal() {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }

  /* ── INIT ───────────────────────────────────────── */
  renderMenu('all');
  observeReveal();