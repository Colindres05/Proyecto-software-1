import { useState } from "react";
import { ArrowLeft, Plus, Minus, ShoppingCart, CreditCard, Banknote, Receipt, Gift } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useApp } from "../context/AppContext";
import { type OrderItem, type Order, type Oferta } from "../data/menu";
import { FormularioTarjeta } from "../components/FormularioTarjeta";
import { FormularioFacturacion } from "../components/FormularioFacturacion";

export default function KioscoLlevar() {
  const { menuItems, categorias, agregarPedido } = useApp();
  const [categoriaActual, setCategoriaActual] = useState("Todas");
  const [carrito, setCarrito] = useState<OrderItem[]>([]);
  const [vistaCarrito, setVistaCarrito] = useState(false);
  const [metodoPago, setMetodoPago] = useState<"tarjeta" | "efectivo" | null>(null);
  const [tarjetaValida, setTarjetaValida] = useState(false);
  const [nit, setNit] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [facturacionCompleta, setFacturacionCompleta] = useState(false);
  const [ofertasDisponibles, setOfertasDisponibles] = useState<Oferta[]>([]);
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState("");

  const itemsFiltrados = categoriaActual === "Todas" 
    ? menuItems 
    : menuItems.filter(item => item.categoria === categoriaActual);

  const agregarAlCarrito = (item: any) => {
    const itemExistente = carrito.find(i => i.id === item.id);
    if (itemExistente) {
      setCarrito(carrito.map(i => 
        i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      setCarrito([...carrito, { ...item, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id: string, delta: number) => {
    setCarrito(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + delta;
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      }).filter(item => item.cantidad > 0);
    });
  };

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const descuento = ofertaSeleccionada ? (total * ofertaSeleccionada.descuento) / 100 : 0;
  const totalConDescuento = total - descuento;

  const confirmarPedido = () => {
    const numPedido = Date.now().toString().slice(-6);
    setNumeroPedido(numPedido);
    
    const nuevoPedido: Order = {
      id: numPedido,
      items: carrito,
      total,
      descuentoAplicado: descuento,
      totalConDescuento: totalConDescuento,
      tipo: "llevar",
      metodoPago,
      estado: "pendiente",
      timestamp: Date.now(),
      nit: nit || undefined,
      nombreCliente: nombreCliente || undefined,
      ofertaAplicada: ofertaSeleccionada?.nombre
    };
    
    agregarPedido(nuevoPedido);
    
    setPedidoConfirmado(true);
    setTimeout(() => {
      setCarrito([]);
      setMetodoPago(null);
      setTarjetaValida(false);
      setNit("");
      setNombreCliente("");
      setFacturacionCompleta(false);
      setOfertasDisponibles([]);
      setOfertaSeleccionada(null);
      setPedidoConfirmado(false);
      setVistaCarrito(false);
    }, 3000);
  };

  if (pedidoConfirmado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <Card className="max-w-lg w-full mx-4">
          <CardContent className="text-center p-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl mb-4 text-green-700">¡Pedido Confirmado!</h2>
            <p className="text-xl text-gray-600 mb-2">Número de orden: #{numeroPedido}</p>
            <p className="text-gray-500">Tu pedido estará listo en breve</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-amber-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="lg" className="text-white hover:bg-amber-700">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl">Kiosco - Ordena Para Llevar</h1>
              <p className="text-amber-100">Selecciona tus productos favoritos</p>
            </div>
          </div>
          <Button 
            onClick={() => setVistaCarrito(!vistaCarrito)}
            className="bg-white text-amber-600 hover:bg-amber-50 text-lg px-6 py-6"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            Carrito ({carrito.reduce((sum, item) => sum + item.cantidad, 0)})
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {!vistaCarrito ? (
          <>
            {/* Categorías */}
            <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
              {categorias.map(cat => (
                <Button
                  key={cat}
                  onClick={() => setCategoriaActual(cat)}
                  variant={categoriaActual === cat ? "default" : "outline"}
                  size="lg"
                  className="text-lg px-6 whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itemsFiltrados.map(item => (
                <Card 
                  key={item.id} 
                  className="hover:shadow-xl transition cursor-pointer"
                  onClick={() => agregarAlCarrito(item)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{item.nombre}</CardTitle>
                      <Badge className="bg-green-600 text-lg px-3 py-1">
                        ${item.precio.toFixed(2)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{item.descripcion}</p>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full text-lg py-6" size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Agregar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* Vista del Carrito */
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl mb-6">Tu Carrito</h2>
            
            {carrito.length === 0 ? (
              <Card>
                <CardContent className="text-center p-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl text-gray-500">Tu carrito está vacío</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="mb-6">
                  <CardContent className="p-6">
                    {carrito.map(item => (
                      <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-0">
                        <div className="flex-1">
                          <h3 className="text-xl">{item.nombre}</h3>
                          <p className="text-gray-500">${item.precio.toFixed(2)} c/u</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => actualizarCantidad(item.id, -1)}
                            className="h-10 w-10"
                          >
                            <Minus className="w-5 h-5" />
                          </Button>
                          <span className="text-2xl w-12 text-center">{item.cantidad}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => actualizarCantidad(item.id, 1)}
                            className="h-10 w-10"
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                          <span className="text-xl w-24 text-right">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-6 mt-6 border-t-2">
                      <span className="text-2xl">Total:</span>
                      <span className="text-3xl text-green-600">${total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Método de Pago */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-2xl">Selecciona Método de Pago</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={metodoPago === "tarjeta" ? "default" : "outline"}
                        onClick={() => setMetodoPago("tarjeta")}
                        className="h-32 text-xl flex-col"
                        size="lg"
                      >
                        <CreditCard className="w-12 h-12 mb-2" />
                        Tarjeta
                      </Button>
                      <Button
                        variant={metodoPago === "efectivo" ? "default" : "outline"}
                        onClick={() => setMetodoPago("efectivo")}
                        className="h-32 text-xl flex-col"
                        size="lg"
                      >
                        <Banknote className="w-12 h-12 mb-2" />
                        Efectivo en Caja
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {(metodoPago === "tarjeta" || metodoPago === "efectivo") && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Receipt className="w-6 h-6" />
                        Datos de Facturación
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormularioFacturacion
                        onDatosCompletos={(nitVal, nombreVal) => {
                          setNit(nitVal);
                          setNombreCliente(nombreVal);
                          setFacturacionCompleta(true);
                        }}
                        onOfertasDetectadas={(ofertas) => {
                          setOfertasDisponibles(ofertas);
                          if (ofertas.length > 0 && !ofertaSeleccionada) {
                            setOfertaSeleccionada(ofertas[0]);
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                )}

                {ofertasDisponibles.length > 0 && (
                  <Card className="mb-6 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300">
                    <CardHeader>
                      <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
                        <Gift className="w-6 h-6" />
                        ¡Ofertas Disponibles!
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {ofertasDisponibles.map(oferta => (
                        <Card 
                          key={oferta.id}
                          className={`cursor-pointer transition ${
                            ofertaSeleccionada?.id === oferta.id 
                              ? 'border-2 border-purple-500 bg-white' 
                              : 'hover:border-purple-300'
                          }`}
                          onClick={() => setOfertaSeleccionada(oferta)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-lg text-purple-900">{oferta.nombre}</h4>
                                <p className="text-sm text-gray-600">
                                  {oferta.tipo === "por-compras" 
                                    ? `Cada ${oferta.cantidadRequerida} compras` 
                                    : `Por gastar $${oferta.cantidadRequerida}`}
                                </p>
                              </div>
                              <Badge className="bg-purple-600 text-lg px-4 py-2">
                                {oferta.descuento}% OFF
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {descuento > 0 && (
                  <Card className="mb-6 bg-green-50 border-green-300">
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-lg">
                          <span>Subtotal:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg text-purple-600">
                          <span className="flex items-center gap-2">
                            <Gift className="w-5 h-5" />
                            Descuento ({ofertaSeleccionada?.descuento}%):
                          </span>
                          <span>-${descuento.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t-2 border-green-300">
                          <span className="text-2xl font-bold">Total a pagar:</span>
                          <span className="text-3xl text-green-600 font-bold">${totalConDescuento.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {metodoPago === "tarjeta" && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-2xl">Datos de la Tarjeta</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormularioTarjeta
                        onValidarTarjeta={() => setTarjetaValida(true)}
                        onInvalidarTarjeta={() => setTarjetaValida(false)}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setVistaCarrito(false)}
                    size="lg"
                    className="flex-1 text-xl py-6"
                  >
                    Seguir Comprando
                  </Button>
                  <Button
                    onClick={confirmarPedido}
                    disabled={!metodoPago || (metodoPago === "tarjeta" && !tarjetaValida)}
                    size="lg"
                    className="flex-1 text-xl py-6 bg-green-600 hover:bg-green-700"
                  >
                    Confirmar Pedido
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}