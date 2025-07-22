
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, CheckCircle, Receipt } from 'lucide-react';
import { usePOSStore } from '@/hooks/usePOSStore';
import { useToast } from '@/hooks/use-toast';
import { usePedidos } from "@/hooks/usePedidos";

export function CashierModule() {
  const store = usePOSStore();
  const { toast } = useToast();
  const orders = store.getOrders();

  const { pedidos, actualizarEstado } = usePedidos();

  const pedidosListos = pedidos.filter((p) => p.estado === "listo");

  return (
    <div>
      <h2>Caja</h2>
      <ul>
        {pedidosListos.map((p) => (
          <li key={p.id}>
            {p.texto} - {p.estado}
            <button onClick={() => actualizarEstado(p.id, "entregado")}>Entregado</button>
          </li>
        ))}
      </ul>
    </div>
  );

  const readyOrders = orders.filter(order => order.status === 'ready');
  const paidOrders = orders.filter(order => order.status === 'paid');

  const processPayment = (orderId: string, paymentMethod: 'cash' | 'transfer') => {
    store.updateOrderPayment(orderId, paymentMethod);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPaymentMethodBadge = (method: 'cash' | 'transfer') => {
    return method === 'cash' ? (
      <Badge className="bg-green-500">
        <DollarSign className="h-3 w-3 mr-1" />
        Efectivo
      </Badge>
    ) : (
      <Badge className="bg-blue-500">
        <CreditCard className="h-3 w-3 mr-1" />
        Transferencia
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Ready for Payment */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Receipt className="h-5 w-5 mr-2 text-orange-500" />
          Listos para Cobrar ({readyOrders.length})
        </h2>
        <div className="space-y-4">
          {readyOrders.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <div className="text-4xl mb-2">💳</div>
                <p className="text-gray-500">No hay pedidos listos para cobrar</p>
              </CardContent>
            </Card>
          ) : (
            readyOrders.map(order => (
              <Card key={order.id} className="border-l-4 border-l-orange-400">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex justify-between items-center">
                    <span>Pedido de la Mesa {order.tableNumber || '?'} - {order.serviceType === 'servirse' ? 'Para Servirse' : order.serviceType === 'llevar' ? 'Para Llevar' : order.serviceType === 'domicilio' ? 'Domicilio' : 'Para Servirse'}</span>
                    <Badge className="bg-orange-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Listo
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.productName}</span>
                        <span>${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3 mb-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-taco-600">${order.total}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => processPayment(order.id, 'cash')}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      size="sm"
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Efectivo
                    </Button>
                    <Button
                      onClick={() => processPayment(order.id, 'transfer')}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                      size="sm"
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      Transferencia
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Paid Orders */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Pedidos Pagados ({paidOrders.length})
        </h2>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {paidOrders.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-500">No hay pedidos pagados hoy</p>
              </CardContent>
            </Card>
          ) : (
            paidOrders.map(order => (
              <Card key={order.id} className="border-l-4 border-l-green-400">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex justify-between items-center">
                    <span>Pedido de la Mesa {order.tableNumber || '?'} - {order.serviceType === 'servirse' ? 'Para Servirse' : order.serviceType === 'llevar' ? 'Para Llevar' : order.serviceType === 'domicilio' ? 'Domicilio' : 'Para Servirse'}</span>
                    <div className="flex space-x-2">
                      {order.paymentMethod && getPaymentMethodBadge(order.paymentMethod)}
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Pagado
                      </Badge>
                    </div>
                  </CardTitle>
                  <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.productName}</span>
                        <span>${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-sm">
                      <span>Total:</span>
                      <span className="text-green-600">${order.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
