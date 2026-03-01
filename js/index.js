const contenedorTarjetas = document.getElementById("productos-container");

/** Crea las tarjetas de productos teniendo en cuenta el inventario */
function crearTarjetasProductosInicio() {
  contenedorTarjetas.innerHTML = "";
  const productosInventario = obtenerInventario();

  productosInventario.forEach((producto) => {
    const enCarrito = getCantidadEnCarrito(producto.id);
    const disponible = Math.max(0, producto.stock - enCarrito);

    const nuevaBicicleta = document.createElement("div");
    nuevaBicicleta.classList = "tarjeta-producto";
    nuevaBicicleta.innerHTML = `
      <img src="./img/productos/${producto.id}.jpg" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p class="precio">$${producto.precio}</p>
      <p class="stock">Disponible: <strong><span class="stock-num">${disponible}</span></strong></p>

      <div class="acciones">
        <label class="qty-label">Cantidad:</label>
        <input class="qty" type="number" min="1" step="1" value="1" />
        <button class="btn-agregar">Agregar al carrito</button>
      </div>
    `;

    contenedorTarjetas.appendChild(nuevaBicicleta);

    const inputQty = nuevaBicicleta.getElementsByClassName("qty")[0];
    const btn = nuevaBicicleta.getElementsByClassName("btn-agregar")[0];

    btn.addEventListener("click", () => {
      const qty = parseInt(inputQty.value, 10);
      agregarAlCarrito(producto, qty);
      // Re-render para actualizar disponible
      crearTarjetasProductosInicio();
    });
  });
}

initInventario();
crearTarjetasProductosInicio();