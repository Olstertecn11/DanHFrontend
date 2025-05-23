
document.addEventListener("DOMContentLoaded", () => {
  console.log('loading');
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
        const i_classes = ['fa-table', 'fa-users']
        i_classes.forEach((i_class) => {
          const icon = document.querySelectorAll(`.${i_class}`);
          const parent = icon[0].parentElement;
          parent.parentElement.removeChild(parent);
        });
      }
    })
    .catch((error) => {
      console.error("Error al obtener user-info:", error.message);
    });
});



function confirmarCerrarSesion() {
  Swal.fire({
    title: '¿Está seguro de cerrar sesión?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch('http://24.199.111.122:3000/api/auth/logout', {
          method: 'POST',
          credentials: 'include' // Necesario para enviar la cookie
        });

        if (response.ok) {
          Swal.fire({
            icon: 'info',
            title: 'Cerrando sesión...',
            text: 'Espere un momento.',
            showConfirmButton: false,
            timer: 2000
          });

          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al cerrar sesión',
            text: 'Intente nuevamente.'
          });
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor.'
        });
      }
    }
  });
}

function mostrarOpcion(opcion) {
  if (opcion === 'dashboard') {
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 200);
  }
  if (opcion === 'inicio') {
    setTimeout(() => {
      window.location.href = "/inicio";
    }, 100);
  }
  if (opcion === 'registros') {
    setTimeout(() => {
      window.location.href = "/registros";
    }, 200);
  }
  if (opcion === 'usuarios') {
    setTimeout(() => {
      window.location.href = "/usuarios";
    }, 200);
  }

  if (opcion === 'cierre_um') {
    setTimeout(() => {
      window.location.href = "/cierre_um";
    }, 200);
  }
}
