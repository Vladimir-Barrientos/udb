/**
 * Servicio de Inventario
 * - Inicializa inventario en LocalStorage si no existe
 * - Permite consultar y descontar stock luego de una compra
 */
const keyInventario = "inventario_bicicletas";

/** Inicializa inventario con base en la lista de bicicletas (bicicletas.js) */
function initInventario() {
  const inv = JSON.parse(localStorage.getItem(keyInventario));
  if (inv && Array.isArray(inv) && inv.length > 0) return;
  // Clonamos para no mutar el array original
  const inventarioInicial = bicicletas.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    stock: typeof p.stock === "number" ? p.stock : 0,
  }));
  localStorage.setItem(keyInventario, JSON.stringify(inventarioInicial));
}

/** Devuelve inventario actual */
function obtenerInventario() {
  initInventario();
  const inv = JSON.parse(localStorage.getItem(keyInventario)) || [];
  return inv;
}

/** Devuelve un producto del inventario por id */
function obtenerProductoInventario(id) {
  const inv = obtenerInventario();
  return inv.find((p) => p.id === id);
}

/** Actualiza el stock de un producto (stockNuevo >= 0) */
function setStock(id, stockNuevo) {
  const inv = obtenerInventario();
  const idx = inv.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  inv[idx].stock = Math.max(0, Number(stockNuevo) || 0);
  localStorage.setItem(keyInventario, JSON.stringify(inv));
  return true;
}

/** Descuenta stock en base al carrito (se usa al confirmar compra) */
function descontarStockPorCompra(itemsCarrito) {
  const inv = obtenerInventario();
  itemsCarrito.forEach((item) => {
    const idx = inv.findIndex((p) => p.id === item.id);
    if (idx !== -1) {
      inv[idx].stock = Math.max(0, inv[idx].stock - item.cantidad);
    }
  });
  localStorage.setItem(keyInventario, JSON.stringify(inv));
}