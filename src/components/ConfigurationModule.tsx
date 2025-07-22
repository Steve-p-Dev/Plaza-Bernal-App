
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Package
} from 'lucide-react';
import { usePOSStore } from '@/hooks/usePOSStore';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/store/posStore';

export function ConfigurationModule() {
  const store = usePOSStore();
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const products = store.getProducts();
  const categories = [...new Set(products.map(p => p.category))];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      return;
    }

    store.addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category
    });

    setNewProduct({ name: '', price: '', category: '' });
    setShowAddForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;

    store.updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: editingProduct.price,
      category: editingProduct.category
    });

    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    store.deleteProduct(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Configuración</h2>
          <p className="text-gray-600">Gestiona el menú y productos</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-taco-500 hover:bg-taco-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card className="border-taco-200">
          <CardHeader>
            <CardTitle className="text-taco-600">Nuevo Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Ej: Taco de Carnitas"
                />
              </div>
              <div>
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select 
                  value={newProduct.category} 
                  onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    <SelectItem value="Tacos">Tacos</SelectItem>
                    <SelectItem value="Tortas">Tortas</SelectItem>
                    <SelectItem value="Antojitos">Antojitos</SelectItem>
                    <SelectItem value="Bebidas">Bebidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={handleAddProduct} className="bg-taco-500 hover:bg-taco-600">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products by Category */}
      <div className="space-y-6">
        {categories.map(category => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center text-taco-600">
                <Package className="h-5 w-5 mr-2" />
                {category}
                <Badge variant="secondary" className="ml-2">
                  {products.filter(p => p.category === category).length} productos
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter(product => product.category === category)
                  .map(product => (
                    <Card key={product.id} className="border-gray-200">
                      <CardContent className="p-4">
                        {editingProduct?.id === product.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingProduct.name}
                              onChange={(e) => setEditingProduct({
                                ...editingProduct,
                                name: e.target.value
                              })}
                            />
                            <Input
                              type="number"
                              value={editingProduct.price}
                              onChange={(e) => setEditingProduct({
                                ...editingProduct,
                                price: parseFloat(e.target.value) || 0
                              })}
                            />
                            <Select 
                              value={editingProduct.category}
                              onValueChange={(value) => setEditingProduct({
                                ...editingProduct,
                                category: value
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex space-x-2">
                              <Button 
                                onClick={handleSaveEdit}
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <Save className="h-3 w-3 mr-1" />
                                Guardar
                              </Button>
                              <Button 
                                onClick={() => setEditingProduct(null)}
                                size="sm"
                                variant="outline"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium text-gray-800">{product.name}</h3>
                                <p className="text-taco-600 font-semibold">${product.price}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                onClick={() => handleEditProduct(product)}
                                size="sm"
                                variant="outline"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                              <Button 
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
