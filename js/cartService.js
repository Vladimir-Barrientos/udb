const cuentaCarritoElement = document.getElementById("cuenta-carrito");
const keyLocalstorage = "bicicletas";

/** Utilidad: verifica entero positivo */
function esEnteroPositivo(n) {
  return Number.isInteger(n) && n > 0;
}

/** Devuelve cantidad actual de un producto en carrito */
function getCantidadEnCarrito(id) {
  const memoria = JSON.parse(localStorage.getItem(keyLocalstorage)) || [];
  const item = memoria.find((p) => p.id === id);
  return item ? item.cantidad : 0;
}

/** Devuelve stock disponible real (stock - cantidad en carrito) */
function getStockDisponibleParaAgregar(id) {
  const prodInv = obtenerProductoInventario(id);
  const stock = prodInv ? prodInv.stock : 0;
  const enCarrito = getCantidadEnCarrito(id);
  return stock - enCarrito;
}

/** Toma un objeto producto o un objeto con al menos un ID y lo agrega al carrito.
 * @param {*} producto
 * @param {number} cantidadAAgregar
 */
function agregarAlCarrito(producto, cantidadAAgregar = 1) {
  initInventario(); // asegura inventario
  const qty = parseInt(cantidadAAgregar, 10);

  if (!esEnteroPositivo(qty)) {
    alert("Cantidad inválida. Ingresa un número entero mayor que 0.");
    return getCantidadEnCarrito(producto.id);
  }

  const disponible = getStockDisponibleParaAgregar(producto.id);
  if (qty > disponible) {
    alert(`No hay suficiente stock. Disponible para agregar: ${Math.max(0, disponible)}.`);
    return getCantidadEnCarrito(producto.id);
  }

  let memoria = JSON.parse(localStorage.getItem(keyLocalstorage)) || [];
  const indiceProducto = memoria.findIndex((p) => p.id === producto.id);

  if (indiceProducto === -1) {
    const nuevoProducto = getNuevoProductoParaMemoria(producto, qty);
    memoria.push(nuevoProducto);
  } else {
    memoria[indiceProducto].cantidad += qty;
  }

  localStorage.setItem(keyLocalstorage, JSON.stringify(memoria));
  actualizarNumeroCarrito();
  return getCantidadEnCarrito(producto.id);
}

/** Resta una unidad de un producto del carrito */
function restarAlCarrito(producto) {
  let memoria = JSON.parse(localStorage.getItem(keyLocalstorage));
  if (!memoria) return console.warn("Error restando al carrito: Carrito no encontrado en memoria");

  const indiceProducto = memoria.findIndex((p) => p.id === producto.id);
  if (indiceProducto === -1) return 0;

  memoria[indiceProducto].cantidad--;
  const cantidadProductoFinal = memoria[indiceProducto].cantidad;

  if (cantidadProductoFinal === 0) {
    memoria.splice(indiceProducto, 1);
  }

  localStorage.setItem(keyLocalstorage, JSON.stringify(memoria));
  actualizarNumeroCarrito();
  return cantidadProductoFinal;
}

/** Agrega cantidad a un objeto producto (copia segura) */
function getNuevoProductoParaMemoria(producto, cantidad = 1) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    cantidad: cantidad,
  };
}

/** Actualiza el número del carrito del header */
function actualizarNumeroCarrito() {
  let cuenta = 0;
  const memoria = JSON.parse(localStorage.getItem(keyLocalstorage));
  if (memoria && memoria.length > 0) {
    cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);
    cuentaCarritoElement.innerText = cuenta;
    return cuenta;
  }
  cuentaCarritoElement.innerText = 0;
  return 0;
}

/** Reinicia el carrito */
function reiniciarCarrito() {
  localStorage.removeItem(keyLocalstorage);
  actualizarNumeroCarrito();
}

actualizarNumeroCarrito();