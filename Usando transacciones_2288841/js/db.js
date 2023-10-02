const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig');

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    throw error;
  }
}

async function disconnectFromDatabase(connection) {
  if (connection) {
    await connection.end();
  }
}

async function insertVentaYProductos(ventaData, productosData) {
  let connection = null;
  
  try {
    connection = await connectToDatabase();
    
    await connection.beginTransaction();

    const [ventaResult] = await connection.execute(
      'INSERT INTO venta (Total, IVA) VALUES (?, ?)',
      [ventaData.Total, ventaData.IVA]
    );

    const ventaId = ventaResult.insertId;

    for (const producto of productosData) {
      await connection.execute(
        'INSERT INTO productoventa (idProducto, idVenta, CantidadVendida, Subtotal, PrecioVenta) VALUES (?, ?, ?, ?, ?)',
        [producto.idProducto, ventaId, producto.CantidadVendida, producto.Subtotal, producto.PrecioVenta]
      );
    }

    await connection.commit();

    return ventaId;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    await disconnectFromDatabase(connection);
  }
}

module.exports = {
  insertVentaYProductos
};
