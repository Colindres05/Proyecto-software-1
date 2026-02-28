import { Link } from "react-router";
import { Monitor, Smartphone, QrCode, Settings } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 text-amber-900">
            ☕ Sistema de Cafetería
          </h1>
          <p className="text-xl text-amber-700">
            Prototipos del Sistema de Pedidos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kiosco Para Llevar */}
          <Link
            to="/kiosco"
            className="transform transition hover:scale-105"
          >
            <Card className="h-full bg-white shadow-xl hover:shadow-2xl cursor-pointer">
              <CardHeader className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <Smartphone className="w-20 h-20 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mb-2">
                  Kiosco Para Llevar
                </CardTitle>
                <CardDescription className="text-base">
                  Pantalla tipo McDonald's donde los clientes
                  pueden ordenar productos para llevar
                </CardDescription>
                <div className="mt-6 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg inline-block">
                  Haz clic para ver
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Menú QR */}
          <Link
            to="/mesa"
            className="transform transition hover:scale-105"
          >
            <Card className="h-full bg-white shadow-xl hover:shadow-2xl cursor-pointer">
              <CardHeader className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <QrCode className="w-20 h-20 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-2">
                  Menú QR Mesa
                </CardTitle>
                <CardDescription className="text-base">
                  Vista móvil que se despliega al escanear el
                  código QR de cada mesa
                </CardDescription>
                <div className="mt-6 px-4 py-2 bg-green-100 text-green-800 rounded-lg inline-block">
                  Haz clic para ver
                </div>
              </CardHeader>
            </Card>
          </Link>

          {/* Monitor Barista */}
          <Link
            to="/barista"
            className="transform transition hover:scale-105"
          >
            <Card className="h-full bg-white shadow-xl hover:shadow-2xl cursor-pointer">
              <CardHeader className="text-center p-8">
                <div className="flex justify-center mb-4">
                  <Monitor className="w-20 h-20 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-2">
                  Monitor Barista
                </CardTitle>
                <CardDescription className="text-base">
                  Pantalla FIFO para que el barista visualice y
                  gestione los pedidos entrantes
                </CardDescription>
                <div className="mt-6 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg inline-block">
                  Haz clic para ver
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Panel Administrador */}
        <div className="mt-8">
          <Link to="/admin" className="transform transition hover:scale-105 block">
            <Card className="bg-white shadow-xl hover:shadow-2xl cursor-pointer">
              <CardHeader className="text-center p-6">
                <div className="flex items-center justify-center gap-4">
                  <Settings className="w-12 h-12 text-indigo-600" />
                  <div className="text-left">
                    <CardTitle className="text-2xl mb-1">Panel de Administrador</CardTitle>
                    <CardDescription className="text-base">
                      Gestiona el menú, actualiza precios y administra productos
                    </CardDescription>
                  </div>
                  <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg whitespace-nowrap">
                    Administrar →
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4 text-amber-900">
            📋 Acerca de estos prototipos
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              • <strong>Kiosco:</strong> Interfaz táctil para
              pedidos para llevar con pago por tarjeta o efectivo
            </li>
            <li>
              • <strong>Mesa QR:</strong> Menú digital con pedidos inmediatos o programados y pago con tarjeta
            </li>
            <li>
              • <strong>Barista:</strong> Monitor en tiempo real
              con sistema FIFO que muestra pedidos normales y programados
            </li>
            <li>
              • <strong>Administrador:</strong> Panel para gestionar el menú y actualizar precios en tiempo real
            </li>
            <li>
              • Todos los pedidos se sincronizan automáticamente entre las diferentes pantallas
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}