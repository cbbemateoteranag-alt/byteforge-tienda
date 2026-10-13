import { useEffect, useMemo, useState } from 'react'
import CartDrawer from './components/CartDrawer.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'
import ConfirmationModal from './components/ConfirmationModal.jsx'
import ProductCard from './components/ProductCard.jsx'
import EscapeHandler from './components/EscapeHandler.jsx'
import SpaLink from './routing/SpaLink.jsx'
import { usePathname } from './routing/router.js'
import catalog from './data/products.js'

const categories = ['Todas', 'Gamer', 'Oficina', 'Trabajo Pesado']
const formatCurrency = (value) => `Bs ${value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const knownRoutes = ['/', '/catalogo']

function App() {
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [order, setOrder] = useState(null)

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    return catalog.filter((product) => {
      const matchesCategory = category === 'Todas' || product.categoria === category
      const searchable = [product.nombre, product.tipo, product.procesador, product.ram, product.almacenamiento, product.tarjetaGrafica].join(' ').toLowerCase()
      return matchesCategory && searchable.includes(term)
    })
  }, [category, search])

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.precio * item.quantity, 0)
    const tax = subtotal * 0.16
    return { subtotal, tax, total: subtotal + tax }
  }, [cart])
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const hasOverlay = cartOpen || checkoutOpen || order !== null
  const isNotFound = !knownRoutes.includes(pathname)
  const isCatalogRoute = pathname === '/catalogo'

  useEffect(() => {
    document.title = isNotFound ? 'Página no encontrada | ByteForge' : `${isCatalogRoute ? 'Catálogo' : 'Inicio'} | ByteForge`
  }, [isCatalogRoute, isNotFound])

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      return existing
        ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { product, quantity: 1 }]
    })
  }

  function changeQuantity(productId, quantity) {
    setCart((current) => quantity <= 0
      ? current.filter((item) => item.product.id !== productId)
      : current.map((item) => item.product.id === productId ? { ...item, quantity } : item))
  }

  function closeOverlays() {
    setCartOpen(false)
    setCheckoutOpen(false)
    setOrder(null)
  }

  function startCheckout() {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  function placeOrder(form) {
    const { subtotal, tax, total } = totals
    setOrder({ ...form, number: `BF-${Math.floor(100000 + Math.random() * 900000)}`, subtotal, tax, total, quantity: itemCount })
    setCart([])
    setCheckoutOpen(false)
  }

  return (
    <>
      <header className="encabezado">
        <div className="contenedor encabezado__interior">
          <SpaLink className="marca" to="/" aria-label="ByteForge, inicio"><span className="marca__icono">⌁</span><span className="marca__texto">Byte<strong>Forge</strong></span></SpaLink>
          <nav className="navegacion" aria-label="Navegación principal">
            <SpaLink className={!isCatalogRoute && !isNotFound ? 'navegacion__enlace navegacion__enlace--activo' : 'navegacion__enlace'} to="/" aria-current={!isCatalogRoute && !isNotFound ? 'page' : undefined}>Inicio</SpaLink>
            <SpaLink className={isCatalogRoute ? 'navegacion__enlace navegacion__enlace--activo' : 'navegacion__enlace'} to="/catalogo" aria-current={isCatalogRoute ? 'page' : undefined}>Catálogo</SpaLink>
          </nav>
          <div className="buscador"><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, procesador, GPU…" aria-label="Buscar productos" /><span className="buscador__icono">⌕</span></div>
          <button type="button" className="boton-carrito" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito de compras, ${itemCount} productos`}><span className="boton-carrito__icono">🛒</span><span className="boton-carrito__contador">{itemCount}</span></button>
        </div>
      </header>
      {isNotFound ? (
        <main className="pagina-no-encontrada">
          <p className="hero__eyebrow">ERROR 404</p>
          <h1 className="hero__titulo">No encontramos esta página.</h1>
          <p className="hero__descripcion">La dirección puede haber cambiado o no existir.</p>
          <SpaLink className="boton-primario enlace-inicio" to="/">Volver al inicio</SpaLink>
        </main>
      ) : (
        <>
          {isCatalogRoute ? (
            <section className="hero hero--catalogo">
              <div className="contenedor hero__interior">
                <p className="hero__eyebrow">CATÁLOGO BYTEFORGE</p>
                <h1 className="hero__titulo">Encuentra el equipo adecuado.</h1>
                <p className="hero__descripcion">Compara especificaciones y filtra los equipos disponibles.</p>
              </div>
            </section>
          ) : (
            <section className="hero">
              <div className="contenedor hero__interior">
                <p className="hero__eyebrow">Componentes reales. Precios sin vueltas.</p>
                <h1 className="hero__titulo">Arma tu próximo equipo<br />sin adivinar las especificaciones.</h1>
                <p className="hero__descripcion">Comparamos procesador, memoria, almacenamiento y tarjeta gráfica en cada tarjeta, para que decidas mirando datos, no fotos bonitas.</p>
                <div className="hero__stats">
                  <div className="hero__stat"><span className="hero__stat-num">{catalog.length}</span><span className="hero__stat-label">equipos en catálogo</span></div>
                  <div className="hero__stat"><span className="hero__stat-num">3</span><span className="hero__stat-label">categorías de uso</span></div>
                  <div className="hero__stat"><span className="hero__stat-num">24h</span><span className="hero__stat-label">despacho estimado</span></div>
                </div>
              </div>
            </section>
          )}
          <section className="contenedor barra-filtros" id="barra-filtros">
            <div className="filtros-categoria" aria-label="Filtrar por categoría">
              {categories.map((item) => <button type="button" key={item} className={`chip${category === item ? ' chip--activo' : ''}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <p className="filtros-resultado" aria-live="polite">{filteredProducts.length === catalog.length ? `Mostrando ${catalog.length} equipos` : `Mostrando ${filteredProducts.length} de ${catalog.length} equipos`}</p>
          </section>
          <main className="contenedor">
            {filteredProducts.length ? <section className="grilla-productos" aria-live="polite">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} formatCurrency={formatCurrency} onAdd={addToCart} />)}</section> : <p className="mensaje-sin-resultados">No encontramos equipos que coincidan con tu búsqueda. Probá con otro término o categoría.</p>}
          </main>
        </>
      )}
      <footer className="pie"><div className="contenedor pie__interior"><span>© 2026 ByteForge — Tienda de Computadoras. Proyecto de demostración.</span><span>Hecho con React.</span></div></footer>
      {hasOverlay && <button type="button" className="fondo-panel" aria-label="Cerrar paneles" onClick={closeOverlays} />}
      <CartDrawer items={cart} open={cartOpen} formatCurrency={formatCurrency} totals={totals} onClose={() => setCartOpen(false)} onChangeQuantity={changeQuantity} onRemove={(id) => setCart((current) => current.filter((item) => item.product.id !== id))} onCheckout={startCheckout} />
      {checkoutOpen && <CheckoutModal items={cart} totals={totals} formatCurrency={formatCurrency} onClose={() => setCheckoutOpen(false)} onSubmit={placeOrder} />}
      {order && <ConfirmationModal order={order} formatCurrency={formatCurrency} onClose={() => setOrder(null)} />}
      {hasOverlay && <EscapeHandler onEscape={closeOverlays} />}
    </>
  )
}

export default App

