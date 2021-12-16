var nuevoId;
var db = openDatabase("itemDB", "1.0", "itemDB", 65535);

function limpiar() {
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("direccion").value = "";
  document.getElementById("edad").value = "";
}

//Funcionalidad de los botones
//Eliminar Registro
function eliminarRegistro() {
  $(document).one("click", 'button[type="button"]', function (event) {
    let id = this.id;
    var lista = [];
    $("#listaEmpleados").each(function () {
      var celdas = $(this).find("tr.Reg_" + id);
      celdas.each(function () {
        var registro = $(this).find("span.mid");
        registro.each(function () {
          lista.push($(this).html());
        });
      });
    });
    nuevoId = lista[0].substr(1);
    //alert(nuevoId);
    db.transaction(function (transaction) {
      var sql = "DELETE FROM empleados WHERE id=" + nuevoId + ";";
      transaction.executeSql(
        sql,
        undefined,
        function () {
          alert(
            "Registro borrado satisfactoriamente, Por favor actualice la tabla"
          );
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  });
}

//Editar registro
function editar() {
  $(document).one("click", 'button[type="button"]', function (event) {
    let id = this.id;
    var lista = [];
    $("#listaEmpleados").each(function () {
      var celdas = $(this).find("tr.Reg_" + id);
      celdas.each(function () {
        var registro = $(this).find("span");
        registro.each(function () {
          lista.push($(this).html());
        });
      });
    });
    document.getElementById("nombre").value = lista[1];
    document.getElementById("apellido").value = lista[2];
    document.getElementById("direccion").value = lista[3];
    document.getElementById("edad").value = lista[4].slice(0, -5);
    nuevoId = lista[0].substr(1);
  });
}

$(function () {
  // crear la tabla de empleados
  $("#crear").click(function () {
    db.transaction(function (transaction) {
      var sql =
        "CREATE TABLE empleados " +
        "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
        "nombre VARCHAR(100) NOT NULL, " +
        "apellido VARCHAR(100) NOT NULL," +
        "direccion VARCHAR(100) NOT NULL, " +
        "edad DECIMAL(5,2) NOT NULL)";
      transaction.executeSql(
        sql,
        undefined,
        function () {
          alert("Tabla creada satisfactoriamente");
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  });

  //Cargar la lista de productos
  $("#listar").click(function () {
    cargarDatos();
  });

  //Funcion para listar y pintar tabla de productos en la página web
  function cargarDatos() {
    $("#listaEmpleados").children().remove();
    db.transaction(function (transaction) {
      var sql = "SELECT * FROM empleados ORDER BY id DESC";
      transaction.executeSql(
        sql,
        undefined,
        function (transaction, result) {
          if (result.rows.length) {
            $("#listaEmpleados").append(
              "<tr><th>Código</th><th>Nombre</th><th>Apellido</th><th>Direccion</th><th>Edad</th><th></th><th></th></tr>"
            );
            for (var i = 0; i < result.rows.length; i++) {
              var row = result.rows.item(i);
              var nombre = row.nombre;
              var id = row.id;
              var apellido = row.apellido;
              var direccion = row.direccion;
              var edad = row.edad;
              $("#listaEmpleados").append(
                '<tr id="fila' +
                  id +
                  '" class="Reg_A' +
                  id +
                  '"><td><span class="mid">A' +
                  id +
                  "</span></td><td><span>" +
                  nombre +
                  "</span></td><td><span>" +
                  apellido +
                  "</span></td><td><span>" +
                  direccion +
                  "</span></td><td><span>" +
                  edad +
                  ' años</span></td><td><button type="button" id="A' +
                  id +
                  '" class="btn btn-success" onclick="editar()"><img src="libs/img/edit.png" /></button></td><td><button type="button" id="A' +
                  id +
                  '" class="btn btn-danger" onclick="eliminarRegistro()"><img src="libs/img/delete.png" /></button></td></tr>'
              );
            }
          } else {
            $("#listaEmpleados").append(
              '<tr><td colspan="5" align="center">No existen registros de productos</td></tr>'
            );
          }
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  }

  //insertar registros
  $("#insertar").click(function () {
    var nombre = $("#nombre").val();
    var apellido = $("#apellido").val();
    var direccion = $("#direccion").val();
    var edad = $("#edad").val();
    db.transaction(function (transaction) {
      var sql =
        "INSERT INTO empleados(nombre,apellido,direccion,edad) VALUES(?,?,?,?)";
      transaction.executeSql(
        sql,
        [nombre, apellido, direccion, edad],
        function () {},
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
    limpiar();
    cargarDatos();
  });

  //Modificar un registro
  $("#modificar").click(function () {
    var nnombre = $("#nombre").val();
    var napellido = $("#apellido").val();
    var ndireccion = $("#direccion").val();
    var nedad = $("#edad").val();

    db.transaction(function (transaction) {
      var sql =
        "UPDATE empleados SET nombre='" +
        nnombre +
        "', apellido='" +
        napellido +
        "', direccion='" +
        ndireccion +
        "', edad='" +
        nedad +
        "' WHERE id=" +
        nuevoId +
        ";";
      transaction.executeSql(
        sql,
        undefined,
        function () {
          cargarDatos();
          limpiar();
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  });

  // Para borrar toda la lista de Registros
  $("#borrarTodo").click(function () {
    if (
      !confirm(
        "Está seguro de borrar la tabla?, los datos se perderán permanentemente",
        ""
      )
    )
      return;
    db.transaction(function (transaction) {
      var sql = "DROP TABLE empleados";
      transaction.executeSql(
        sql,
        undefined,
        function () {
          alert(
            "Tabla borrada satisfactoriamente, Por favor, actualice la página"
          );
        },
        function (transaction, err) {
          alert(err.message);
        }
      );
    });
  });
});
