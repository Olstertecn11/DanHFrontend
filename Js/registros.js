document.addEventListener("DOMContentLoaded", () => {
  console.log('Inicializando tabla de usuarios...');

  const table = new Tabulator("#tabla", {
    layout: "fitDataStretch",
    pagination: "local",
    paginationSize: 10,
    ajaxURL: "http://localhost:3000/api/user",
    ajaxConfig: {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
    columns: [
      { title: "ID", field: "_id", headerFilter: "input" },
      { title: "Nombre", field: "Nombre", headerFilter: "input" },
      { title: "Correo", field: "correo", headerFilter: "input" },
      {
        title: "Rol",
        field: "id_rol",
        headerFilter: "select",
        headerFilterParams: { "": "", 1: "Admin", 2: "Operador" },
        formatter: function(cell) {
          const value = cell.getValue();
          return value === 1 ? "Admin" : value === 2 ? "Operador" : "Desconocido";
        },
      },
      {
        title: "Fecha de Creación",
        field: "fecha_creacion",
        headerFilter: "input",
        formatter: function(cell) {
          const raw = cell.getValue();
          const date = new Date(raw);
          return date.toLocaleDateString("es-ES");
        },
      },
      {
        title: "Estado",
        field: "estado",
        headerFilter: "select",
        headerFilterParams: { "": "", 1: "Activo", 0: "Inactivo" },
        formatter: function(cell) {
          return cell.getValue() === 1 ? "Activo" : "Inactivo";
        },
      },
    ],
  });

  table.setData(); // Cargar datos al inicializar

  document.getElementById("download-csv").addEventListener("click", function() {
    table.download("csv", "data.csv");
  });

  document.getElementById("download-xlsx").addEventListener("click", function() {
    table.download("xlsx", "data.xlsx", { sheetName: "My Data" });
  });

  //trigger download of data.pdf file
  document.getElementById("download-pdf").addEventListener("click", function() {
    table.download("pdf", "data.pdf", {
      orientation: "portrait", //set page orientation to portrait
      title: "Registros/Usuarios", //add title to report
    });
  });
});
