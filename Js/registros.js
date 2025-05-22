document.addEventListener("DOMContentLoaded", () => {
  console.log('Inicializando tabla de logs...');

  const table = new Tabulator("#tabla", {
    layout: "fitDataStretch",
    pagination: "local",
    paginationSize: 10,
    ajaxURL: "http://localhost:3000/api/logs", // ✅ Cambiamos al endpoint de logs
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
