
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
        const response = await fetch('http://localhost:3000/api/auth/logout', {
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
      window.location.href = "/views/index.ejs";
    }, 200);
  }
  if (opcion === 'inicio') {
    setTimeout(() => {
      window.location.href = "/home";
    }, 100);
  }
  if (opcion === 'registros') {
    setTimeout(() => {
      window.location.href = "/registros";
    }, 200);
  }
  if (opcion === 'usuarios') {
    setTimeout(() => {
      window.location.href = "/public/usuarios.html";
    }, 200);
  }
}
