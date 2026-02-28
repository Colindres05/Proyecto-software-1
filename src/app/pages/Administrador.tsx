import { useState } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, Save, Gift } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { useApp } from "../context/AppContext";
import { type MenuItem } from "../data/menu";
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
import { Textarea } from "../components/ui/textarea";

export default function Administrador() {
  const { menuItems, categorias, actualizarMenuItem, agregarMenuItem, eliminarMenuItem, agregarCategoria } = useApp();
  const [dialogAbierto, setDialogAbierto] = useState(false);
  const [dialogCategoriaAbierto, setDialogCategoriaAbierto] = useState(false);
  const [itemEditando, setItemEditando] = useState<MenuItem | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "Bebidas Calientes",
    precio: "",
    descripcion: "",
    tiempoPreparacion: ""
  });

  const itemsFiltrados = filtroCategoria === "Todas" 
    ? menuItems 
    : menuItems.filter(item => item.categoria === filtroCategoria);

  const abrirDialogNuevo = () => {
    setItemEditando(null);
    setFormData({
      nombre: "",
      categoria: "Bebidas Calientes",
      precio: "",
      descripcion: "",
      tiempoPreparacion: ""
    });
    setDialogAbierto(true);
  };

  const abrirDialogEditar = (item: MenuItem) => {
    setItemEditando(item);
    setFormData({
      nombre: item.nombre,
      categoria: item.categoria,
      precio: item.precio.toString(),
      descripcion: item.descripcion || "",
      tiempoPreparacion: item.tiempoPreparacion?.toString() || ""
    });
    setDialogAbierto(true);
  };

  const guardarItem = () => {
    if (!formData.nombre || !formData.precio) return;

    const item: MenuItem = {
      id: itemEditando?.id || Date.now().toString(),
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: parseFloat(formData.precio),
      descripcion: formData.descripcion,
      tiempoPreparacion: formData.tiempoPreparacion ? parseInt(formData.tiempoPreparacion) : 5
    };

    if (itemEditando) {
      actualizarMenuItem(item);
    } else {
      agregarMenuItem(item);
    }

    setDialogAbierto(false);
  };

  const agregarNuevaCategoria = () => {
    if (!nuevaCategoria) return;
    agregarCategoria(nuevaCategoria);
    setNuevaCategoria("");
    setDialogCategoriaAbierto(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="lg" className="text-white hover:bg-indigo-700">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl">Panel de Administrador</h1>
              <p className="text-indigo-100">Gestión del Menú y Productos</p>
            </div>
          </div>
          <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
            <DialogTrigger asChild>
              <Button 
                onClick={abrirDialogNuevo}
                className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-6 py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {itemEditando ? "Editar Producto" : "Nuevo Producto"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Producto</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Café Americano"
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.filter(c => c !== "Todas").map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="precio">Precio ($)</Label>
                  <Input
                    id="precio"
                    type="number"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción del producto"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tiempoPreparacion">Tiempo de Preparación (minutos) (Opcional)</Label>
                  <Input
                    id="tiempoPreparacion"
                    type="number"
                    value={formData.tiempoPreparacion}
                    onChange={(e) => setFormData({ ...formData, tiempoPreparacion: e.target.value })}
                    placeholder="0"
                    step="1"
                  />
                </div>
                
                <Button onClick={guardarItem} className="w-full" size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filtros */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {categorias.map(cat => (
            <Button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              variant={filtroCategoria === cat ? "default" : "outline"}
              size="lg"
              className="whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
          <Dialog open={dialogCategoriaAbierto} onOpenChange={setDialogCategoriaAbierto}>
            <DialogTrigger asChild>
              <Button
                className="bg-white text-indigo-600 hover:bg-indigo-50 text-lg px-6 py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Categoría
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Nueva Categoría
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="nuevaCategoria">Nombre de la Categoría</Label>
                  <Input
                    id="nuevaCategoria"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    placeholder="Ej: Postres"
                  />
                </div>
                
                <Button onClick={agregarNuevaCategoria} className="w-full" size="lg">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{menuItems.length}</div>
              <div className="text-gray-600">Total Productos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">
                {menuItems.filter(i => i.categoria === "Bebidas Calientes").length}
              </div>
              <div className="text-gray-600">Bebidas Calientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">
                {menuItems.filter(i => i.categoria === "Bebidas Frías").length}
              </div>
              <div className="text-gray-600">Bebidas Frías</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">
                {menuItems.filter(i => i.categoria === "Alimentos").length}
              </div>
              <div className="text-gray-600">Alimentos</div>
            </CardContent>
          </Card>
        </div>

        {/* Programa de Fidelidad */}
        <Link to="/fidelidad" className="block mb-6">
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 hover:shadow-xl transition cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Gift className="w-12 h-12 text-purple-600" />
                  <div>
                    <h3 className="text-2xl font-semibold text-purple-900">Programa de Fidelidad</h3>
                    <p className="text-purple-700">Gestiona clientes, ofertas y promociones</p>
                  </div>
                </div>
                <div className="text-purple-900 text-xl">→</div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Lista de Productos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Productos ({itemsFiltrados.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {itemsFiltrados.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg">{item.nombre}</h3>
                      <Badge variant="outline">{item.categoria}</Badge>
                    </div>
                    {item.descripcion && (
                      <p className="text-sm text-gray-500">{item.descripcion}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-semibold text-green-600">
                      ${item.precio.toFixed(2)}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirDialogEditar(item)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm(`¿Eliminar "${item.nombre}"?`)) {
                            eliminarMenuItem(item.id);
                          }
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {itemsFiltrados.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No hay productos en esta categoría
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}