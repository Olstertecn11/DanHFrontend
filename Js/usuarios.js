$(document).ready(function() {
  // Cargar usuarios en DataTable
  $.ajax({
    url: "http://localhost:3000/api/user",
    method: "GET",
    xhrFields: { withCredentials: true },
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
              return data === 1 || data === true ? "Activo" : "Inactivo";
            }
          },
          {
            data: null,
            orderable: false,
            searchable: false,
            render: function(data) {
              return `
                <button class="btn-action" onclick="editarUsuario('${data._id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action" onclick="eliminarUsuario('${data._id}')">
                  <i class="fas fa-trash"></i>
                </button>
              `;
            }
          }
        ],
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
        },
        destroy: true
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


  $("#formCrearUsuario").on("submit", function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());

    fetch("http://localhost:3000/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ para enviar la cookie de sesión
      body: JSON.stringify(data),
    })
      .then(async res => {
        const result = await res.json();

        if (!res.ok) {
          // ❌ Mostrar mensaje de error si la respuesta no es 200 o 201
          console.error("Error al crear:", result.error);
          Swal.fire("Error", result.mensaje || "No se pudo crear el usuario", "error");
          return;
        }

        // ✅ Solo si el código es 200 o 201
        $('#modalCrearUsuario').modal('hide');
        Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
        $('#formCrearUsuario')[0].reset();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(err => {
        console.error("Error de red o inesperado:", err);
        Swal.fire("Error", "No se pudo conectar al servidor", "error");
      });
  });


  // Editar usuario
  window.editarUsuario = function(id) {
    const table = $('#tablaUsuarios').DataTable();
    const rowData = table.rows().data().toArray().find(user => user._id === id);

    if (!rowData) {
      console.error("Usuario no encontrado en tabla");
      return;
    }

    document.querySelector("#formEditarUsuario [name='_id']").value = rowData._id;
    document.querySelector("#formEditarUsuario [name='Nombre']").value = rowData.Nombre;
    document.querySelector("#formEditarUsuario [name='correo']").value = rowData.correo;
    document.querySelector("#formEditarUsuario [name='id_rol']").value = rowData.id_rol;

    const modal = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
    modal.show();
  }

  // Guardar cambios de edición
  $("#formEditarUsuario").on("submit", function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());
    const id = data._id;

    fetch(`http://localhost:3000/api/user/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then(res => res.json())
      .then(res => {
        $('#modalEditarUsuario').modal('hide');
        Swal.fire("Actualizado", "Usuario modificado correctamente", "success");
        $('#formEditarUsuario')[0].reset();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(err => {
        console.error(err);
        Swal.fire("Error", "No se pudo actualizar el usuario", "error");
      });
  });

  // Eliminar usuario
  window.eliminarUsuario = function(id) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/api/user/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
          .then(res => res.json())
          .then(res => {
            Swal.fire("¡Eliminado!", "Usuario eliminado correctamente", "success");
            setTimeout(() => window.location.reload(), 1000);
          })
          .catch(err => {
            console.error(err);
            Swal.fire("Error", "No se pudo eliminar el usuario", "error");
          });
      }
    });
  }
});
