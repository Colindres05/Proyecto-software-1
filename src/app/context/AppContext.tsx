import { createContext, useContext, useState, ReactNode } from "react";
import { menuItems as menuInicial, categorias as categoriasIniciales, type MenuItem, type Order, type Cliente, type Oferta } from "../data/menu";

interface AppContextType {
  menuItems: MenuItem[];
  pedidos: Order[];
  categorias: string[];
  clientes: Cliente[];
  ofertas: Oferta[];
  agregarPedido: (pedido: Order) => void;
  actualizarEstadoPedido: (id: string, estado: Order["estado"]) => void;
  actualizarMenuItem: (item: MenuItem) => void;
  agregarMenuItem: (item: MenuItem) => void;
  eliminarMenuItem: (id: string) => void;
  agregarCategoria: (categoria: string) => void;
  obtenerCliente: (nit: string) => Cliente | undefined;
  obtenerOfertasAplicables: (nit: string) => Oferta[];
  agregarOferta: (oferta: Oferta) => void;
  actualizarOferta: (oferta: Oferta) => void;
  eliminarOferta: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuInicial);
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [categorias, setCategorias] = useState<string[]>(categoriasIniciales);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);

  const agregarPedido = (pedido: Order) => {
    setPedidos(prev => [...prev, pedido]);

    // Actualizar información del cliente si tiene NIT
    if (pedido.nit && pedido.nombreCliente) {
      setClientes(prev => {
        const clienteExistente = prev.find(c => c.nit === pedido.nit);
        
        if (clienteExistente) {
          return prev.map(c => 
            c.nit === pedido.nit 
              ? {
                  ...c,
                  totalCompras: c.totalCompras + 1,
                  totalGastado: c.totalGastado + (pedido.totalConDescuento || pedido.total),
                  historialPedidos: [...c.historialPedidos, pedido.id]
                }
              : c
          );
        } else {
          return [...prev, {
            nit: pedido.nit,
            nombre: pedido.nombreCliente,
            totalCompras: 1,
            totalGastado: pedido.totalConDescuento || pedido.total,
            historialPedidos: [pedido.id]
          }];
        }
      });
    }
  };

  const actualizarEstadoPedido = (id: string, estado: Order["estado"]) => {
    setPedidos(prev => prev.map(p => {
      if (p.id === id) {
        // Si cambia a "preparando", calcular el tiempo total de preparación e iniciar el temporizador
        if (estado === "preparando" && p.estado === "pendiente") {
          const tiempoTotal = p.items.reduce((sum, item) => 
            sum + (item.tiempoPreparacion * item.cantidad), 0
          );
          return {
            ...p,
            estado,
            tiempoPreparacionInicio: Date.now(),
            tiempoPreparacionTotal: tiempoTotal * 60 * 1000 // convertir a milisegundos
          };
        }
        return { ...p, estado };
      }
      return p;
    }));
  };

  const actualizarMenuItem = (item: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const agregarMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
  };

  const eliminarMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  const agregarCategoria = (categoria: string) => {
    if (!categorias.includes(categoria)) {
      setCategorias(prev => [...prev, categoria]);
    }
  };

  const obtenerCliente = (nit: string): Cliente | undefined => {
    return clientes.find(c => c.nit === nit);
  };

  const obtenerOfertasAplicables = (nit: string): Oferta[] => {
    const cliente = obtenerCliente(nit);
    if (!cliente) return [];

    return ofertas.filter(oferta => {
      if (!oferta.activa) return false;

      if (oferta.tipo === "por-compras") {
        // +1 porque esta sería la siguiente compra
        return (cliente.totalCompras + 1) % oferta.cantidadRequerida === 0;
      } else {
        // por-monto: verificar si ha gastado lo suficiente
        return cliente.totalGastado >= oferta.cantidadRequerida;
      }
    });
  };

  const agregarOferta = (oferta: Oferta) => {
    setOfertas(prev => [...prev, oferta]);
  };

  const actualizarOferta = (oferta: Oferta) => {
    setOfertas(prev => prev.map(o => o.id === oferta.id ? oferta : o));
  };

  const eliminarOferta = (id: string) => {
    setOfertas(prev => prev.filter(o => o.id !== id));
  };

  return (
    <AppContext.Provider value={{
      menuItems,
      pedidos,
      categorias,
      clientes,
      ofertas,
      agregarPedido,
      actualizarEstadoPedido,
      actualizarMenuItem,
      agregarMenuItem,
      eliminarMenuItem,
      agregarCategoria,
      obtenerCliente,
      obtenerOfertasAplicables,
      agregarOferta,
      actualizarOferta,
      eliminarOferta
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe ser usado dentro de AppProvider");
  }
  return context;
}