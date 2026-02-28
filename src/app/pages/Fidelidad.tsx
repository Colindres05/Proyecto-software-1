import { useState } from "react";
import { ArrowLeft, Users, Gift, Plus, Edit2, Trash2, Save } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { useApp } from "../context/AppContext";
import { type Oferta } from "../data/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function Fidelidad() {
  const { clientes, ofertas, agregarOferta, actualizarOferta, eliminarOferta } = useApp();
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [ofertaEditando, setOfertaEditando] = useState<Oferta | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "por-compras" as "por-compras" | "por-monto",
    cantidadRequerida: "",
    descuento: "",
    activa: true
  });

  const abrirDialogNueva = () => {
    setOfertaEditando(null);
    setFormData({
      nombre: "",
      tipo: "por-compras",
      cantidadRequerida: "",
      descuento: "",
      activa: true
    });
    setDialogAbierto(true);
  };

  const abrirDialogEditar = (oferta: Oferta) => {
    setOfertaEditando(oferta);
    setFormData({
      nombre: oferta.nombre,
      tipo: oferta.tipo,
      cantidadRequerida: oferta.cantidadRequerida.toString(),
      descuento: oferta.descuento.toString(),
      activa: oferta.activa
    });
    setDialogAbierto(true);
  };

  const guardarOferta = () => {
    if (!formData.nombre || !formData.cantidadRequerida || !formData.descuento) return;

    const oferta: Oferta = {
      id: ofertaEditando?.id || Date.now().toString(),
      nombre: formData.nombre,
      tipo: formData.tipo,
      cantidadRequerida: parseFloat(formData.cantidadRequerida),
      descuento: parseFloat(formData.descuento),
      activa: formData.activa
    };

    if (ofertaEditando) {
      actualizarOferta(oferta);
    } else {
      agregarOferta(oferta);
    }

    setDialogAbierto(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="lg" className="text-white hover:bg-purple-700">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl">Programa de Fidelidad</h1>
              <p className="text-purple-100">Gestión de Clientes y Ofertas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="clientes" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="clientes" className="text-lg">
              <Users className="w-5 h-5 mr-2" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="ofertas" className="text-lg">
              <Gift className="w-5 h-5 mr-2" />
              Ofertas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clientes">
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">{clientes.length}</div>
                  <div className="text-gray-600">Total Clientes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">
                    {clientes.reduce((sum, c) => sum + c.totalCompras, 0)}
                  </div>
                  <div className="text-gray-600">Compras Totales</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">
                    ${clientes.reduce((sum, c) => sum + c.totalGastado, 0).toFixed(2)}
                  </div>
                  <div className="text-gray-600">Total Recaudado</div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Clientes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Clientes Frecuentes ({clientes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientes.sort((a, b) => b.totalGastado - a.totalGastado).map(cliente => (
                    <div 
                      key={cliente.nit}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold">{cliente.nombre}</h3>
                          <Badge variant="outline">NIT: {cliente.nit}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="text-sm text-gray-500">Compras</div>
                          <div className="text-xl font-semibold text-purple-600">
                            {cliente.totalCompras}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Gastado</div>
                          <div className="text-xl font-semibold text-green-600">
                            ${cliente.totalGastado.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Promedio</div>
                          <div className="text-xl font-semibold">
                            ${(cliente.totalGastado / cliente.totalCompras).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {clientes.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No hay clientes registrados aún
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ofertas">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl">Ofertas Activas</h2>
              <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={abrirDialogNueva}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Oferta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {ofertaEditando ? "Editar Oferta" : "Nueva Oferta"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="nombre-oferta">Nombre de la Oferta</Label>
                      <Input
                        id="nombre-oferta"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: 4ta Compra Gratis"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tipo-oferta">Tipo de Oferta</Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value: "por-compras" | "por-monto") => 
                          setFormData({ ...formData, tipo: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="por-compras">Por Número de Compras</SelectItem>
                          <SelectItem value="por-monto">Por Monto Gastado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="cantidad">
                        {formData.tipo === "por-compras" 
                          ? "Número de Compras" 
                          : "Monto Requerido ($)"}
                      </Label>
                      <Input
                        id="cantidad"
                        type="number"
                        value={formData.cantidadRequerida}
                        onChange={(e) => setFormData({ ...formData, cantidadRequerida: e.target.value })}
                        placeholder={formData.tipo === "por-compras" ? "4" : "500"}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="descuento">Descuento (%)</Label>
                      <Input
                        id="descuento"
                        type="number"
                        value={formData.descuento}
                        onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
                        placeholder="10"
                        min="0"
                        max="100"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="activa"
                        checked={formData.activa}
                        onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="activa">Oferta activa</Label>
                    </div>
                    
                    <Button onClick={guardarOferta} className="w-full" size="lg">
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Lista de Ofertas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ofertas.map(oferta => (
                <Card 
                  key={oferta.id}
                  className={`${oferta.activa ? 'border-purple-300' : 'opacity-50'}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{oferta.nombre}</CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          <Badge className="bg-purple-600">{oferta.descuento}% OFF</Badge>
                          <Badge variant="outline">
                            {oferta.tipo === "por-compras" 
                              ? `Cada ${oferta.cantidadRequerida} compras` 
                              : `Por gastar $${oferta.cantidadRequerida}`}
                          </Badge>
                          {oferta.activa ? (
                            <Badge className="bg-green-600">Activa</Badge>
                          ) : (
                            <Badge variant="outline">Inactiva</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => abrirDialogEditar(oferta)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm(`¿Eliminar oferta "${oferta.nombre}"?`)) {
                              eliminarOferta(oferta.id);
                            }
                          }}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
              
              {ofertas.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="text-center py-12">
                    <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No hay ofertas creadas aún</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
