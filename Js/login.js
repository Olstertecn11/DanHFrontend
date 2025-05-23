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
    const response = await fetch('http://24.199.111.122:3000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo: username, contrasena: password }),
    });

    const data = await response.json();
    if (!response.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: data.mensaje || 'Credenciales inválidas',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
    if (data.usuario.twoFactorEnable) {
      console.log(data.usuario);
      const userId = data.usuario._id;

      if (!userId) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'ID de usuario no disponible para 2FA'
        });
      }

      // Guardar ID temporal en sessionStorage
      sessionStorage.setItem("pending2FAUserId", userId);

      try {
        const response2 = await fetch("http://24.199.111.122:3000/api/2fa_token/crear", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });

        const result = await response2.json();

        if (response2.ok) {
          Swal.fire({
            icon: 'info',
            title: 'Verificación de 2FA',
            text: 'Se ha enviado un código a tu correo electrónico.',
            timer: 2000,
            showConfirmButton: false
          });

          setTimeout(() => {
            window.location.href = "/2fa";
          }, 2000);
        } else {
          throw new Error(result.mensaje || "Error al enviar el token 2FA");
        }

      } catch (error) {
        console.error("Error 2FA:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error 2FA',
          text: error.message
        });
      }

      return; // Detener el flujo del login principal (esperando verificación)
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
      const response = await fetch("http://24.199.111.122:3000/api/2fa/verificar", {
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
