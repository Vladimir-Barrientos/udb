/**
 * Servicio de Facturación
 * Genera un objeto factura y lo renderiza en pantalla.
 */

const IVA_PORCENTAJE = 0.13;

function generarNumeroFactura() {
  // Correlativo simple: usa timestamp + aleatorio
  const ahora = Date.now();
  const rnd = Math.floor(Math.random() * 900 + 100);
  return `F-${ahora}-${rnd}`;
}

function formatearDinero(valor) {
  return Number(valor).toFixed(2);
}

/** Crea un objeto factura a partir del carrito */
function crearFacturaDesdeCarrito(itemsCarrito) {
  const numero = generarNumeroFactura();
  const fecha = new Date();

  const detalles = itemsCarrito.map((p) => {
    const total = p.precio * p.cantidad;
    return {
      id: p.id,
      nombre: p.nombre,
      cantidad: p.cantidad,
      precioUnitario: p.precio,
      total,
    };
  });

  const subtotal = detalles.reduce((acc, d) => acc + d.total, 0);
  const iva = subtotal * IVA_PORCENTAJE;
  const totalGeneral = subtotal + iva;

  return { numero, fecha: fecha.toISOString(), detalles, subtotal, iva, totalGeneral };
}

/** Renderiza la factura en el contenedor indicado */
function renderFactura(factura, container) {
  const fecha = new Date(factura.fecha);

  const filas = factura.detalles
    .map(
      (d) => `
      <tr>
        <td>${d.nombre}</td>
        <td style="text-align:center">${d.cantidad}</td>
        <td style="text-align:right">$${formatearDinero(d.precioUnitario)}</td>
        <td style="text-align:right">$${formatearDinero(d.total)}</td>
      </tr>`
    )
    .join("");

  container.innerHTML = `
    <div class="factura-card">
      <div class="factura-header">
        <h2>Factura</h2>
        <div>
          <p><strong>Número:</strong> ${factura.numero}</p>
          <p><strong>Fecha:</strong> ${fecha.toLocaleString()}</p>
        </div>
      </div>

      <table class="factura-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
      </table>

      <div class="factura-totales">
        <p>Subtotal: <strong>$${formatearDinero(factura.subtotal)}</strong></p>
        <p>IVA (13%): <strong>$${formatearDinero(factura.iva)}</strong></p>
        <p class="factura-total-final">Total: <strong>$${formatearDinero(factura.totalGeneral)}</strong></p>
      </div>
    </div>
  `;
}