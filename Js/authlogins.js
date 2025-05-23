// Selección del formulario y escucha del evento submit
const formulario = document.querySelector("#formulario");

formulario.addEventListener("submit", validarInicioSesion);

// Función que se ejecuta al enviar el formulario
function validarInicioSesion(event) {
    event.preventDefault(); // Previene el recargo de la página

    // Obtener los valores de los campos del formulario
    const correo = document.querySelector("#correo").value;
    const password = document.querySelector("#password").value;

    // Llamar a la función de inicio de sesión con los datos del usuario
    loginUser(correo, password);
}

// Función para iniciar sesión
async function loginUser(correo, password) {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            if (data.twoFactorEnabled) {
                // Si 2FA está habilitado, redirige a la página de verificación de 2FA
                window.location.href = "/public/2fa.html";
            } else {
                // Si 2FA no está habilitado, redirige a la página de configuración de 2FA
                window.location.href = "/public/setup-2fa.html";
            }
        } else {
            alert(data.message || 'Credenciales incorrectas. Intenta de nuevo.');
        }
    } catch (error) {
        console.error('Error en la solicitud de login:', error);
        alert('Error de conexión. Inténtalo más tarde.');
    }
}

// Función para configurar 2FA (obtener el código QR)
async function loadSetup2FA() {
    try {
        const response = await fetch('http://localhost:3000/api/setup-2fa', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('qrCodeImage').src = data.qrCodeURL;
        } else {
            alert('Error al cargar el código QR.');
        }
    } catch (error) {
        console.error('Error en la solicitud de configuración de 2FA:', error);
        alert('Error de conexión. Inténtalo más tarde.');
    }
}

// Función para verificar el token de 2FA en la configuración
async function verifySetup2FA(token) {
    try {
        const response = await fetch('http://localhost:3000/api/setup-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert('2FA habilitado exitosamente.');
            window.location.href = "/public/home.html"; // Redirigir al home después de habilitar 2FA
        } else {
            alert(data.message || 'Código de 2FA inválido. Intenta de nuevo.');
        }
    } catch (error) {
        console.error('Error en la solicitud de verificación de 2FA:', error);
        alert('Error de conexión. Inténtalo más tarde.');
    }
}

// Función para verificar el token de 2FA durante el inicio de sesión
async function verifyLogin2FA(token) {
    const correo = document.querySelector("#correo").value; // Obtener el correo del formulario

    try {
        const response = await fetch('http://localhost:3000/api/verify-2fa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, token }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert('Inicio de sesión con 2FA exitoso.');
            window.location.href = "/public/home.html"; // Redirigir al home después de verificar 2FA
        } else {
            alert(data.message || 'Código de 2FA inválido. Intenta de nuevo.');
        }
    } catch (error) {
        console.error('Error en la solicitud de verificación de 2FA:', error);
        alert('Error de conexión. Inténtalo más tarde.');
    }
}
