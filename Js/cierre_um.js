$(document).ready(function() {
  $.ajax({
    url: "http://localhost:3000/api/cierre_um",
    method: "GET",
    xhrFields: { withCredentials: true },
    success: function(data) {
      $('#tablaCierreUM').DataTable({
        data: data,
        columns: [
          { data: "_id", title: "Código" },
          { data: "proyecto", title: "Proyecto" },
          { data: "cliente", title: "Cliente" },
          { data: "direccion", title: "Dirección" },
          { data: "tipo_servicio", title: "Tipo Servicio" },
          { data: "medio", title: "Medio" },
          { data: "ot", title: "OT" },
          { data: "central_ur", title: "Central UR" },
          { data: "rda", title: "RDA" },
          { data: "supervisor_preliminar", title: "Supervisor Preliminar" },
          { data: "pruebas_preliminar", title: "Pruebas Preliminar" },
          { data: "supervisor", title: "Supervisor" },
          { data: "pruebas", title: "Pruebas" },
          { data: "despacho", title: "Despacho" },
          {
            data: "fecha_asignacion",
            title: "Fecha Asignación",
            render: data => data ? new Date(data).toLocaleDateString("es-ES") : ""
          },
          {
            data: "fecha_entrega",
            title: "Fecha Entrega",
            render: data => data ? new Date(data).toLocaleDateString("es-ES") : ""
          },
          { data: "estado", title: "Estado" },
          { data: "observaciones", title: "Observaciones" },
          { data: "tecnico", title: "Técnico" },
          { data: "odt", title: "ODT" },
          { data: "protocolo", title: "Protocolo" },
          { data: "cnoc", title: "CNOC" },
          {
            data: null,
            title: "Acciones",
            orderable: false,
            searchable: false,
            render: function(data) {
              return `
                <button class="btn-action" onclick="editarCierre('${data._id}')">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action" onclick="eliminarCierre('${data._id}')">
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
      console.error("Error al obtener cierres:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los registros de cierre.'
      });
    }
  });

  // Crear cierre
  $("#formCrearCierre").on("submit", function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());

    fetch("http://localhost:3000/api/cierre_um", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then(async res => {
        const result = await res.json();

        if (!res.ok) {
          console.error("Error al crear cierre:", result.error);
          Swal.fire("Error", result.mensaje || "No se pudo crear el registro", "error");
          return;
        }

        $('#modalCrearCierre').modal('hide');
        Swal.fire("¡Éxito!", "Registro creado correctamente", "success");
        $('#formCrearCierre')[0].reset();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(err => {
        console.error("Error de red o inesperado:", err);
        Swal.fire("Error", "No se pudo conectar al servidor", "error");
      });
  });

  // Editar cierre
  $('#formEditarCierre').on('submit', function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());

    fetch(`http://localhost:3000/api/cierre_um/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then(async res => {
        const result = await res.json();

        if (!res.ok) {
          console.error("Error al editar cierre:", result.error);
          Swal.fire("Error", result.mensaje || "No se pudo editar el registro", "error");
          return;
        }

        $('#modalEditarCierre').modal('hide');
        Swal.fire("¡Éxito!", "Registro editado correctamente", "success");
        $('#formEditarCierre')[0].reset();
        setTimeout(() => window.location.reload(), 1000);
      })
      .catch(err => {
        console.error("Error de red o inesperado:", err);
        Swal.fire("Error", "No se pudo conectar al servidor", "error");
      });
  });



  function formatDatetimeLocal(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  }
  // Cargar datos al formulario de edición
  window.editarCierre = function(id) {
    const table = $('#tablaCierreUM').DataTable();
    const rowData = table.rows().data().toArray().find(cierre => cierre._id === id);

    if (!rowData) {
      console.error("Registro no encontrado en tabla");
      return;
    }

    const form = document.querySelector("#formEditarCierre");
    if (!form) return;

    form["_id"].value = rowData._id || "";
    form["proyecto"].value = rowData.proyecto || "";
    form["cliente"].value = rowData.cliente || "";
    form["direccion"].value = rowData.direccion || "";
    form["tipo_servicio"].value = rowData.tipo_servicio || "";
    form["medio"].value = rowData.medio || "";
    form["ot"].value = rowData.ot || "";
    form["central_ur"].value = rowData.central_ur || "";
    form["rda"].value = rowData.rda || "";
    form["supervisor_preliminar"].value = rowData.supervisor_preliminar || "";
    form["pruebas_preliminar"].value = rowData.pruebas_preliminar || "";
    form["supervisor"].value = rowData.supervisor || "";
    form["pruebas"].value = rowData.pruebas || "";
    form["despacho"].value = rowData.despacho || "";
    form["fecha_asignacion"].value = formatDatetimeLocal(rowData.fecha_asignacion);
    form["fecha_entrega"].value = formatDatetimeLocal(rowData.fecha_entrega);
    form["estado"].value = rowData.estado || "";
    form["observaciones"].value = rowData.observaciones || "";
    form["tecnico"].value = rowData.tecnico || "";
    form["odt"].value = rowData.odt || "";
    form["protocolo"].value = rowData.protocolo || "";
    form["cnoc"].value = rowData.cnoc || "";

    const modal = new bootstrap.Modal(document.getElementById("modalEditarCierre"));
    modal.show();
  };

  // Eliminar cierre
  window.eliminarCierre = function(id) {
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
        fetch(`http://localhost:3000/api/cierre_um/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
          .then(res => res.json())
          .then(res => {
            Swal.fire("¡Eliminado!", "Registro eliminado correctamente", "success");
            setTimeout(() => window.location.reload(), 1000);
          })
          .catch(err => {
            console.error(err);
            Swal.fire("Error", "No se pudo eliminar el registro", "error");
          });
      }
    });
  };
});
