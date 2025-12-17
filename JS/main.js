//POP UP SUSCRIPCIÓN
const btn = document.getElementById("btnPopup");
const popup = document.getElementById("popup");
const close = document.getElementById("closePopup");

btn?.addEventListener("click", () => {
  popup.style.display = "block";
});

close?.addEventListener("click", () => {
  popup.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});

//VALIDACIÓN EMAIL
const emailInput = document.getElementById("email");

emailInput?.addEventListener("invalid", function () {
  if (emailInput.validity.valueMissing) {
    emailInput.setCustomValidity("Por favor, ingresá tu email.");
  } else if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity("El formato del email no es válido.");
  } else {
    emailInput.setCustomValidity("");
  }
});

emailInput?.addEventListener("input", function () {
  emailInput.setCustomValidity("");
});

//ENVIOS
const enviosSpan = document.getElementById('enviosSpan');
if (enviosSpan) {
  const repeticiones = 20;
  let contenido = '';
  for (let i = 0; i < repeticiones; i++) {
    contenido += `<img class="envio" src="IMG/icon_camion.svg" alt="camión"> Envíos en todo el país `;
  }
  enviosSpan.innerHTML = contenido;
}

//PRODUCTOS
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("./JS/datos.json")
    .then(response => response.json())
    .then(productos => {
      generarListado(productos);
      dibujarCarrito();
    })
    .catch(error => console.error("Error cargando datos.json:", error));
});

function generarListado(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  productos.forEach(producto => {
    const html = `
      <div class="col-sm col-md-6 col-xl-3 product-card">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="product-name">${producto.nombre}</div>
        <div class="price">$${producto.precio.toLocaleString("es-AR")}</div>
        <button class="shop" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">
          Agregar al carrito
        </button>
      </div>
    `;
    contenedor.innerHTML += html;
  });
}

//POPUP DE TALLES
function agregarAlCarrito(id, nombre, precio) {
  const tallaPopup = document.getElementById("tallaPopup");
  tallaPopup.style.display = "block";

  document.getElementById("closeTallaPopup").onclick = () => {
    tallaPopup.style.display = "none";
  };

  document.querySelectorAll(".talla-btn").forEach(btn => {
    btn.onclick = () => {
      const talla = btn.dataset.talla;
      tallaPopup.style.display = "none";

      const item = carrito.find(p => p.id === id && p.talla === talla);
      if (item) {
        item.cantidad++;
      } else {
        carrito.push({ id, nombre, precio, talla, cantidad: 1 });
      }
      dibujarCarrito();
    };
  });
}

//CARRITO
function dibujarCarrito() {
  const contenedorCarrito = document.getElementById("pedido-final");
  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío</p>`;
    return;
  }

  let total = 0;
  let tabla = `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Talla</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
  `;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    tabla += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.nombre}</td>
        <td>${item.talla}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio.toLocaleString("es-AR")}</td>
        <td>$${subtotal.toLocaleString("es-AR")}</td>
        <td><button class="eliminar-item" data-index="${index}">❌</button></td>
      </tr>
    `;
  });

  tabla += `
      <tr>
        <td colspan="5"><strong>Total</strong></td>
        <td><strong>$${total.toLocaleString("es-AR")}</strong></td>
        <td></td>
      </tr>
      </tbody>
    </table>
    <div style="text-align:center; margin-top:15px;">
      <button id="finalizarCompra" class="btn-finalizar">Finalizar compra</button>
    </div>
  `;

  contenedorCarrito.innerHTML = tabla;

  // Botones eliminar
  document.querySelectorAll(".eliminar-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index, 10);
      carrito.splice(index, 1);
      dibujarCarrito();
    });
  });

  // Botón finalizar compra
  document.getElementById("finalizarCompra")?.addEventListener("click", () => {
    mostrarFormularioCliente();
  });
}

//FORMULARIO CLIENTE
function mostrarFormularioCliente() {
  const contenedorCarrito = document.getElementById("pedido-final");

  const formHTML = `
    <div class="form-cliente">
      <h3>Datos del comprador</h3>
      <div class="campo">
        <label for="nombre">Nombre y Apellido:</label>
        <input type="text" id="nombre" required>
      </div>
      <div class="campo">
        <label for="emailCliente">Email:</label>
        <input type="email" id="emailCliente" required>
      </div>
      <div class="campo">
        <label for="direccion">Dirección:</label>
        <input type="text" id="direccion" required>
      </div>
      <button id="confirmarPedido" class="btn-confirmar">Confirmar pedido</button>
    </div>
  `;

  contenedorCarrito.innerHTML += formHTML;

  document.getElementById("confirmarPedido").addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("emailCliente").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if (!nombre || !email || !direccion) {
      alert("Por favor completá todos los campos.");
      return;
    }

    mostrarPopupGracias();
    carrito = [];

    dibujarCarrito();
    });
}

//POPUP GRACIAS
function mostrarPopupGracias() {
  const popupGracias = document.createElement("div");
  popupGracias.classList.add("popup-gracias");
  popupGracias.innerHTML = `
    <div class="popup-gracias-content">
      <span class="close-gracias">&times;</span>
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido confirmado y pronto recibirás un email con los detalles.</p>
    </div>
  `;
  document.body.appendChild(popupGracias);

  popupGracias.style.display = "block";

  // Cerrar popup
  popupGracias.querySelector(".close-gracias").onclick = () => {
    popupGracias.remove();
  };

  window.addEventListener("click", (e) => {
    if (e.target === popupGracias) {
      popupGracias.remove();
    }
  });
}

// ---------------- SIDEBAR DEL CARRITO ----------------
const btnCarrito = document.getElementById("btnCarrito");
const carritoSidebar = document.getElementById("carritoSidebar");
const closeCarrito = document.getElementById("closeCarrito");
const overlay = document.getElementById("overlay");

btnCarrito?.addEventListener("click", () => {
  carritoSidebar.classList.add("activo");
  overlay.classList.add("activo");
  document.body.style.overflow = "hidden"; 
});

closeCarrito?.addEventListener("click", () => {
  carritoSidebar.classList.remove("activo");
  overlay.classList.remove("activo");
  document.body.style.overflow = "";
});

overlay?.addEventListener("click", () => {
  carritoSidebar.classList.remove("activo");
  overlay.classList.remove("activo");
  document.body.style.overflow = "";
});