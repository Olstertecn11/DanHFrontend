document.addEventListener("DOMContentLoaded", () => {
  // make a post request to  user-info
  fetch("http://24.199.111.122:3000/api/auth/user-info", {
    method: "POST",
    credentials: "include", // Necesario si estás usando cookies para sesión
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}), // Aunque no necesitas enviar body en este caso
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || "Error al obtener el usuario");
      }
      return response.json();
    })
    .then((data) => {
      const user = data;
      if (user.id_rol > 1) {
        window.location.href = "/sin-permisos.html";
      }
    })
    .catch((error) => {
      console.error("Error al obtener user-info:", error.message);
    });


  const table = new Tabulator("#tabla", {
    layout: "fitDataStretch",
    pagination: "local",
    paginationSize: 10,
    ajaxURL: "http://24.199.111.122:3000/api/logs", // ✅ Cambiamos al endpoint de logs
    ajaxConfig: {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
    columns: [
      { title: "ID", field: "_id", headerFilter: "input" },
      { title: "Usuario", field: "id_usuario", headerFilter: "input" },
      { title: "Acción", field: "accion", headerFilter: "input" },
      { title: "Detalles", field: "detalles", headerFilter: "input" },
      {
        title: "Fecha",
        field: "fecha",
        headerFilter: "input",
        formatter: function(cell) {
          const raw = cell.getValue();
          const date = new Date(raw);
          return date.toLocaleDateString("es-ES") + ' ' + date.toLocaleTimeString("es-ES");
        },
      },
    ],
  });

  table.setData(); // ✅ Cargar logs al inicializar

  // Botones de exportación
  document.getElementById("download-csv").addEventListener("click", function() {
    table.download("csv", "logs.csv");
  });

  document.getElementById("download-xlsx").addEventListener("click", function() {
    table.download("xlsx", "logs.xlsx", { sheetName: "Logs" });
  });

  document.getElementById("download-pdf").addEventListener("click", function() {
    table.download("pdf", "logs.pdf", {
      orientation: "portrait",
      title: "Historial de Acciones",
    });
  });
});
