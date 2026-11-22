// Datos de la aplicación. Para agregar categorías o reportes, solo edita estos arrays.

const categorias = ["Calle dañada", "Basura", "Luminaria", "Fuga de agua"];

const estados = ["Pendiente", "En revisión", "Atendido"];

const reportes = [
  {
    id: 1,
    titulo: "Poste sin luz",
    descripcion: "El poste frente a la tienda lleva semanas apagado y la calle queda oscura.",
    categoria: "Luminaria",
    ubicacion: "Barrio Equipetrol, Santa Cruz",
    estado: "Pendiente",
    foto: null
  },
  {
    id: 2,
    titulo: "Bache grande",
    descripcion: "Bache profundo en medio de la avenida que daña los vehículos.",
    categoria: "Calle dañada",
    ubicacion: "Av. Banzer, Santa Cruz",
    estado: "En revisión",
    foto: null
  },
  {
    id: 3,
    titulo: "Basura acumulada",
    descripcion: "Bolsas de basura acumuladas en la esquina desde hace una semana.",
    categoria: "Basura",
    ubicacion: "Plan 3000, Santa Cruz",
    estado: "Atendido",
    foto: null
  }
];
