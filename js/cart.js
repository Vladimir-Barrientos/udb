const contenedorTarjetas = document.getElementById("cart-container");
const cantidadElement = document.getElementById("cantidad");
const precioElement = document.getElementById("precio");
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesContainer = document.getElementById("totales");
const btnComprar = document.getElementById("btn-comprar");
const facturaSection = document.getElementById("factura-section");
const facturaContainer = document.getElementById("factura-container");
const btnSeguir = document.getElementById("btn-seguir");
const btnImprimir = document.getElementById("btn-imprimir");

/** Crea las tarjetas de productos teniendo en cuenta lo guardado en localstorage */
function crearTarjetasProductosCarrito() {
  contenedorTarjetas.innerHTML = "";
  const productos = JSON.parse(localStorage.getItem(keyLocalstorage));

  if (productos && productos.length > 0) {
    productos.forEach((producto) => {
      const nuevaBicicleta = document.createElement("div");
      nuevaBicicleta.classList = "tarjeta-producto";

      const subtotalProducto = producto.precio * producto.cantidad;
      const disponibleParaAgregar = getStockDisponibleParaAgregar(producto.id); // stock - enCarrito

      nuevaBicicleta.innerHTML = `
        <img src="./img/productos/${producto.id}.jpg" alt="${producto.nombre}">
        <div class="info">
          <h3>${producto.nombre}</h3>
          <p>Precio unit.: <strong>$${producto.precio}</strong></p>
          <p>Subtotal: <strong>$${subtotalProducto}</strong></p>
          <p class="stock-mini">Stock disponible para agregar: <strong>${Math.max(0, disponibleParaAgregar)}</strong></p>
        </div>

        <div class="controles">
          <button class="btn-menos">-</button>
          <span class="cantidad">${producto.cantidad}</span>
          <button class="btn-mas">+</button>
        </div>
      `;

      contenedorTarjetas.appendChild(nuevaBicicleta);

      // -
      nuevaBicicleta.getElementsByClassName("btn-menos")[0].addEventListener("click", () => {
        restarAlCarrito(producto);
        crearTarjetasProductosCarrito();
        actualizarTotales();
      });

      // +
      nuevaBicicleta.getElementsByClassName("btn-mas")[0].addEventListener("click", () => {
        agregarAlCarrito(producto, 1); // validado por stock
        crearTarjetasProductosCarrito();
        actualizarTotales();
      });
    });
  }

  revisarMensajeVacio();
  actualizarTotales();
  actualizarNumeroCarrito();
  actualizarEstadoBotonComprar();
}

initInventario();
crearTarjetasProductosCarrito();

/** Actualiza el total de precio y unidades de la página del carrito */
function actualizarTotales() {
  const productos = JSON.parse(localStorage.getItem(keyLocalstorage));
  let cantidad = 0;
  let precio = 0;

  if (productos && productos.length > 0) {
    productos.forEach((producto) => {
      cantidad += producto.cantidad;
      precio += producto.precio * producto.cantidad;
    });
  }

  cantidadElement.innerText = cantidad;
  precioElement.innerText = precio.toFixed(2);

  if (precio === 0) {
    reiniciarCarrito();
    revisarMensajeVacio();
  }
}

document.getElementById("reiniciar").addEventListener("click", () => {
  contenedorTarjetas.innerHTML = "";
  reiniciarCarrito();
  revisarMensajeVacio();
  ocultarFactura();
});

/** Muestra o esconde el mensaje de que no hay nada en el carrito */
function revisarMensajeVacio() {
  const productos = JSON.parse(localStorage.getItem(keyLocalstorage));
  carritoVacioElement.classList.toggle("escondido", productos && productos.length > 0);
  totalesContainer.classList.toggle("escondido", !productos || productos.length === 0);
}

/** Habilita/Deshabilita botón comprar según si hay productos */
function actualizarEstadoBotonComprar() {
  const productos = JSON.parse(localStorage.getItem(keyLocalstorage));
  const hay = productos && productos.length > 0;
  btnComprar.disabled = !hay;
}

/** Muestra la factura */
function mostrarFactura(factura) {
  renderFactura(factura, facturaContainer);
  facturaSection.classList.remove("escondido");
}

/** Oculta factura */
function ocultarFactura() {
  facturaSection.classList.add("escondido");
  facturaContainer.innerHTML = "";
}

/** Confirmar compra: generar factura, descontar inventario y vaciar carrito */
btnComprar.addEventListener("click", () => {
  const productos = JSON.parse(localStorage.getItem(keyLocalstorage)) || [];
  if (productos.length === 0) return;

  // Generar factura
  const factura = crearFacturaDesdeCarrito(productos);
  mostrarFactura(factura);

  // Descontar inventario y reiniciar carrito
  descontarStockPorCompra(productos);
  reiniciarCarrito();
  crearTarjetasProductosCarrito();
  actualizarTotales();
  actualizarNumeroCarrito();
});

/** Seguir comprando */
btnSeguir.addEventListener("click", () => {
  window.location.href = "./index.html";
});

/** Imprimir factura */
btnImprimir.addEventListener("click", () => {
  window.print();
});