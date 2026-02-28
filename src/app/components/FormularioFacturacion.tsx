import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { useApp } from "../context/AppContext";
import { Gift } from "lucide-react";

interface FormularioFacturacionProps {
  onDatosCompletos: (nit: string, nombre: string) => void;
  onOfertasDetectadas: (ofertas: any[]) => void;
}

export function FormularioFacturacion({ onDatosCompletos, onOfertasDetectadas }: FormularioFacturacionProps) {
  const { obtenerCliente, obtenerOfertasAplicables } = useApp();
  const [nit, setNit] = useState("");
  const [nombre, setNombre] = useState("");
  const [clienteInfo, setClienteInfo] = useState<any>(null);

  const handleNitChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setNit(upperValue);
    
    // Si tiene NIT registrado, autocompletar nombre
    if (upperValue !== "CF" && upperValue.length > 3) {
      const cliente = obtenerCliente(upperValue);
      if (cliente && !nombre) {
        setNombre(cliente.nombre);
        setClienteInfo(cliente);
        
        // Verificar ofertas disponibles
        const ofertasDisponibles = obtenerOfertasAplicables(upperValue);
        onOfertasDetectadas(ofertasDisponibles);
      }
    }
  };

  const handleNombreChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setNombre(upperValue);
    
    // Verificar si los datos están completos
    if ((nit === "CF" || nit.length > 0) && upperValue.length > 0) {
      onDatosCompletos(nit, upperValue);
      
      // Verificar ofertas disponibles si el NIT existe
      if (nit !== "CF") {
        const cliente = obtenerCliente(nit);
        const ofertasDisponibles = obtenerOfertasAplicables(nit);
        
        if (cliente) {
          setClienteInfo(cliente);
        }
        
        onOfertasDetectadas(ofertasDisponibles);
      } else {
        setClienteInfo(null);
        onOfertasDetectadas([]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nit">NIT o CF</Label>
        <Input
          id="nit"
          value={nit}
          onChange={(e) => handleNitChange(e.target.value)}
          placeholder="Ingrese NIT o CF"
          className="text-lg"
        />
      </div>
      
      <div>
        <Label htmlFor="nombre-factura">Nombre para Factura</Label>
        <Input
          id="nombre-factura"
          value={nombre}
          onChange={(e) => handleNombreChange(e.target.value)}
          placeholder="NOMBRE COMPLETO"
          className="text-lg"
        />
      </div>

      {clienteInfo && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Cliente Frecuente</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Compras realizadas:</p>
                <p className="font-semibold text-purple-700">{clienteInfo.totalCompras}</p>
              </div>
              <div>
                <p className="text-gray-600">Total gastado:</p>
                <p className="font-semibold text-purple-700">${clienteInfo.totalGastado.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}