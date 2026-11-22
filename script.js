// Lógica de la aplicación. Usa los arrays de data.js.

let categoriaElegida = null;
let ubicacionElegida = "";
let fotoElegida = null;
let reporteActivo = null; // id del reporte que se ve en Administración

// ---------- Utilidades ----------
const $ = (id) => document.getElementById(id);

function crear(etiqueta, clase, texto) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto; // textContent evita inyectar HTML
  return el;
}

function claseEstado(estado) {
  return "estado estado-" + estado.toLowerCase().replace(" ", "-").replace("ó", "o");
}

function mostrarMensaje(texto, esError) {
  const m = $("mensaje");
  m.textContent = texto;
  m.className = "mensaje" + (esError ? " error" : "");
}

// ---------- Navegación entre pantallas ----------
function mostrarVista(nombre) {
  document.querySelectorAll(".vista").forEach((v) => (v.hidden = true));
  $("vista-" + nombre).hidden = false;

  document.querySelectorAll(".menu button").forEach((b) => {
    b.classList.toggle("activo", b.dataset.vista === nombre);
  });

  if (nombre === "lista") dibujarLista();
  if (nombre === "admin") dibujarAdmin();
}

// ---------- Pantalla: Nuevo reporte ----------
function dibujarCategorias() {
  const cont = $("categorias");
  cont.innerHTML = "";
  categorias.forEach((cat) => {
    const chip = crear("button", "chip" + (cat === categoriaElegida ? " activo" : ""), cat);
    chip.type = "button";
    chip.onclick = () => {
      categoriaElegida = cat;
      dibujarCategorias();
    };
    cont.appendChild(chip);
  });
}

function usarUbicacion() {
  const btn = $("btn-ubicacion");
  if (!navigator.geolocation) {
    mostrarMensaje("Tu navegador no permite obtener la ubicación.", true);
    return;
  }
  btn.textContent = "Obteniendo ubicación...";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      ubicacionElegida = latitude.toFixed(5) + ", " + longitude.toFixed(5);
      btn.textContent = "Ubicación: " + ubicacionElegida;
      btn.classList.add("btn-ok");
    },
    () => {
      btn.textContent = "Usar mi ubicación";
      mostrarMensaje("No se pudo obtener la ubicación.", true);
    }
  );
}

function elegirFoto(evento) {
  const archivo = evento.target.files[0];
  if (!archivo) return;
  fotoElegida = URL.createObjectURL(archivo);
  $("btn-foto").textContent = "Foto: " + archivo.name;
  $("btn-foto").classList.add("btn-ok");
}

function limpiarFormulario() {
  $("descripcion").value = "";
  $("foto").value = "";
  categoriaElegida = null;
  ubicacionElegida = "";
  fotoElegida = null;
  $("btn-ubicacion").textContent = "Usar mi ubicación";
  $("btn-ubicacion").classList.remove("btn-ok");
  $("btn-foto").textContent = "Agregar foto (opcional)";
  $("btn-foto").classList.remove("btn-ok");
  mostrarMensaje("");
  dibujarCategorias();
}

function enviarReporte() {
  const descripcion = $("descripcion").value.trim();

  if (!descripcion) return mostrarMensaje("Describe el problema.", true);
  if (!categoriaElegida) return mostrarMensaje("Elige una categoría.", true);
  if (!ubicacionElegida) return mostrarMensaje("Agrega tu ubicación.", true);

  const nuevoId = reportes.length ? Math.max(...reportes.map((r) => r.id)) + 1 : 1;

  reportes.unshift({
    id: nuevoId,
    titulo: descripcion.length > 30 ? descripcion.slice(0, 30) + "..." : descripcion,
    descripcion: descripcion,
    categoria: categoriaElegida,
    ubicacion: ubicacionElegida,
    estado: "Pendiente",
    foto: fotoElegida
  });

  limpiarFormulario();
  mostrarVista("lista");
}

// ---------- Pantalla: Reportes ----------
function dibujarLista() {
  const cont = $("lista");
  cont.innerHTML = "";

  if (!reportes.length) {
    cont.appendChild(crear("p", "vacio", "Aún no hay reportes."));
    return;
  }

  reportes.forEach((r) => {
    const tarjeta = crear("button", "tarjeta");
    tarjeta.type = "button";
    tarjeta.appendChild(crear("strong", "", r.titulo));
    tarjeta.appendChild(crear("span", "sub", r.categoria));
    tarjeta.appendChild(crear("span", claseEstado(r.estado), r.estado));
    tarjeta.onclick = () => {
      reporteActivo = r.id;
      mostrarVista("admin");
    };
    cont.appendChild(tarjeta);
  });
}

// ---------- Pantalla: Administración ----------
function dibujarAdmin() {
  const cont = $("admin-contenido");
  cont.innerHTML = "";

  const r = reportes.find((x) => x.id === reporteActivo) || reportes[0];
  if (!r) {
    cont.appendChild(crear("p", "vacio", "No hay reportes para administrar."));
    return;
  }
  reporteActivo = r.id;

  const foto = crear("div", "foto-reporte");
  if (r.foto) {
    const img = crear("img");
    img.src = r.foto;
    img.alt = "Foto del reporte";
    foto.appendChild(img);
  } else {
    foto.textContent = "Foto del reporte";
  }

  const select = crear("select");
  select.id = "select-estado";
  estados.forEach((e) => {
    const op = crear("option", "", e);
    op.value = e;
    op.selected = e === r.estado;
    select.appendChild(op);
  });

  const etiqueta = crear("label", "", "Estado");
  etiqueta.htmlFor = "select-estado";

  const boton = crear("button", "btn btn-principal", "Actualizar estado");
  boton.type = "button";
  boton.onclick = () => {
    r.estado = select.value;
    mostrarVista("lista");
  };

  cont.append(
    foto,
    crear("h3", "admin-titulo", r.titulo),
    crear("p", "admin-sub", r.categoria + " · " + r.ubicacion),
    crear("p", "admin-sub", r.descripcion),
    etiqueta,
    select,
    boton
  );
}

// ---------- Eventos e inicio ----------
document.querySelectorAll(".menu button").forEach((b) => {
  b.onclick = () => mostrarVista(b.dataset.vista);
});
$("btn-ir-nuevo").onclick = () => mostrarVista("nuevo");
$("btn-ubicacion").onclick = usarUbicacion;
$("btn-foto").onclick = () => $("foto").click();
$("foto").onchange = elegirFoto;
$("btn-enviar").onclick = enviarReporte;

dibujarCategorias();
