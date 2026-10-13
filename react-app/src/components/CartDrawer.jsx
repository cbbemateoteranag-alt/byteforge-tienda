export default function CartDrawer({ items, open, formatCurrency, totals, onClose, onChangeQuantity, onRemove, onCheckout }) {
  const hasItems = items.length > 0

  return (
    <aside className={`panel-carrito${open ? ' panel-carrito--abierto' : ''}`} aria-label="Carrito de compras" aria-modal={open || undefined}>
      <div className="panel-carrito__encabezado">
        <h2>Tu carrito</h2>
        <button type="button" className="boton-cerrar" onClick={onClose} aria-label="Cerrar carrito">✕</button>
      </div>
      <div className="panel-carrito__lista">
        {items.map(({ product, quantity }) => (
          <div className="item-carrito" key={product.id}>
            <img src={product.imagen} alt={product.nombre} />
            <div>
              <p className="item-carrito__nombre">{product.nombre}</p>
              <span className="item-carrito__precio">{formatCurrency(product.precio)} c/u</span>
              <div className="item-carrito__controles">
                <button type="button" className="item-carrito__cantidad-btn" onClick={() => onChangeQuantity(product.id, quantity - 1)} aria-label={`Restar unidad de ${product.nombre}`}>−</button>
                <span className="item-carrito__cantidad-valor">{quantity}</span>
                <button type="button" className="item-carrito__cantidad-btn" onClick={() => onChangeQuantity(product.id, quantity + 1)} aria-label={`Sumar unidad de ${product.nombre}`}>+</button>
              </div>
            </div>
            <div className="item-carrito__acciones">
              <span className="item-carrito__subtotal">{formatCurrency(product.precio * quantity)}</span>
              <button type="button" className="item-carrito__eliminar" onClick={() => onRemove(product.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      {!hasItems ? (
        <p className="carrito-vacio">Tu carrito está vacío. Explorá el catálogo y agregá algún equipo.</p>
      ) : (
        <div className="panel-carrito__resumen">
          <div className="resumen-linea"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
          <div className="resumen-linea"><span>Impuestos (16%)</span><span>{formatCurrency(totals.tax)}</span></div>
          <div className="resumen-linea resumen-linea--total"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
          <button type="button" className="boton-primario boton-primario--full" onClick={onCheckout}>Proceder al pago</button>
        </div>
      )}
    </aside>
  )
}
