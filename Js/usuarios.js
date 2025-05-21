$(document).ready(function() {
  $.ajax({
    url: "http://localhost:3000/api/user",
    method: "GET",
    xhrFields: {
      withCredentials: true
    },
    success: function(data) {
      $('#tablaUsuarios').DataTable({
        data: data,
        columns: [
          { data: "_id" },
          { data: "Nombre" },
          { data: "correo" },
          {
            data: "id_rol",
            render: function(data) {
              return data === 1 ? "Admin" : data === 2 ? "Operador" : "Desconocido";
            }
          },
          {
            data: "fecha_creacion",
            render: function(data) {
              const fecha = new Date(data);
              return fecha.toLocaleDateString("es-ES");
            }
          },
          {
            data: "estado",
            render: function(data) {
              return data === 1 ? "Activo" : "Inactivo";
            }
          },
          {
            data: null,
            orderable: false,
            searchable: false,
            render: function(data) {
              return `
                <button class="btn btn-action" onclick="editarUsuario('${data._id}')">📝</button>
                <button class="btn btn-action" onclick="eliminarUsuario('${data._id}')">❌</button>
              `;
            }
          }
        ],
        language: {
          url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
        }
      });
    },
    error: function(err) {
      console.error("Error al obtener usuarios:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los usuarios.'
      });
    }
  });
});


// Crear usuario
$("#formCrearUsuario").on("submit", function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(this).entries());

  fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => {
      $('#modalCrearUsuario').modal('hide');
      Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
      $('#tablaUsuarios').DataTable().ajax.reload(); // si usas ajax
    })
    .catch(err => {
      console.error(err);
      Swal.fire("Error", "No se pudo crear el usuario", "error");
    });
});

// Editar usuario
window.editarUsuario = function(id) {
  fetch(`http://localhost:3000/api/user/${id}`)
    .then(res => res.json())
    .then(user => {
      const form = document.querySelector("#formEditarUsuario");
      form._id.value = user._id;
      form.Nombre.value = user.Nombre;
      form.correo.value = user.correo;
      form.id_rol.value = user.id_rol;
      $('#modalEditarUsuario').modal('show');
    });
};

$("#formEditarUsuario").on("submit", function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(this).entries());
  const id = data._id;

  fetch(`http://localhost:3000/api/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => {
      $('#modalEditarUsuario').modal('hide');
      Swal.fire("Actualizado", "Usuario modificado correctamente", "success");
      $('#tablaUsuarios').DataTable().ajax.reload(); // si usas ajax
    })
    .catch(err => {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    });
});
