import { useState } from "react";
import { ArrowLeft, Plus, Minus, ShoppingCart, Check, Clock, Calendar, CreditCard } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { useApp } from "../context/AppContext";
import { type OrderItem, type Order } from "../data/menu";
import { FormularioTarjeta } from "../components/FormularioTarjeta";

export default function MesaQR() {
  const { menuItems, categorias, agregarPedido } = useApp();
  const [numeroMesa] = useState(Math.floor(Math.random() * 20) + 1);
  const [categoriaActual, setCategoriaActual] = useState("Todas");
  const [carrito, setCarrito] = useState<OrderItem[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [paso, setPaso] = useState<"carrito" | "tipo-pedido" | "programar" | "pago">("carrito");
  const [tipoPedido, setTipoPedido] = useState<"inmediato" | "programado" | null>(null);
  const [fechaProgramada, setFechaProgramada] = useState("");
  const [horaProgramada, setHoraProgramada] = useState("");
  const [tarjetaValida, setTarjetaValida] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
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

  const continuarAPago = () => {
    if (tipoPedido === "inmediato") {
      setPaso("pago");
    } else if (tipoPedido === "programado") {
      setPaso("programar");
    }
  };

  const confirmarProgramacion = () => {
    if (!fechaProgramada || !horaProgramada) return;

    // Validar que la fecha/hora programada no sea en el pasado
    const fechaHora = new Date(`${fechaProgramada}T${horaProgramada}`);
    const ahora = new Date();

    if (fechaHora <= ahora) {
      alert("La fecha y hora seleccionada ya pasó. Por favor selecciona una fecha y hora futura.");
      return;
    }

    setPaso("pago");
  };

  const enviarPedido = () => {
    const numPedido = Date.now().toString().slice(-6);
    setNumeroPedido(numPedido);

    let timestampProgramado = Date.now();
    if (tipoPedido === "programado" && fechaProgramada && horaProgramada) {
      const fechaHora = new Date(`${fechaProgramada}T${horaProgramada}`);
      timestampProgramado = fechaHora.getTime();
    }

    const nuevoPedido: Order = {
      id: numPedido,
      items: carrito,
      total,
      tipo: "mesa",
      numeroMesa,
      estado: "pendiente",
      timestamp: Date.now(),
      horaProgramada: tipoPedido === "programado" ? timestampProgramado : undefined
    };

    agregarPedido(nuevoPedido);

    setPedidoEnviado(true);
    setTimeout(() => {
      setCarrito([]);
      setTipoPedido(null);
      setFechaProgramada("");
      setHoraProgramada("");
      setTarjetaValida(false);
      setPedidoEnviado(false);
      setMostrarCarrito(false);
      setPaso("carrito");
    }, 3000);
  };

  if (pedidoEnviado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl mb-3 text-green-700">¡Pedido Enviado!</h2>
            <p className="text-lg mb-2">Mesa #{numeroMesa}</p>
            <p className="text-lg mb-2">Orden: #{numeroPedido}</p>
            {tipoPedido === "programado" && (
              <p className="text-gray-600">
                Programado para: {new Date(fechaProgramada + "T" + horaProgramada).toLocaleString("es-MX")}
              </p>
            )}
            {tipoPedido === "inmediato" && (
              <p className="text-gray-600">Tu orden llegará pronto a tu mesa</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header - Optimizado para móvil */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-green-700 p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl">Menú Digital</h1>
              <p className="text-sm text-green-100">Mesa #{numeroMesa}</p>
            </div>
          </div>
          <Badge className="bg-white text-green-600 text-base px-3 py-2">
            QR Escaneado
          </Badge>
        </div>
        
        {/* Categorías - Scroll horizontal */}
        {!mostrarCarrito && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categorias.map(cat => (
              <Button
                key={cat}
                onClick={() => setCategoriaActual(cat)}
                variant={categoriaActual === cat ? "secondary" : "ghost"}
                size="sm"
                className={`whitespace-nowrap text-sm ${
                  categoriaActual === cat 
                    ? "bg-white text-green-700" 
                    : "text-white hover:bg-green-700"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {!mostrarCarrito ? (
          /* Lista de Productos */
          <div className="space-y-3">
            {itemsFiltrados.map(item => {
              const itemEnCarrito = carrito.find(i => i.id === item.id);
              
              return (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg mb-1">{item.nombre}</h3>
                        <p className="text-sm text-gray-500 mb-2">{item.descripcion}</p>
                        <Badge className="bg-green-600">${item.precio.toFixed(2)}</Badge>
                      </div>
                    </div>
                    
                    {itemEnCarrito ? (
                      <div className="flex items-center justify-between mt-3 bg-green-50 rounded-lg p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actualizarCantidad(item.id, -1)}
                          className="h-9 w-9 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-lg px-4">{itemEnCarrito.cantidad}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actualizarCantidad(item.id, 1)}
                          className="h-9 w-9 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => agregarAlCarrito(item)}
                        className="w-full mt-3 bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Vista del Carrito y Procesos */
          <div>
            {paso === "carrito" && (
              <>
                <h2 className="text-2xl mb-4">Tu Orden</h2>
                
                {carrito.length === 0 ? (
                  <Card>
                    <CardContent className="text-center p-8">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-500">No has agregado productos</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        {carrito.map(item => (
                          <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                            <div className="flex-1">
                              <h3 className="text-base">{item.nombre}</h3>
                              <p className="text-sm text-gray-500">${item.precio.toFixed(2)} × {item.cantidad}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => actualizarCantidad(item.id, -1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => actualizarCantidad(item.id, 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <span className="ml-3 w-16 text-right">${(item.precio * item.cantidad).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-4 mt-4 border-t-2">
                          <span className="text-xl">Total:</span>
                          <span className="text-2xl text-green-600">${total.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setMostrarCarrito(false)}
                        className="flex-1"
                      >
                        Seguir Ordenando
                      </Button>
                      <Button
                        onClick={() => setPaso("tipo-pedido")}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Continuar
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}

            {paso === "tipo-pedido" && (
              <>
                <h2 className="text-2xl mb-4">Tipo de Pedido</h2>
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Button
                        variant={tipoPedido === "inmediato" ? "default" : "outline"}
                        onClick={() => setTipoPedido("inmediato")}
                        className="w-full h-24 text-lg flex-col"
                      >
                        <Clock className="w-8 h-8 mb-2" />
                        Pedido Inmediato
                        <span className="text-sm opacity-80">Recibir ahora en la mesa</span>
                      </Button>
                      <Button
                        variant={tipoPedido === "programado" ? "default" : "outline"}
                        onClick={() => setTipoPedido("programado")}
                        className="w-full h-24 text-lg flex-col"
                      >
                        <Calendar className="w-8 h-8 mb-2" />
                        Pedido Programado
                        <span className="text-sm opacity-80">Seleccionar fecha y hora</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setPaso("carrito")}
                    className="flex-1"
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={continuarAPago}
                    disabled={!tipoPedido}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Continuar
                  </Button>
                </div>
              </>
            )}

            {paso === "programar" && (
              <>
                <h2 className="text-2xl mb-4">Programar Pedido</h2>
                <Card className="mb-4">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={fechaProgramada}
                        onChange={(e) => setFechaProgramada(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="text-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hora">Hora</Label>
                      <Input
                        id="hora"
                        type="time"
                        value={horaProgramada}
                        onChange={(e) => setHoraProgramada(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    {fechaProgramada && horaProgramada && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          Tu pedido estará listo el:
                        </p>
                        <p className="text-lg">
                          {new Date(fechaProgramada + "T" + horaProgramada).toLocaleString("es-MX", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setPaso("tipo-pedido")}
                    className="flex-1"
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={confirmarProgramacion}
                    disabled={!fechaProgramada || !horaProgramada}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Continuar
                  </Button>
                </div>
              </>
            )}

            {paso === "pago" && (
              <>
                <h2 className="text-2xl mb-4">Método de Pago</h2>
                
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Pago con Tarjeta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormularioTarjeta
                      onValidarTarjeta={() => setTarjetaValida(true)}
                      onInvalidarTarjeta={() => setTarjetaValida(false)}
                    />
                  </CardContent>
                </Card>

                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl">Total a pagar:</span>
                      <span className="text-2xl text-green-600">${total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setPaso(tipoPedido === "programado" ? "programar" : "tipo-pedido")}
                    className="flex-1"
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={enviarPedido}
                    disabled={!tarjetaValida}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar Pedido
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Botón Flotante del Carrito */}
      {carrito.length > 0 && !mostrarCarrito && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <Button
            onClick={() => setMostrarCarrito(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-14 text-lg shadow-xl"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Ver Carrito ({carrito.reduce((sum, item) => sum + item.cantidad, 0)})
            <span className="ml-auto">${total.toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  );
}