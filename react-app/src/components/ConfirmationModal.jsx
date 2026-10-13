export default function ConfirmationModal({ order, formatCurrency, onClose }) {
  if (!order) return null

  const rows = [
    ['Cliente', order.nombre],
    ['Envío a', `${order.direccion}, ${order.ciudad}`],
    ['Método de pago', order.metodoPago],
    ['Unidades', order.quantity],
    ['Subtotal', formatCurrency(order.subtotal)],
    ['Impuestos', formatCurrency(order.tax)],
  ]

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__contenido modal__contenido--angosto" onClick={(event) => event.stopPropagation()}>
        <div className="confirmacion__icono">✓</div>
        <h2 className="modal__titulo">¡Pedido confirmado!</h2>
        <p className="confirmacion__numero">Número de orden: <strong>{order.number}</strong></p>
        <p className="modal__subtitulo">Enviamos el comprobante a tu correo. Guardá el número de orden para hacer seguimiento de tu envío.</p>
        <div className="confirmacion__detalle">
          {rows.map(([label, value]) => <div className="confirmacion__detalle-linea" key={label}><span>{label}</span><span>{value}</span></div>)}
          <div className="confirmacion__detalle-linea"><span>Total pagado</span><strong>{formatCurrency(order.total)}</strong></div>
        </div>
        <button type="button" className="boton-primario boton-primario--full" onClick={onClose}>Seguir comprando</button>
      </div>
    </div>
  )
}
