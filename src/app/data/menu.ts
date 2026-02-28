// Datos del menú de la cafetería
export interface MenuItem {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
  tiempoPreparacion: number; // en minutos
}

export const menuItems: MenuItem[] = [
  // Bebidas Calientes
  {
    id: "1",
    nombre: "Café Americano",
    categoria: "Bebidas Calientes",
    precio: 35,
    descripcion: "Espresso con agua caliente",
    tiempoPreparacion: 3
  },
  {
    id: "2",
    nombre: "Cappuccino",
    categoria: "Bebidas Calientes",
    precio: 45,
    descripcion: "Espresso con leche vaporizada y espuma",
    tiempoPreparacion: 5
  },
  {
    id: "3",
    nombre: "Latte",
    categoria: "Bebidas Calientes",
    precio: 48,
    descripcion: "Espresso con leche vaporizada",
    tiempoPreparacion: 5
  },
  {
    id: "4",
    nombre: "Mocha",
    categoria: "Bebidas Calientes",
    precio: 52,
    descripcion: "Espresso con chocolate y leche",
    tiempoPreparacion: 6
  },
  {
    id: "5",
    nombre: "Té Chai",
    categoria: "Bebidas Calientes",
    precio: 42,
    descripcion: "Té especiado con leche",
    tiempoPreparacion: 4
  },
  // Bebidas Frías
  {
    id: "6",
    nombre: "Café Frappé",
    categoria: "Bebidas Frías",
    precio: 55,
    descripcion: "Café helado batido con hielo",
    tiempoPreparacion: 6
  },
  {
    id: "7",
    nombre: "Smoothie Fresa",
    categoria: "Bebidas Frías",
    precio: 58,
    descripcion: "Batido de fresas naturales",
    tiempoPreparacion: 5
  },
  {
    id: "8",
    nombre: "Limonada Natural",
    categoria: "Bebidas Frías",
    precio: 38,
    descripcion: "Limón fresco con menta",
    tiempoPreparacion: 3
  },
  // Alimentos
  {
    id: "9",
    nombre: "Croissant",
    categoria: "Alimentos",
    precio: 35,
    descripcion: "Croissant de mantequilla",
    tiempoPreparacion: 2
  },
  {
    id: "10",
    nombre: "Sandwich Jamón y Queso",
    categoria: "Alimentos",
    precio: 65,
    descripcion: "Pan artesanal con jamón y queso",
    tiempoPreparacion: 8
  },
  {
    id: "11",
    nombre: "Muffin de Arándanos",
    categoria: "Alimentos",
    precio: 42,
    descripcion: "Muffin casero con arándanos frescos",
    tiempoPreparacion: 2
  },
  {
    id: "12",
    nombre: "Panini de Pollo",
    categoria: "Alimentos",
    precio: 78,
    descripcion: "Pan italiano con pollo y vegetales",
    tiempoPreparacion: 10
  },
  // Postres
  {
    id: "13",
    nombre: "Cheesecake",
    categoria: "Postres",
    precio: 55,
    descripcion: "Pastel de queso con frutos rojos",
    tiempoPreparacion: 3
  },
  {
    id: "14",
    nombre: "Brownie",
    categoria: "Postres",
    precio: 45,
    descripcion: "Brownie de chocolate con nueces",
    tiempoPreparacion: 3
  },
  {
    id: "15",
    nombre: "Galletas",
    categoria: "Postres",
    precio: 25,
    descripcion: "3 galletas con chispas de chocolate",
    tiempoPreparacion: 2
  }
];

export const categorias = [
  "Todas",
  "Bebidas Calientes",
  "Bebidas Frías",
  "Alimentos",
  "Postres"
];

export interface OrderItem extends MenuItem {
  cantidad: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  descuentoAplicado?: number;
  totalConDescuento?: number;
  tipo: "llevar" | "mesa";
  numeroMesa?: number;
  metodoPago?: "tarjeta" | "efectivo";
  estado: "pendiente" | "preparando" | "listo";
  timestamp: number;
  horaProgramada?: number;
  tiempoPreparacionInicio?: number;
  tiempoPreparacionTotal?: number;
  nit?: string;
  nombreCliente?: string;
  ofertaAplicada?: string;
}

export interface Cliente {
  nit: string;
  nombre: string;
  totalCompras: number;
  totalGastado: number;
  historialPedidos: string[];
}

export interface Oferta {
  id: string;
  nombre: string;
  tipo: "por-compras" | "por-monto";
  cantidadRequerida: number; // número de compras o monto total gastado
  descuento: number; // porcentaje de descuento
  activa: boolean;
}