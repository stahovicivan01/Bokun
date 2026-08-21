import { useEffect, useMemo, useState } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orderCount, setOrderCount] = useState(0)

  async function loadItems() {
    setLoading(true)
    setError('')

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const response = await fetch('/data/items.json')

      if (!response.ok) {
        throw new Error(`Unable to load item data (${response.status}).`)
      }

      const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('The item data is not in the expected array format.')
        }

        const validItems = data.filter(
          (item) =>
            item &&
            typeof item === 'object' &&
            typeof item.name === 'string' &&
            typeof item.category === 'string' &&
            typeof item.description === 'string' &&
            typeof item.location === 'string',
        )

      if (!validItems.length) {
        throw new Error('No valid item records were found in the JSON file.')
      }

      setItems(validItems)
      setSelectedItemId(validItems[0].id)
    } catch (loadError) {
      setItems([])
      setSelectedItemId(null)
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Something went wrong while loading the items.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const runLoad = async () => {
      if (!isMounted) return
      await loadItems()
    }

    runLoad()

    return () => {
      isMounted = false
    }
  }, [])

  const categories = useMemo(
    () => ['All', ...new Set(items.map((item) => item.category))],
    [items],
  )

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory

      const matchesName =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))

      return matchesCategory && matchesName
    })
  }, [items, searchTerm, selectedCategory])

  useEffect(() => {
    if (!filteredItems.length) {
      setSelectedItemId(null)
      return
    }

    if (!filteredItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(filteredItems[0].id)
    }
  }, [filteredItems, selectedItemId])

  const selectedItem =
    filteredItems.find((item) => item.id === selectedItemId) ??
    items.find((item) => item.id === selectedItemId) ??
    null

  const featuredDish = filteredItems[0] ?? items[0] ?? null

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {error && (
        <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl border border-rose-500/40 bg-rose-950/90 p-4 text-sm text-rose-50 shadow-2xl shadow-rose-950/30 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">Menu unavailable</p>
              <p className="mt-1 text-rose-200">{error}</p>
            </div>
            <button
              type="button"
              onClick={loadItems}
              className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-rose-400"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <header className="border-b border-amber-500/20 bg-gradient-to-r from-[#1a120d] via-[#2f1d15] to-[#120d0b] text-white shadow-2xl shadow-[#000]/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                Menu
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Bokun</h1>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-200 backdrop-blur-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              Open now
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-[28px] border border-white/10 bg-[#1b1a1a]/60 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm md:grid-cols-[1.2fr_0.8fr] lg:p-5">
            <div className="flex flex-col justify-center rounded-[22px] bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_35%),linear-gradient(135deg,rgba(251,191,36,0.06),rgba(239,68,68,0.05))] p-5">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-200">
                Chef's special
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {featuredDish ? featuredDish.name : 'Fresh seasonal menu'}
              </h2>
              <p className="mt-3 max-w-xl text-sm text-slate-200 sm:text-base">
                {featuredDish
                  ? featuredDish.description
                  : 'Choose a dish from our curated menu and enjoy tonight’s finest flavors.'}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedItemId(featuredDish?.id ?? null)}
                  className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
                >
                  View details
                </button>
                <button
                  type="button"
                  onClick={() => setOrderCount((count) => count + 1)}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Add to order
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-[22px] bg-slate-950/40 p-3 text-white">
              <div className="rounded-2xl border border-amber-300/20 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Dishes</p>
                <p className="mt-3 text-3xl font-bold">{items.length}</p>
              </div>
              <div className="rounded-2xl border border-amber-300/20 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Open</p>
                <p className="mt-3 text-3xl font-bold">7:00</p>
              </div>
              <div className="rounded-2xl border border-amber-300/20 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Orders</p>
                <p className="mt-3 text-3xl font-bold">{orderCount}</p>
              </div>
              <div className="rounded-2xl border border-amber-300/20 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Live</p>
                <p className="mt-3 text-3xl font-bold">{filteredItems.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Search by menu item name</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by dish name"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 pr-11 text-base text-slate-100 shadow-lg shadow-black/20 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20"
              />
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16L21 21" strokeLinecap="round" />
              </svg>
            </label>

            <label className="block min-w-[180px]">
              <span className="sr-only">Filter by category</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-slate-100 shadow-lg shadow-black/20 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <span className="rounded-full bg-amber-500/10 px-3 py-1.5 text-amber-200 ring-1 ring-amber-400/20">
              {filteredItems.length} dishes
            </span>
            <span className="rounded-full bg-slate-800 px-3 py-1.5 text-slate-200 ring-1 ring-slate-700">
              {orderCount} in order
            </span>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => {
            const active = selectedCategory === category

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-200 ring-1 ring-slate-700 hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-3 text-slate-200">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-300" />
              <span className="text-lg font-medium">Loading menu…</span>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 px-6 py-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <p className="text-xl font-semibold text-slate-100">No matching dishes</p>
            <p className="mt-2 text-slate-400">
              Try another dish name or choose a different category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {filteredItems.map((item) => {
                const isActive = item.id === selectedItemId

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItemId(item.id)}
                    className={`overflow-hidden rounded-3xl border text-left shadow-[0_20px_40px_rgba(15,23,42,0.38)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_45px_rgba(15,23,42,0.45)] ${
                      isActive
                        ? 'border-amber-400 ring-4 ring-amber-500/20 bg-slate-900'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-36 w-full object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                            {item.category}
                          </p>
                          <h2 className="mt-1 text-lg font-semibold text-white">
                            {item.name}
                          </h2>
                        </div>
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-200 ring-1 ring-slate-700">
                          {item.stock} left
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-slate-300">
                        {item.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xl font-bold text-white">
                          ${Number(item.price).toFixed(2)}
                        </span>
                        <span className="text-sm text-slate-400">{item.location}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </section>

            <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_20px_40px_rgba(15,23,42,0.45)] sm:p-5">
              {selectedItem ? (
                <div>
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="h-52 w-full rounded-2xl object-cover"
                  />

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                        {selectedItem.category}
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-white">
                        {selectedItem.name}
                      </h2>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/20">
                      {selectedItem.stock} left
                    </span>
                  </div>

                  <p className="mt-4 text-slate-300">{selectedItem.description}</p>

                  <dl className="mt-5 space-y-3 text-sm text-slate-300">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
                      <dt className="font-medium text-slate-400">Location</dt>
                      <dd>{selectedItem.location}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2">
                      <dt className="font-medium text-slate-400">Price</dt>
                      <dd className="text-lg font-semibold text-white">
                        ${Number(selectedItem.price).toFixed(2)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderCount((count) => count + 1)}
                      className="flex-1 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
                    >
                      Add to order
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
                    >
                      Reserve
                    </button>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Tags
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedItem.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl bg-slate-800 text-center text-slate-400">
                  Select a dish to view details.
                </div>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
