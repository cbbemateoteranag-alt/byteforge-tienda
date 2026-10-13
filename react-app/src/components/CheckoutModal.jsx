import { useState } from 'react'

const cardMethods = ['Tarjeta de crédito', 'Tarjeta de débito']
const initialForm = {
  nombre: '', correo: '', telefono: '', direccion: '', ciudad: '', codigoPostal: '',
  metodoPago: '', numeroTarjeta: '', vencimiento: '',
}

export default function CheckoutModal({ items, totals, formatCurrency, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [paymentChosen, setPaymentChosen] = useState(false)
  const requiresCard = cardMethods.includes(form.metodoPago)
  const showCardFields = !paymentChosen || requiresCard

  function updateField(event) {
    const { name, value } = event.target
    if (name === 'metodoPago') setPaymentChosen(true)
    setForm((current) => ({ ...current, [name]: value }))
  }

  function updateCardNumber(event) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 16)
    setForm((current) => ({ ...current, numeroTarjeta: digits.replace(/(.{4})/g, '$1 ').trim() }))
  }

  function updateExpiry(event) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 4)
    const value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
    setForm((current) => ({ ...current, vencimiento: value }))
  }

  function submit(event) {
    event.preventDefault()
    onSubmit(form)
    setForm(initialForm)
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__contenido" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="boton-cerrar modal__cerrar" onClick={onClose} aria-label="Cerrar formulario">✕</button>
        <h2 className="modal__titulo">Finalizar pedido</h2>
        <p className="modal__subtitulo">Completá tus datos para confirmar la compra. Esta pasarela de pago es simulada.</p>
        <form className="formulario" onSubmit={submit}>
          <fieldset className="formulario__grupo">
            <legend>Datos personales</legend>
            <div className="formulario__fila">
              <div className="campo"><label htmlFor="nombre-cliente">Nombre completo</label><input id="nombre-cliente" name="nombre" value={form.nombre} onChange={updateField} required placeholder="Ej: Marcelo Rojas" /></div>
              <div className="campo"><label htmlFor="correo-cliente">Correo electrónico</label><input id="correo-cliente" name="correo" type="email" value={form.correo} onChange={updateField} required placeholder="ejemplo@correo.com" /></div>
            </div>
            <div className="campo"><label htmlFor="telefono-cliente">Teléfono</label><input id="telefono-cliente" name="telefono" type="tel" value={form.telefono} onChange={updateField} required placeholder="+591 700 00000" /></div>
          </fieldset>
          <fieldset className="formulario__grupo">
            <legend>Dirección de envío</legend>
            <div className="campo"><label htmlFor="direccion-envio">Dirección</label><input id="direccion-envio" name="direccion" value={form.direccion} onChange={updateField} required placeholder="Calle, número, referencia" /></div>
            <div className="formulario__fila">
              <div className="campo"><label htmlFor="ciudad-envio">Ciudad</label><input id="ciudad-envio" name="ciudad" value={form.ciudad} onChange={updateField} required placeholder="Cochabamba" /></div>
              <div className="campo"><label htmlFor="codigo-postal">Código postal</label><input id="codigo-postal" name="codigoPostal" value={form.codigoPostal} onChange={updateField} required placeholder="0000" /></div>
            </div>
          </fieldset>
          <fieldset className="formulario__grupo">
            <legend>Método de pago</legend>
            <div className="campo">
              <label htmlFor="metodo-pago">Seleccioná una opción</label>
              <select id="metodo-pago" name="metodoPago" value={form.metodoPago} onChange={updateField} required>
                <option value="">Elegí un método</option>
                <option>Tarjeta de crédito</option><option>Tarjeta de débito</option>
                <option>Transferencia bancaria</option><option>Pago contra entrega</option>
              </select>
            </div>
            {showCardFields && <div className="formulario__fila">
              <div className="campo"><label htmlFor="numero-tarjeta">Número de tarjeta</label><input id="numero-tarjeta" name="numeroTarjeta" value={form.numeroTarjeta} onChange={updateCardNumber} required placeholder="0000 0000 0000 0000" maxLength={19} inputMode="numeric" /></div>
              <div className="campo campo--corto"><label htmlFor="vencimiento-tarjeta">Vencimiento</label><input id="vencimiento-tarjeta" name="vencimiento" value={form.vencimiento} onChange={updateExpiry} required placeholder="MM/AA" maxLength={5} inputMode="numeric" /></div>
            </div>}
          </fieldset>
          <div className="modal__resumen-pedido">
            <h3>Resumen del pedido</h3>
            {items.map(({ product, quantity }) => <div className="linea-resumen-pedido" key={product.id}><span>{quantity} × {product.nombre}</span><span>{formatCurrency(product.precio * quantity)}</span></div>)}
            <div className="linea-resumen-pedido"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
            <div className="linea-resumen-pedido"><span>Impuestos (16%)</span><span>{formatCurrency(totals.tax)}</span></div>
            <div className="linea-resumen-pedido linea-resumen-pedido--total"><span>Total</span><span>{formatCurrency(totals.total)}</span></div>
          </div>
          <button type="submit" className="boton-primario boton-primario--full">Confirmar pedido</button>
        </form>
      </div>
    </div>
  )
}

