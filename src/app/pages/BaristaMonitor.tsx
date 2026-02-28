import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Package, CheckCircle2, Coffee, Calendar } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useApp } from "../context/AppContext";
import type { Order } from "../data/menu";

export default function BaristaMonitor() {
  const { pedidos, actualizarEstadoPedido } = useApp();
  const [tiempoActual, setTiempoActual] = useState(Date.now());

  // Actualizar el tiempo cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoActual(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Verificar y mover pedidos a "listo" cuando el temporizador termine
  useEffect(() => {
    pedidos.forEach(pedido => {
      if (pedido.estado === "preparando" && pedido.tiempoPreparacionInicio && pedido.tiempoPreparacionTotal) {
        const tiempoTranscurrido = Date.now() - pedido.tiempoPreparacionInicio;
        if (tiempoTranscurrido >= pedido.tiempoPreparacionTotal) {
          actualizarEstadoPedido(pedido.id, "listo");
        }
      }
    });
  }, [tiempoActual, pedidos, actualizarEstadoPedido]);

  const cambiarEstado = (id: string, nuevoEstado: Order["estado"]) => {
    actualizarEstadoPedido(id, nuevoEstado);
  };

  const calcularTiempoEspera = (timestamp: number) => {
    const diferencia = Math.floor((tiempoActual - timestamp) / 1000 / 60);
    return `${diferencia} min`;
  };

  const calcularTiempoRestante = (pedido: Order) => {
    if (!pedido.tiempoPreparacionInicio || !pedido.tiempoPreparacionTotal) return null;
    
    const tiempoTranscurrido = Date.now() - pedido.tiempoPreparacionInicio;
    const tiempoRestante = Math.max(0, pedido.tiempoPreparacionTotal - tiempoTranscurrido);
    
    const minutos = Math.floor(tiempoRestante / 1000 / 60);
    const segundos = Math.floor((tiempoRestante / 1000) % 60);
    
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  };

  const calcularProgreso = (pedido: Order) => {
    if (!pedido.tiempoPreparacionInicio || !pedido.tiempoPreparacionTotal) return 0;
    
    const tiempoTranscurrido = Date.now() - pedido.tiempoPreparacionInicio;
    const progreso = Math.min(100, (tiempoTranscurrido / pedido.tiempoPreparacionTotal) * 100);
    
    return progreso;
  };

  // Ordenar por FIFO (primero en entrar, primero en salir)
  const pedidosOrdenados = [...pedidos].sort((a, b) => a.timestamp - b.timestamp);

  const pedidosPendientes = pedidosOrdenados.filter(p => p.estado === "pendiente");
  const pedidosPreparando = pedidosOrdenados.filter(p => p.estado === "preparando");
  const pedidosListos = pedidosOrdenados.filter(p => p.estado === "listo");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-purple-600 p-6 shadow-lg">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="lg" className="text-white hover:bg-purple-700">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl flex items-center gap-3">
                <Coffee className="w-8 h-8" />
                Monitor del Barista
              </h1>
              <p className="text-purple-100">Sistema FIFO - Primero en entrar, primero en preparar</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl">{new Date().toLocaleTimeString('es-MX')}</div>
            <div className="text-purple-100">Pedidos Activos: {pedidos.filter(p => p.estado !== "listo").length}</div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna: Pendientes */}
          <div>
            <div className="bg-red-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6" />
                <h2 className="text-2xl">Pendientes</h2>
              </div>
              <Badge className="bg-white text-red-600 text-lg px-3 py-1">
                {pedidosPendientes.length}
              </Badge>
            </div>
            <div className="space-y-4 mt-4">
              {pedidosPendientes.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="text-center p-8 text-gray-400">
                    No hay pedidos pendientes
                  </CardContent>
                </Card>
              ) : (
                pedidosPendientes.map(pedido => (
                  <Card key={pedido.id} className="bg-gray-800 border-red-500 border-2">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-white">
                            Orden #{pedido.id}
                          </CardTitle>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge className={pedido.tipo === "llevar" ? "bg-blue-600" : "bg-green-600"}>
                              {pedido.tipo === "llevar" ? "Para Llevar" : `Mesa ${pedido.numeroMesa}`}
                            </Badge>
                            {pedido.metodoPago && (
                              <Badge variant="outline" className="text-white border-white">
                                {pedido.metodoPago === "tarjeta" ? "Tarjeta" : "Efectivo"}
                              </Badge>
                            )}
                            {pedido.horaProgramada && (
                              <Badge className="bg-yellow-600 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Programado
                              </Badge>
                            )}
                          </div>
                          {pedido.horaProgramada && (
                            <div className="mt-2 text-sm text-yellow-300 flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Para: {new Date(pedido.horaProgramada).toLocaleString("es-MX", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg text-red-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {calcularTiempoEspera(pedido.timestamp)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {pedido.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-gray-300">
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span>${item.precio * item.cantidad}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-600 mb-4">
                        <span className="text-lg text-white">Total:</span>
                        <span className="text-xl text-white">${pedido.total}</span>
                      </div>
                      <Button
                        onClick={() => cambiarEstado(pedido.id, "preparando")}
                        className="w-full bg-orange-600 hover:bg-orange-700"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Comenzar a Preparar
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Columna: En Preparación */}
          <div>
            <div className="bg-orange-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6" />
                <h2 className="text-2xl">En Preparación</h2>
              </div>
              <Badge className="bg-white text-orange-600 text-lg px-3 py-1">
                {pedidosPreparando.length}
              </Badge>
            </div>
            <div className="space-y-4 mt-4">
              {pedidosPreparando.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="text-center p-8 text-gray-400">
                    No hay pedidos en preparación
                  </CardContent>
                </Card>
              ) : (
                pedidosPreparando.map(pedido => (
                  <Card key={pedido.id} className="bg-gray-800 border-orange-500 border-2">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-white">
                            Orden #{pedido.id}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge className={pedido.tipo === "llevar" ? "bg-blue-600" : "bg-green-600"}>
                              {pedido.tipo === "llevar" ? "Para Llevar" : `Mesa ${pedido.numeroMesa}`}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg text-orange-400 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {calcularTiempoEspera(pedido.timestamp)}
                          </div>
                          {calcularTiempoRestante(pedido) && (
                            <div className="text-sm text-orange-400 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Restante: {calcularTiempoRestante(pedido)}
                            </div>
                          )}
                          {calcularProgreso(pedido) > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                              <div
                                className="bg-orange-600 h-2.5 rounded-full"
                                style={{ width: `${calcularProgreso(pedido)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {pedido.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-gray-300">
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span>${item.precio * item.cantidad}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-600 mb-4">
                        <span className="text-lg text-white">Total:</span>
                        <span className="text-xl text-white">${pedido.total}</span>
                      </div>
                      <Button
                        onClick={() => cambiarEstado(pedido.id, "listo")}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Marcar como Listo
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Columna: Listos */}
          <div>
            <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <h2 className="text-2xl">Listos</h2>
              </div>
              <Badge className="bg-white text-green-600 text-lg px-3 py-1">
                {pedidosListos.length}
              </Badge>
            </div>
            <div className="space-y-4 mt-4">
              {pedidosListos.length === 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="text-center p-8 text-gray-400">
                    No hay pedidos listos
                  </CardContent>
                </Card>
              ) : (
                pedidosListos.map(pedido => (
                  <Card key={pedido.id} className="bg-gray-800 border-green-500 border-2">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-white">
                            Orden #{pedido.id}
                          </CardTitle>
                          <div className="flex gap-2 mt-2">
                            <Badge className={pedido.tipo === "llevar" ? "bg-blue-600" : "bg-green-600"}>
                              {pedido.tipo === "llevar" ? "Para Llevar" : `Mesa ${pedido.numeroMesa}`}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Completado
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {pedido.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-gray-300">
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span>${item.precio * item.cantidad}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-600">
                        <span className="text-lg text-white">Total:</span>
                        <span className="text-xl text-white">${pedido.total}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}