
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Send, Trash2, Gift, Calendar } from 'lucide-react';
import { usePOSStore } from '@/hooks/usePOSStore';
import { OrderItem } from '@/store/posStore';
import { useToast } from '@/hooks/use-toast';
import { usePedidos } from "@/hooks/usePedidos";

export function OrderModule() {
  const store = usePOSStore();
  const { toast } = useToast();
  const { pedidos, agregarPedido } = usePedidos();
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [selectedTacos, setSelectedTacos] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [showTacoSelection, setShowTacoSelection] = useState(false);
  const [serviceType, setServiceType] = useState<'servirse' | 'llevar' | 'domicilio'>('servirse');
  const [nuevoPedido, setNuevoPedido] = useState("");
  
  const products = store.getProducts();
  const dailyPromotion = store.getDailyPromotion();

  const enviarPedido = async () => {
    if (!nuevoPedido.trim()) return;
    await agregarPedido(nuevoPedido);
    setNuevoPedido("");
  };
  return (
    <div>
      <h2>Tomar Pedido</h2>
      <input
        type="text"
        value={nuevoPedido}
        onChange={(e) => setNuevoPedido(e.target.value)}
        placeholder="Escribe el pedido"
      />
      <button onClick={enviarPedido}>Agregar</button>

      <h3>Pedidos recientes</h3>
      <ul>
        {pedidos.map((p) => (
          <li key={p.id}>{p.texto} - {p.estado}</li>
        ))}
      </ul>
    </div>
  );
}

  
  const categories = [...new Set(products.map(p => p.category))];
  const tacoOptions = products.filter(p => p.category === 'Tacos');

  const addToOrder = (productId: string, productName: string, price: number, isFree = false) => {
    const existingItem = currentOrder.find(item => item.productId === productId);
    
    if (existingItem) {
      setCurrentOrder(currentOrder.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCurrentOrder([...currentOrder, {
        productId,
        productName,
        price,
        quantity: 1,
        isFree
      }]);
    }
  };

  const handleTacoPackSelection = () => {
    if (selectedTacos.length !== 3) {
      return;
    }

    // Agregar el pack como un solo item
    const packName = `Pack 3 Tacos: ${selectedTacos.join(', ')}`;
    addToOrder('pack-3-tacos', packName, 5.50);
    
    setSelectedTacos([]);
    setShowTacoSelection(false);
    
    // Toast eliminado para no molestar
  };

  const toggleTacoSelection = (tacoName: string) => {
    if (selectedTacos.length < 3) {
      setSelectedTacos([...selectedTacos, tacoName]);
    }
  };

  const removeTacoFromSelection = (index: number) => {
    setSelectedTacos(prev => prev.filter((_, i) => i !== index));
  };

  const addPromotionItem = (itemName: string) => {
    const promoProduct = products.find(p => p.name.includes(itemName) && p.isFree);
    if (promoProduct) {
      addToOrder(promoProduct.id, `${itemName} (Promoción)`, 0, true);
      // Toast eliminado para no molestar
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCurrentOrder(currentOrder.filter(item => item.productId !== productId));
    } else {
      setCurrentOrder(currentOrder.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const clearOrder = () => {
    setCurrentOrder([]);
    setSelectedTacos([]);
    setShowTacoSelection(false);
  };

  const sendToKitchen = () => {
    if (currentOrder.length === 0) {
      return;
    }

    // Agregar promociones automáticamente
    const orderWithPromotions = [...currentOrder];
    const promotion = store.getDailyPromotion();
    
    // Verificar si hay packs de tacos para agregar promociones
    const tacoPackCount = currentOrder.filter(item => item.productName.includes('Pack 3 Tacos')).length;
    
    if (promotion.day === 'Jueves' && tacoPackCount >= 2) {
      // 2 packs de tacos = esquites gratis
      const freeEsquites = Math.floor(tacoPackCount / 2);
      orderWithPromotions.push({
        productId: 'promo-esquites',
        productName: 'Esquites (Promoción)',
        price: 0,
        quantity: freeEsquites,
        isFree: true
      });
    }
    
    if (promotion.day === 'Viernes' && tacoPackCount >= 4) {
      // 4 packs de tacos = totopos gratis
      const freeTotopos = Math.floor(tacoPackCount / 4);
      orderWithPromotions.push({
        productId: 'promo-totopos',
        productName: 'Totopos (Promoción)',
        price: 0,
        quantity: freeTotopos,
        isFree: true
      });
    }

    const orderId = store.addOrder(orderWithPromotions, serviceType === 'servirse' ? selectedTable : undefined, serviceType);
    clearOrder();
  };

  const totalAmount = currentOrder.reduce((sum, item) => {
    return sum + (item.isFree ? 0 : item.price * item.quantity);
  }, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Selector de Mesa - Solo para servirse */}
      {serviceType === 'servirse' && (
        <div className="lg:col-span-3 mb-4">
          <Card className="border-bernal-200">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-bernal-700">Seleccionar Mesa</h3>
              <div className="grid grid-cols-9 gap-2 sm:gap-4">
                {Array.from({ length: 9 }, (_, i) => i + 1).map(tableNum => (
                  <Button
                    key={tableNum}
                    variant={selectedTable === tableNum ? "default" : "outline"}
                    onClick={() => setSelectedTable(tableNum)}
                    className={`${
                      selectedTable === tableNum 
                        ? 'bg-bernal-600 text-white' 
                        : 'border-bernal-300 text-bernal-700 hover:bg-bernal-50'
                    }`}
                  >
                    {tableNum}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tipo de Servicio */}
      <div className="lg:col-span-3 mb-4">
        <Card className="border-bernal-200">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-bernal-700">Tipo de Servicio</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={serviceType === 'servirse' ? "default" : "outline"}
                onClick={() => setServiceType('servirse')}
                className={`${
                  serviceType === 'servirse' 
                    ? 'bg-bernal-600 text-white' 
                    : 'border-bernal-300 text-bernal-700 hover:bg-bernal-50'
                }`}
              >
                Para Servirse
              </Button>
              <Button
                variant={serviceType === 'llevar' ? "default" : "outline"}
                onClick={() => setServiceType('llevar')}
                className={`${
                  serviceType === 'llevar' 
                    ? 'bg-bernal-600 text-white' 
                    : 'border-bernal-300 text-bernal-700 hover:bg-bernal-50'
                }`}
              >
                Para Llevar
              </Button>
              <Button
                variant={serviceType === 'domicilio' ? "default" : "outline"}
                onClick={() => setServiceType('domicilio')}
                className={`${
                  serviceType === 'domicilio' 
                    ? 'bg-bernal-600 text-white' 
                    : 'border-bernal-300 text-bernal-700 hover:bg-bernal-50'
                }`}
              >
                Domicilio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Promoción del día */}
      {dailyPromotion.freeItems.length > 0 && (
        <div className="lg:col-span-2">
          <Card className="mb-6 border-bernal-500 bg-bernal-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-bernal-700 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Promoción {dailyPromotion.day}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-bernal-600 mb-3">{dailyPromotion.condition}</p>
              <div className="flex gap-2 flex-wrap">
                {dailyPromotion.freeItems.map(item => (
                  <Button
                    key={item}
                    variant="outline"
                    size="sm"
                    onClick={() => addPromotionItem(item)}
                    className="border-bernal-300 text-bernal-700 hover:bg-bernal-100"
                  >
                    <Gift className="h-4 w-4 mr-1" />
                    Agregar {item} Gratis
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pack de 3 Tacos */}
      <div className="lg:col-span-2">
        <Card className="mb-6 border-rojo-300 bg-rojo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-rojo-700">🌮 Pack 3 Tacos - $5.50</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowTacoSelection(!showTacoSelection)}
              className="w-full bg-rojo-500 hover:bg-rojo-600 text-white"
            >
              {showTacoSelection ? 'Ocultar Selección' : 'Seleccionar Pack 3 Tacos'}
            </Button>
            
            {showTacoSelection && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-rojo-600">
                  Selecciona exactamente 3 tacos ({selectedTacos.length}/3):
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {tacoOptions.map(taco => (
                      <Button
                        key={taco.id}
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTacoSelection(taco.name)}
                        disabled={selectedTacos.length >= 3}
                        className="border-bernal-300 text-bernal-700 hover:bg-bernal-100"
                      >
                        {taco.name}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Tacos seleccionados */}
                  {selectedTacos.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-bernal-700">Tacos seleccionados:</h4>
                      {selectedTacos.map((taco, index) => (
                        <div key={index} className="flex justify-between items-center bg-bernal-50 p-2 rounded">
                          <span className="text-sm">{taco}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTacoFromSelection(index)}
                            className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleTacoPackSelection}
                  disabled={selectedTacos.length !== 3}
                  className="w-full bg-rojo-500 hover:bg-rojo-600 text-white"
                >
                  Agregar Pack al Pedido
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menú de productos por categoría */}
        <div className="space-y-6">
          {categories.filter(cat => cat !== 'Promociones' && cat !== 'Salsas' && cat !== 'Packs').map(category => (
            <Card key={category} className="border-bernal-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-bernal-700">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {products
                    .filter(product => product.category === category)
                    .map(product => (
                      <Card
                        key={product.id}
                        className="cursor-pointer hover:shadow-md transition-shadow border-bernal-200 hover:border-bernal-300"
                        onClick={() => addToOrder(product.id, product.name, product.price, product.isFree)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-800">{product.name}</h3>
                              <p className="text-bernal-600 font-semibold">
                                {product.isFree ? 'GRATIS' : `$${product.price}`}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-bernal-500 hover:bg-bernal-600 text-white"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pedido actual */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6 border-bernal-300">
          <CardHeader className="bg-bernal-500 text-white">
            <CardTitle className="flex justify-between items-center">
              <span>Pedido Actual</span>
              <Badge variant="secondary" className="bg-white text-bernal-600">
                {currentOrder.length} productos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {currentOrder.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay productos en el pedido</p>
              ) : (
                currentOrder.map(item => (
                  <Card key={`${item.productId}-${item.productName}`} className="p-3 border-bernal-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{item.productName}</h4>
                          {item.isFree && (
                            <Badge variant="secondary" className="bg-bernal-100 text-bernal-700 text-xs">
                              <Gift className="h-3 w-3 mr-1" />
                              GRATIS
                            </Badge>
                          )}
                        </div>
                        <p className="text-bernal-600 text-sm">
                          {item.isFree ? 'Sin costo' : `$${item.price} c/u`}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-6 w-6 p-0 border-bernal-300"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 0)}
                          className="w-12 text-center h-6 border-bernal-300"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="h-6 w-6 p-0 border-bernal-300"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Subtotal: {item.isFree ? 'GRATIS' : `$${item.price * item.quantity}`}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {currentOrder.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-bernal-600">${totalAmount.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {serviceType === 'servirse' ? `Mesa ${selectedTable} - Para Servirse` : 
                     serviceType === 'llevar' ? 'Para Llevar' : 'Domicilio'}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={clearOrder}
                    className="flex-1 border-rojo-300 text-rojo-600 hover:bg-rojo-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                  <Button
                    onClick={sendToKitchen}
                    className="flex-1 bg-bernal-500 hover:bg-bernal-600 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar a Cocina
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
