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
