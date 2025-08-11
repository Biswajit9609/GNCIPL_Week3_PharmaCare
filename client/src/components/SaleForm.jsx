import React, { useState } from 'react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';

const SaleForm = ({ medicines, onSale }) => {
  const [cart, setCart] = useState([]);
  const [saleData, setSaleData] = useState({
    medicineId: '',
    quantity: '',
    customerName: '',
    customerPhone: ''
  });

  const selectedMedicine = medicines.find(m => m._id === saleData.medicineId);

  const addToCart = () => {
    if (!saleData.medicineId || !saleData.quantity) {
      alert('Please select a medicine and enter quantity');
      return;
    }

    const medicine = medicines.find(m => m._id === saleData.medicineId);
    const quantity = parseInt(saleData.quantity);

    if (quantity > medicine.quantity) {
      alert('Insufficient stock available');
      return;
    }

    const existingItem = cart.find(item => item.medicineId === saleData.medicineId);
    if (existingItem) {
      if (existingItem.quantity + quantity > medicine.quantity) {
        alert('Total quantity exceeds available stock');
        return;
      }
      setCart(cart.map(item => 
        item.medicineId === saleData.medicineId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        medicineId: saleData.medicineId,
        name: medicine.name,
        brand: medicine.brand,
        price: medicine.price,
        quantity: quantity
      }]);
    }

    setSaleData({ ...saleData, medicineId: '', quantity: '' });
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.medicineId !== medicineId));
  };

  const updateCartQuantity = (medicineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
      return;
    }

    const medicine = medicines.find(m => m._id === medicineId);
    if (newQuantity > medicine.quantity) {
      alert('Quantity exceeds available stock');
      return;
    }

    setCart(cart.map(item => 
      item.medicineId === medicineId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    onSale({ cart, customerName: saleData.customerName, customerPhone: saleData.customerPhone });
    setCart([]);
    setSaleData({
      medicineId: '',
      quantity: '',
      customerName: '',
      customerPhone: ''
    });
  };

  const handleChange = (e) => {
    setSaleData({
      ...saleData,
      [e.target.name]: e.target.value
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Add to Cart Form */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Medicine to Cart</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="medicineId">Select Medicine</Label>
            <select
              id="medicineId"
              name="medicineId"
              value={saleData.medicineId}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Choose a medicine...</option>
              {medicines
                .filter(med => med.quantity > 0)
                .map((medicine) => (
                  <option key={medicine._id} value={medicine._id}>
                    {medicine.name} - {medicine.brand} (Stock: {medicine.quantity}) - ₹{medicine.price}
                  </option>
                ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex gap-2">
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max={selectedMedicine ? selectedMedicine.quantity : 1}
                value={saleData.quantity}
                onChange={handleChange}
                placeholder="Qty"
                className="flex-1"
              />
              <Button 
                type="button"
                onClick={addToCart}
                disabled={!saleData.medicineId || !saleData.quantity}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        {selectedMedicine && (
          <div className="mt-4 bg-blue-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Available Stock:</span> {selectedMedicine.quantity} units</p>
                <p><span className="font-medium">Price per unit:</span> ₹{selectedMedicine.price}</p>
              </div>
              <div>
                <p><span className="font-medium">Category:</span> {selectedMedicine.category}</p>
                <p><span className="font-medium">Expiry:</span> {selectedMedicine.expiryDate ? new Date(selectedMedicine.expiryDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shopping Cart ({cart.length} items)</h3>
        
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Cart is empty. Add medicines above.</p>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.medicineId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.brand} - ₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.medicineId, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateCartQuantity(item.medicineId, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFromCart(item.medicineId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-green-600">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleCheckout} className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              name="customerName"
              value={saleData.customerName}
              onChange={handleChange}
              placeholder="Enter customer name (optional)"
            />
          </div>
          <div>
            <Label htmlFor="customerPhone">Customer Phone</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={saleData.customerPhone}
              onChange={handleChange}
              placeholder="Enter customer phone (optional)"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            type="submit" 
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={cart.length === 0}
          >
            Complete Sale (₹{cartTotal.toFixed(2)})
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setCart([]);
              setSaleData({
                medicineId: '',
                quantity: '',
                customerName: '',
                customerPhone: ''
              });
            }}
          >
            Clear All
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;