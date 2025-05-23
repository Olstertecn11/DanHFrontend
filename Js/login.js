const formulario = document.querySelector("#formulario");
// http://24.199.111.122:3000

formulario.addEventListener("submit", async (e) => {


  e.preventDefault(); // Prevenir el comportamiento por defecto del form

  const username = document.querySelector("#user").value.trim();
  const password = document.querySelector("#pass").value.trim();

  if (!username || !password) {
    return Swal.fire({
      icon: 'warning',
      title: 'Campos vacíos',
      text: 'Usuario y/o contraseña vacíos, por favor llenar los campos correspondientes',
      timer: 2000,
      showConfirmButton: false
    });
  }

  try {
    const response = await fetch('http://24.199.111.122:3000/api/auth/login', {
      method: 'POST',
      credentials: 'include', // importante para recibir la cookie del backend
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correo: username,
        contrasena: password
      }),
    });
    console.log(response);

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        text: 'Credenciales Correctas',
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "/inicio";
      }, 1500);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: data.mensaje || 'Por favor, verifica tus credenciales'
      });
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar al servidor. Intenta de nuevo más tarde.'
    });
  }
});
