const db = require("./db");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  try {
    while (true) {
      console.log("Seleccione una opcion:");
      console.log(
        "[1] Leer tabla de usuario, [2] Crear Nuevo Usuario, [3] Eliminar Usuario por ID, [4] Actualizar Usuario, [5] Salir."
      );

      const option = await ask("opcion: ");

      switch (option) {
        case "1":
          await read();
          break;
        case "2":
          await create();
          break;
        case "3":
          await remove();
          break;
        case "4":
          await update();
          break;
        case "5":
          console.log("Saliendo del sistema");
          process.exit(0);
        default:
          console.log("Opcion no valida");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Leer Datos de la tabla
async function read() {
  try {
    const connection = await db.connectToDatabase();

    const [rows] = await connection.query("SELECT * FROM user");

    console.log(`Resultados:`);
    rows.forEach((row, index) => {
      console.log(`Fila ${index + 1}:`);
      console.log(`ID: ${row.iduser}`);
      console.log(`Name: ${row.userName}`);
      console.log(`Age: ${row.userAge}`);
      console.log(`Cellphone: ${row.userCel}`);
      console.log("//////////////////////////////////////");
    });

    connection.end();
  } catch (error) {
    console.log(error);
  }
}

// Función para crear un nuevo usuario
async function create() {
  try {
    const userName = await ask("Nombre: ");
    const userAge = await ask("Edad: ");
    const userCel = await ask("Celular: ");

    const connection = await db.connectToDatabase();

    const [result] = await connection.query(
      "INSERT INTO user (userName, userAge, userCel) VALUES (?, ?, ?)",
      [userName, userAge, userCel]
    );

    console.log("Usuario creado con éxito. ID:", result.insertId);

    connection.end();
  } catch (error) {
    console.log(error);
  }
}

// Función para eliminar un usuario por ID
async function remove() {
  try {
    const userId = await ask("ID del usuario a eliminar: ");

    const connection = await db.connectToDatabase();

    const [result] = await connection.query(
      "DELETE FROM user WHERE iduser = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      console.log("No se encontró ningún usuario con ese ID.");
    } else {
      console.log("Usuario eliminado con éxito.");
    }

    connection.end();
  } catch (error) {
    console.log(error);
  }
}

// Función para actualizar un usuario por ID
async function update() {
  try {
    const userId = await ask("ID del usuario a actualizar: ");

    const connection = await db.connectToDatabase();

    const [rows] = await connection.query(
      "SELECT * FROM user WHERE iduser = ?",
      [userId]
    );

    if (rows.length === 0) {
      console.log("No se encontró ningún usuario con ese ID.");
    } else {
      const user = rows[0];
      console.log(`Datos del usuario ID ${userId}:`);
      console.log(`Nombre: ${user.userName}`);
      console.log(`Edad: ${user.userAge}`);
      console.log(`Celular: ${user.userCel}`);

      const userName =
        (await ask(
          "Nuevo nombre (presiona Enter para mantener el actual): "
        )) || user.userName;
      const userAge =
        (await ask("Nueva edad (presiona Enter para mantener la actual): ")) ||
        user.userAge;
      const userCel =
        (await ask(
          "Nuevo celular (presiona Enter para mantener el actual): "
        )) || user.userCel;

      const [result] = await connection.query(
        "UPDATE user SET userName = ?, userAge = ?, userCel = ? WHERE iduser = ?",
        [userName, userAge, userCel, userId]
      );

      console.log("Usuario actualizado con éxito.");

      connection.end();
    }
  } catch (error) {
    console.log(error);
  }
}

main();
