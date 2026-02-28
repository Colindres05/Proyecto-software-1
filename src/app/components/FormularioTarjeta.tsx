import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface FormularioTarjetaProps {
  onValidarTarjeta: () => void;
  onInvalidarTarjeta: () => void;
}

export function FormularioTarjeta({ onValidarTarjeta, onInvalidarTarjeta }: FormularioTarjetaProps) {
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [nombreTitular, setNombreTitular] = useState("");
  const [fechaExpiracion, setFechaExpiracion] = useState("");
  const [cvv, setCvv] = useState("");

  const formatearNumeroTarjeta = (valor: string) => {
    const numeros = valor.replace(/\s/g, "");
    const grupos = numeros.match(/.{1,4}/g);
    return grupos ? grupos.join(" ") : "";
  };

  const formatearFecha = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length >= 2) {
      return numeros.substring(0, 2) + "/" + numeros.substring(2, 4);
    }
    return numeros;
  };

  useEffect(() => {
    const completo = 
      numeroTarjeta.replace(/\s/g, "").length === 16 &&
      nombreTitular.length > 0 &&
      fechaExpiracion.length === 5 &&
      cvv.length === 3;
    
    if (completo) {
      onValidarTarjeta();
    } else {
      onInvalidarTarjeta();
    }
  }, [numeroTarjeta, nombreTitular, fechaExpiracion, cvv, onValidarTarjeta, onInvalidarTarjeta]);

  const handleNumeroTarjeta = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\s/g, "");
    if (valor.length <= 16 && /^\d*$/.test(valor)) {
      setNumeroTarjeta(formatearNumeroTarjeta(valor));
    }
  };

  const handleFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.replace(/\D/g, "");
    if (valor.length <= 4) {
      setFechaExpiracion(formatearFecha(valor));
    }
  };

  const handleCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (valor.length <= 3 && /^\d*$/.test(valor)) {
      setCvv(valor);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <div>
        <Label htmlFor="numero">Número de Tarjeta</Label>
        <Input
          id="numero"
          value={numeroTarjeta}
          onChange={handleNumeroTarjeta}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className="text-lg"
        />
      </div>
      
      <div>
        <Label htmlFor="titular">Nombre del Titular</Label>
        <Input
          id="titular"
          value={nombreTitular}
          onChange={(e) => {
            setNombreTitular(e.target.value.toUpperCase());
          }}
          placeholder="NOMBRE COMPLETO"
          className="text-lg"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fecha">Fecha Exp. (MM/AA)</Label>
          <Input
            id="fecha"
            value={fechaExpiracion}
            onChange={handleFecha}
            placeholder="MM/AA"
            maxLength={5}
            className="text-lg"
          />
        </div>
        
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            value={cvv}
            onChange={handleCvv}
            placeholder="123"
            maxLength={3}
            className="text-lg"
          />
        </div>
      </div>
    </div>
  );
}