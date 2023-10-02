const db = require('./db');

async function main() {
  try {
    const ventaData = { Total: 100, IVA: 0.16 };
    const productosData = [
      { idProducto: 1, CantidadVendida: 2, Subtotal: 50, PrecioVenta: 25 },
      { idProducto: 2, CantidadVendida: 3, Subtotal: 75, PrecioVenta: 25 }
    ];

    const ventaId = await db.insertVentaYProductos(ventaData, productosData);
    console.log(`Venta realizada con ID: ${ventaId}`);
  } catch (error) {
    console.error(error);
  }
}

main();
