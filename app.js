function obtenerUsuarios() {
  const data = localStorage.getItem("uniregistro_usuarios");
  return data ? JSON.parse(data) : [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("uniregistro_usuarios", JSON.stringify(usuarios));
}

function renderizarTabla() {
  const tbody = document.getElementById("tablaUsuarios");
  const sinUsuarios = document.getElementById("sinUsuarios");
  if (!tbody) return;

  const usuarios = obtenerUsuarios();

  if (usuarios.length === 0) {
    tbody.innerHTML = "";
    sinUsuarios.style.display = "block";
    return;
  }

  sinUsuarios.style.display = "none";
  tbody.innerHTML = usuarios
    .map(
      (u) => `
    <tr>
      <td>${escapeHTML(u.nombre)}</td>
      <td>${escapeHTML(u.email)}</td>
      <td>${escapeHTML(u.telefono)}</td>
    </tr>
  `,
    )
    .join("");
}

function agregarUsuario(nombre, email, telefono, carrera) {
  const usuarios = obtenerUsuarios();
  const nuevo = {
    id: Date.now(),
    nombre: nombre.trim(),
    email: email.trim(),
    telefono: telefono.trim(),
    carrera: carrera,
  };
  usuarios.push(nuevo);
  guardarUsuarios(usuarios);
}

function escapeHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

const validaciones = {
  nombre: (v) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(v.trim()),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  telefono: (v) => /^\d{10}$/.test(v.trim()),
  password: (v) => v.length >= 6,
  confirmPassword: (v, pwd) => v === pwd,
};

const mensajesError = {
  nombre: "Mínimo 3 caracteres, solo letras y espacios.",
  email: "Ingresa un correo electrónico válido.",
  telefono: " Debe contener exactamente 10 dígitos numéricos.",
  password: "La contraseña debe tener al menos 6 caracteres.",
  confirmPassword: "Las contraseñas no coinciden.",
};

function validarCampo(id, valor, extra) {
  const errorDiv = document.getElementById(
    "error" + id.charAt(0).toUpperCase() + id.slice(1),
  );
  const valido =
    extra !== undefined
      ? validaciones[id](valor, extra)
      : validaciones[id](valor);
  errorDiv.textContent = valido ? "" : mensajesError[id];
  return valido;
}

function limpiarErrores() {
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));
}

document.addEventListener("DOMContentLoaded", () => {
  const btnGuardar = document.getElementById("btnGuardarModal");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      limpiarErrores();

      const nombre = document.getElementById("modalNombre").value;
      const email = document.getElementById("modalEmail").value;
      const telefono = document.getElementById("modalTelefono").value;
      const password = document.getElementById("modalPassword").value;
      const confirmPassword = document.getElementById(
        "modalConfirmPassword",
      ).value;

      const valido =
        validarCampo("nombre", nombre) &
        validarCampo("email", email) &
        validarCampo("telefono", telefono) &
        validarCampo("password", password) &
        validarCampo("confirmPassword", confirmPassword, password);

      if (valido) {
        agregarUsuario(nombre, email, telefono, "No asignada");
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("registroModal"),
        );
        if (modal) modal.hide();
        window.location.href = "tabla.html";
      }
    });
  }

  renderizarTabla();
});
