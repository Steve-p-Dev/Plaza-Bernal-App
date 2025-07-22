
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  FileText,
  Plus,
  Minus
} from 'lucide-react';
import { usePOSStore } from '@/hooks/usePOSStore';
import { useToast } from '@/hooks/use-toast';

export function DailySummaryModule() {
  const store = usePOSStore();
  const [newExpense, setNewExpense] = useState({ concept: '', amount: '' });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [initialCash, setInitialCash] = useState('');
  const [showInitialCashForm, setShowInitialCashForm] = useState(false);

  const summary = store.getDailySummary();
  const expenses = store.getExpenses();
  const initialCashAmount = store.getInitialCash();

  const addExpense = () => {
    if (!newExpense.concept || !newExpense.amount) {
      return;
    }

    store.addExpense(newExpense.concept, parseFloat(newExpense.amount));
    setNewExpense({ concept: '', amount: '' });
    setShowExpenseForm(false);
  };

  const setInitialCashAmount = () => {
    if (!initialCash) return;
    
    store.setInitialCash(parseFloat(initialCash));
    setInitialCash('');
    setShowInitialCashForm(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const netSales = summary.totalSales;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Cuadre Diario</h2>
          <p className="text-gray-600 capitalize">{formatDate(summary.date)}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowInitialCashForm(!showInitialCashForm)}
            className="bg-green-500 hover:bg-green-600"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Dinero Inicial
          </Button>
          <Button 
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="bg-red-500 hover:bg-red-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Egreso
          </Button>
        </div>
      </div>

      {/* Initial Cash Form */}
      {showInitialCashForm && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-600">Dinero Inicial de Caja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="initialCash">Monto Inicial</Label>
                <Input
                  id="initialCash"
                  type="number"
                  value={initialCash}
                  onChange={(e) => setInitialCash(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={setInitialCashAmount} className="bg-green-500 hover:bg-green-600">
                  Establecer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInitialCashForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Expense Form */}
      {showExpenseForm && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Nuevo Egreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="concept">Concepto</Label>
                <Input
                  id="concept"
                  value={newExpense.concept}
                  onChange={(e) => setNewExpense({...newExpense, concept: e.target.value})}
                  placeholder="Ej: Compra de ingredientes"
                />
              </div>
              <div>
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={addExpense} className="bg-red-500 hover:bg-red-600">
                  Agregar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowExpenseForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dinero Inicial</p>
                <p className="text-2xl font-bold text-blue-600">${initialCashAmount}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efectivo</p>
                <p className="text-2xl font-bold text-green-600">${summary.totalCash}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transferencias</p>
                <p className="text-2xl font-bold text-blue-600">${summary.totalTransfer}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Egresos</p>
                <p className="text-2xl font-bold text-red-600">${summary.totalExpenses}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ventas Netas</p>
                <p className={`text-2xl font-bold ${netSales >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netSales}
                </p>
              </div>
              <TrendingUp className={`h-8 w-8 ${netSales >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Product */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Ventas por Producto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(summary.salesByProduct).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay ventas registradas hoy</p>
              ) : (
                Object.entries(summary.salesByProduct).map(([product, data]) => (
                  <div key={product} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{product}</p>
                      <p className="text-sm text-gray-600">{data.quantity} unidades</p>
                    </div>
                    <Badge variant="secondary">${data.total}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Minus className="h-5 w-5 mr-2 text-red-500" />
              Egresos del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {expenses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay egresos registrados hoy</p>
              ) : (
                expenses.map(expense => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <div>
                      <p className="font-medium">{expense.concept}</p>
                      <p className="text-sm text-gray-600">
                        {expense.date.toLocaleTimeString('es-MX', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <Badge variant="destructive">${expense.amount}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Summary */}
      <Card className="border-taco-200">
        <CardHeader className="bg-taco-50">
          <CardTitle className="flex items-center text-taco-700">
            <FileText className="h-5 w-5 mr-2" />
            Resumen Final
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span>Dinero Inicial menos Egresos:</span>
                <span className="font-semibold text-blue-600">${initialCashAmount - summary.totalExpenses}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Efectivo Ventas:</span>
                <span className="font-semibold">${summary.totalCash}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Total Transferencias:</span>
                <span className="font-semibold">${summary.totalTransfer}</span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span className="font-semibold">Total Ventas:</span>
                <span className="font-semibold text-taco-600">${summary.totalSales}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="font-semibold">Efectivo Total en Caja:</span>
                <span className="font-semibold text-lg text-green-600">
                  ${initialCashAmount + summary.totalCash - summary.totalExpenses}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span className="font-semibold">Ganancia Neta:</span>
                <span className={`font-semibold text-lg ${(summary.totalSales - summary.totalExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${summary.totalSales - summary.totalExpenses}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
