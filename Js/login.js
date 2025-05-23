const formulario = document.querySelector("#formulario");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector("#user").value.trim();
  const password = document.querySelector("#pass").value.trim();
  const otpField = document.querySelector("#otp");

  if (!username || !password) {
    return Swal.fire({
      icon: 'warning',
      title: 'Campos vacíos',
      text: 'Usuario y/o contraseña vacíos',
      timer: 2000,
      showConfirmButton: false
    });
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: username, contrasena: password }),
    });

    const data = await response.json();

    if (data.twoFactor) {
      // ✅ Mostrar campo OTP y esperar confirmación
      Swal.fire({
        icon: 'info',
        title: 'Código 2FA requerido',
        text: 'Ingresa el código de Google Authenticator',
      });

      otpField.style.display = "block";
      otpField.focus();

      // Guardar temporalmente el ID
      sessionStorage.setItem("pending2FAUserId", data.usuario.id);
      return;
    }

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.href = "/inicio";
      }, 1500);
    } else {
      throw new Error(data.mensaje || 'Credenciales inválidas');
    }

  } catch (error) {
    console.error('Error en login:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message
    });
  }
});

// ✅ Si el campo OTP es visible y se rellena, enviar el código
document.querySelector("#otp").addEventListener("keypress", async function(e) {
  if (e.key === "Enter") {
    const code = this.value.trim();
    const userId = sessionStorage.getItem("pending2FAUserId");

    if (!code || !userId) return;

    try {
      const response = await fetch("http://localhost:3000/api/2fa/verificar", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: code, id: userId })
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("2FA Verificado", "Inicio de sesión exitoso", "success");
        setTimeout(() => {
          window.location.href = "/inicio";
        }, 1500);
      } else {
        Swal.fire("Error", data.mensaje || "Código incorrecto", "error");
      }
    } catch (err) {
      console.error("Error al verificar 2FA:", err);
      Swal.fire("Error", "Error de red al verificar 2FA", "error");
    }
  }
});
