
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { usePOSStore } from '@/hooks/usePOSStore';
import { useToast } from '@/hooks/use-toast';
import { usePedidos } from "@/hooks/usePedidos";

export function KitchenModule() {
  const store = usePOSStore();
  const { toast } = useToast();
  const orders = store.getOrders();

  const { pedidos, actualizarEstado } = usePedidos();

  const pedidosCocina = pedidos.filter(
    (p) => p.estado === "pendiente" || p.estado === "en-cocina"
  );

  return (
    <div>
      <h2>Cocina</h2>
      <ul>
        {pedidosCocina.map((p) => (
          <li key={p.id}>
            {p.texto} - {p.estado}
            <button onClick={() => actualizarEstado(p.id, "listo")}>Listo</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  const startPreparing = (orderId: string) => {
    store.updateOrderStatus(orderId, 'preparing');
  };

  const markAsReady = (orderId: string) => {
    store.updateOrderStatus(orderId, 'ready');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'preparing':
        return <Badge className="bg-yellow-500"><AlertCircle className="h-3 w-3 mr-1" />Preparando</Badge>;
      case 'ready':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Listo</Badge>;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (pendingOrders.length === 0 && preparingOrders.length === 0 && readyOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍳</div>
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No hay pedidos pendientes</h2>
        <p className="text-gray-500">Los nuevos pedidos aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pending Orders */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-gray-500" />
          Pendientes ({pendingOrders.length})
        </h2>
        <div className="space-y-4">
          {pendingOrders.map(order => (
            <Card key={order.id} className="border-l-4 border-l-gray-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex justify-between items-center">
                  <span>Pedido de la Mesa {order.tableNumber || '?'} - {order.serviceType === 'servirse' ? 'Para Servirse' : order.serviceType === 'llevar' ? 'Para Llevar' : order.serviceType === 'domicilio' ? 'Domicilio' : 'Para Servirse'}</span>
                  {getStatusBadge(order.status)}
                </CardTitle>
                <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.productName}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => startPreparing(order.id)}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  size="sm"
                >
                  Comenzar Preparación
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preparing Orders */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
          Preparando ({preparingOrders.length})
        </h2>
        <div className="space-y-4">
          {preparingOrders.map(order => (
            <Card key={order.id} className="border-l-4 border-l-yellow-400">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex justify-between items-center">
                  <span>Pedido de la Mesa {order.tableNumber || '?'} - {order.serviceType === 'servirse' ? 'Para Servirse' : order.serviceType === 'llevar' ? 'Para Llevar' : order.serviceType === 'domicilio' ? 'Domicilio' : 'Para Servirse'}</span>
                  {getStatusBadge(order.status)}
                </CardTitle>
                <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.productName}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => markAsReady(order.id)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  Marcar como Listo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ready Orders */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Listos ({readyOrders.length})
        </h2>
        <div className="space-y-4">
          {readyOrders.map(order => (
            <Card key={order.id} className="border-l-4 border-l-green-400">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex justify-between items-center">
                  <span>Pedido de la Mesa {order.tableNumber || '?'} - {order.serviceType === 'servirse' ? 'Para Servirse' : order.serviceType === 'llevar' ? 'Para Llevar' : order.serviceType === 'domicilio' ? 'Domicilio' : 'Para Servirse'}</span>
                  {getStatusBadge(order.status)}
                </CardTitle>
                <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.productName}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <p className="text-sm text-green-700 font-medium">
                    ¡Pedido listo para entregar!
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
