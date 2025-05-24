document.addEventListener("DOMContentLoaded", function() {
  const counter = document.getElementById("countdown");

  const [initialMinutes, initialSeconds] = counter.innerText.split(":").map(Number);
  let totalSeconds = initialMinutes * 60 + initialSeconds;

  const interval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(interval);
      window.location.href = "/";
      return;
    }

    totalSeconds--;

    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    counter.innerText = `${minutes}:${seconds}`;
  }, 1000);

  document.getElementById("formulario-2fa").addEventListener("submit", async function(event) {
    event.preventDefault();

    const token = document.getElementById("token").value.trim().toUpperCase();

    if (!token) {
      return Swal.fire("Error", "Debes ingresar el código de verificación", "warning");
    }

    try {
      // Verificar si el token existe
      const response = await fetch(`http://localhost:3000/api/2fa_token/codigo/${token}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok || !data || !data.creado_en) {
        return Swal.fire("Error", data.mensaje || "Código inválido", "error");
      }

      const creadoEn = new Date(data.creado_en);
      const ahora = new Date();
      const diferenciaSegundos = (ahora - creadoEn) / 1000;

      if (diferenciaSegundos < 0) {
        console.warn("¡Advertencia! La fecha de creación del token es mayor que la actual.");
      }

      if (diferenciaSegundos > 180) {
        await fetch(`http://localhost:3000/api/2fa_token/codigo/${token}`, {
          method: "DELETE",
          credentials: "include",
        });

        return Swal.fire("Expirado", "El código ha expirado, vuelve a iniciar sesión", "info")
          .then(() => window.location.href = "/");
      }

      // Eliminar token porque fue usado correctamente
      await fetch(`http://localhost:3000/api/2fa_token/codigo/${token}`, {
        method: "DELETE",
        credentials: "include",
      });

      Swal.fire("Éxito", "Código verificado correctamente", "success")
        .then(() => window.location.href = "/inicio");

    } catch (error) {
      console.error("Error al verificar token:", error);
      Swal.fire("Error", "No se pudo verificar el código", "error");
    }
  });
});
