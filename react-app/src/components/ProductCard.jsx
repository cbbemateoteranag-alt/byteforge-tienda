import { useState } from 'react'

export default function ProductCard({ product, formatCurrency, onAdd }) {
  const [added, setAdded] = useState(false)

  function addProduct() {
    onAdd(product)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 700)
  }

  return (
    <article className="tarjeta-producto">
      <div className="tarjeta-producto__imagen-cont">
        <img src={product.imagen} alt={product.nombre} loading="lazy" />
        <span className="tarjeta-producto__categoria">{product.categoria}</span>
      </div>
      <div className="tarjeta-producto__cuerpo">
        <h2 className="tarjeta-producto__nombre">{product.nombre}</h2>
        <p className="tarjeta-producto__tipo">{product.tipo}</p>
        <div className="especificaciones">
          {[
            ['PROCESADOR', product.procesador],
            ['RAM', product.ram],
            ['ALMACENAMIENTO', product.almacenamiento],
            ['GRÁFICOS', product.tarjetaGrafica],
          ].map(([label, value]) => (
            <div className="especificaciones__item" key={label}>
              <span className="especificaciones__etiqueta">{label}</span>
              <span className="especificaciones__valor">{value}</span>
            </div>
          ))}
        </div>
        <div className="tarjeta-producto__pie">
          <span className="tarjeta-producto__precio">{formatCurrency(product.precio)}</span>
          <button className="boton-agregar" type="button" onClick={addProduct} disabled={added}>
            {added ? 'Agregado ✓' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}
