import './index.css'

const state = {
  items: [],
  query: '',
  category: 'Sve',
  selectedId: null,
  loading: true,
  error: '',
}

const app = document.querySelector('#app')

const icon = (name) => {
  const icons = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 5 5"></path></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"></path></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>',
  }
  return icons[name] || ''
}

const money = (value) => `${Number(value).toFixed(2).replace('.', ',')} €`

const getFilteredItems = () => {
  const query = state.query.trim().toLocaleLowerCase('hr')
  return state.items.filter((item) => {
    const matchesCategory = state.category === 'Sve' || item.category === state.category
    const matchesQuery = !query || item.name.toLocaleLowerCase('hr').includes(query)
    return matchesCategory && matchesQuery
  })
}

const itemCard = (item, index) => `
  <button class="item-card ${item.id === state.selectedId ? 'is-selected' : ''} fade-up" style="animation-delay: ${index * 60}ms" data-select="${item.id}" type="button">
    <div class="item-image-wrap">
      <img src="${item.image}" alt="${item.name}" class="item-image" loading="lazy">
      <span class="item-category">${item.category}</span>
    </div>
    <div class="item-card-body">
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-display item-name">${item.name}</h3>
        <span class="item-price">${money(item.price)}</span>
      </div>
      <p class="item-description">${item.description}</p>
      <div class="item-meta"><span>${item.weight} g</span><span>${item.stock} kom.</span><span class="item-link">Detalji ${icon('arrow')}</span></div>
    </div>
  </button>`

const detailPanel = (item) => item ? `
  <div class="detail-panel grain fade-up">
    <div class="detail-heading">
      <div><p class="eyebrow">Odabrano za vas</p><h2 class="font-display detail-title">${item.name}</h2></div>
      <button class="close-button" data-close type="button" aria-label="Zatvori detalje">${icon('close')}</button>
    </div>
    <img class="detail-image" src="${item.image}" alt="${item.name}">
    <p class="detail-description">${item.longDescription}</p>
    <div class="detail-facts">
      <div><span>Cijena</span><strong>${money(item.price)}</strong></div>
      <div><span>Težina</span><strong>${item.weight} g</strong></div>
      <div><span>Dostupno</span><strong>${item.stock} kom.</strong></div>
    </div>
    <div class="detail-note"><span class="status-dot"></span> Svježe pečeno svakog jutra</div>
  </div>` : ''

const render = () => {
  const filteredItems = getFilteredItems()
  const categories = ['Sve', ...new Set(state.items.map((item) => item.category))]
  const selectedItem = filteredItems.find((item) => item.id === state.selectedId) || filteredItems[0]

  if (state.loading) {
    app.innerHTML = `<main class="loading-screen"><div class="loader"></div><p>Učitavamo današnje slastice...</p></main>`
    return
  }

  app.innerHTML = `
    <div class="site-shell">
      <header class="site-header">
        <nav class="topbar wrap">
          <a class="brand" href="/" aria-label="Bokun Pašticerije početna"><span class="brand-mark">B</span><span><strong>Bokun</strong><small>Pašticerije</small></span></a>
          <div class="address"><span class="status-dot"></span><span>Ulica Slatkih snova 12</span></div>
          <a class="nav-link" href="#ponuda">Istraži ponudu ${icon('arrow')}</a>
        </nav>
        <div class="hero wrap">
          <div class="hero-copy"><p class="eyebrow">Mala radionica velikih užitaka</p><h1 class="font-display">Nešto slatko,<br><em>baš po tvom ukusu.</em></h1><p class="hero-text">Ručno rađene torte, kolači i peciva iz srca Bokuna. Bez žurbe, s najboljim sastojcima.</p><a class="hero-button" href="#ponuda">Pogledaj ponudu ${icon('arrow')}</a></div>
          <div class="hero-art" aria-label="Ilustracija kolača"><div class="sun"></div><div class="cake cake-back"></div><div class="cake cake-front"><span></span><i></i><b></b></div><div class="art-caption">Danas iz pećnice<br><strong>08:00 — 18:00</strong></div></div>
        </div>
      </header>
      <main id="ponuda" class="wrap content">
        <div class="section-intro"><div><p class="eyebrow">Naša vitrina</p><h2 class="font-display section-title">Slastice za svaki <em>trenutak.</em></h2></div><p class="section-count">${filteredItems.length} od ${state.items.length} slastica</p></div>
        <div class="toolbar"><label class="search-field">${icon('search')}<span class="sr-only">Pretraži po nazivu</span><input id="search" type="search" value="${state.query}" placeholder="Pretraži po nazivu..." autocomplete="off"></label><div class="filters" role="group" aria-label="Filtriraj po kategoriji">${categories.map((category) => `<button class="filter-button ${category === state.category ? 'is-active' : ''}" data-category="${category}" type="button">${category}</button>`).join('')}</div></div>
        ${state.error ? `<div class="error-state"><strong>Vitrina se nije učitala.</strong><span>${state.error}</span><button data-retry type="button">Pokušaj ponovo</button></div>` : ''}
        ${!state.error && !filteredItems.length ? `<div class="empty-state"><div class="empty-mark">✦</div><h2 class="font-display">Nema takvih slastica.</h2><p>Pokušaj s drugim nazivom ili odaberi drugu kategoriju.</p><button data-reset type="button">Prikaži sve</button></div>` : ''}
        ${!state.error && filteredItems.length ? `<div class="catalog-layout"><section class="items-grid" aria-label="Ponuda slastica">${filteredItems.map(itemCard).join('')}</section>${detailPanel(selectedItem)}</div>` : ''}
      </main>
      <footer class="footer wrap"><span>Bokun Pašticerije</span><span>Vlasnica: Lara Stahović</span><span>Ulica Slatkih snova 12 · Zagreb</span></footer>
    </div>`

  bindEvents()
}

const loadItems = async () => {
  state.loading = true
  state.error = ''
  render()
  try {
    const response = await fetch('/data/items.json')
    if (!response.ok) throw new Error(`Greška poslužitelja (${response.status}).`)
    const data = await response.json()
    if (!Array.isArray(data) || !data.length) throw new Error('JSON datoteka nema valjane podatke.')
    state.items = data
    state.selectedId = data[0].id
  } catch (error) {
    state.items = []
    state.error = error instanceof Error ? error.message : 'Podaci trenutno nisu dostupni.'
  } finally {
    state.loading = false
    render()
  }
}

const bindEvents = () => {
  document.querySelector('#search')?.addEventListener('input', (event) => {
    state.query = event.target.value
    render()
    const input = document.querySelector('#search')
    input?.focus()
    input?.setSelectionRange(state.query.length, state.query.length)
  })
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => {
    state.category = button.dataset.category
    render()
  }))
  document.querySelectorAll('[data-select]').forEach((button) => button.addEventListener('click', () => {
    state.selectedId = button.dataset.select
    render()
  }))
  document.querySelector('[data-close]')?.addEventListener('click', () => {
    state.selectedId = null
    render()
  })
  document.querySelector('[data-reset]')?.addEventListener('click', () => {
    state.query = ''
    state.category = 'Sve'
    render()
  })
  document.querySelector('[data-retry]')?.addEventListener('click', loadItems)
}

render()
loadItems()
