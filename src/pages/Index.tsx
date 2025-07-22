
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  ChefHat, 
  CreditCard, 
  Calculator, 
  Settings,
  Menu
} from 'lucide-react';
import { OrderModule } from '@/components/OrderModule';
import { KitchenModule } from '@/components/KitchenModule';
import { CashierModule } from '@/components/CashierModule';
import { DailySummaryModule } from '@/components/DailySummaryModule';
import { ConfigurationModule } from '@/components/ConfigurationModule';

type Module = 'order' | 'kitchen' | 'cashier' | 'summary' | 'config';

const Index = () => {
  const [activeModule, setActiveModule] = useState<Module>('order');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const modules = [
    { id: 'order' as Module, name: 'Tomar Pedido', icon: ShoppingCart, color: 'bg-bernal-500' },
    { id: 'kitchen' as Module, name: 'Cocina', icon: ChefHat, color: 'bg-rojo-500' },
    { id: 'cashier' as Module, name: 'Caja', icon: CreditCard, color: 'bg-bernal-600' },
    { id: 'summary' as Module, name: 'Cuadre Diario', icon: Calculator, color: 'bg-rojo-600' },
    { id: 'config' as Module, name: 'Configuración', icon: Settings, color: 'bg-gray-500' },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'order':
        return <OrderModule />;
      case 'kitchen':
        return <KitchenModule />;
      case 'cashier':
        return <CashierModule />;
      case 'summary':
        return <DailySummaryModule />;
      case 'config':
        return <ConfigurationModule />;
      default:
        return <OrderModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bernal-50 via-white to-rojo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-bernal-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-20 py-2">
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="flex-shrink-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-bernal-600">🌮 Plaza Bernal</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {modules.map((module) => (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    activeModule === module.id 
                      ? `${module.color} text-white hover:opacity-90` 
                      : 'text-gray-600 hover:text-bernal-600'
                  }`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <module.icon className="h-4 w-4" />
                  <span>{module.name}</span>
                </Button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {modules.map((module) => (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeModule === module.id 
                      ? `${module.color} text-white` 
                      : 'text-gray-600 hover:text-bernal-600'
                  }`}
                  onClick={() => {
                    setActiveModule(module.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <module.icon className="h-4 w-4 mr-2" />
                  {module.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg border-bernal-200">
          <CardHeader className="bg-gradient-to-r from-bernal-500 to-rojo-500 text-white">
            <CardTitle className="flex items-center space-x-2">
              {modules.find(m => m.id === activeModule)?.icon && (
                <span className="text-2xl">
                  {React.createElement(modules.find(m => m.id === activeModule)!.icon, { className: "h-6 w-6" })}
                </span>
              )}
              <span>{modules.find(m => m.id === activeModule)?.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderModule()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
