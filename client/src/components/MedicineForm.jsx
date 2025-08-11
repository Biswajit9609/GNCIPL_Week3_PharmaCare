import React, { useState, useEffect } from 'react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Label } from './ui/label.jsx';

const MedicineForm = ({ medicine, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    quantity: '',
    expiryDate: '',
    price: ''
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        brand: medicine.brand || '',
        category: medicine.category || '',
        quantity: medicine.quantity || '',
        expiryDate: medicine.expiryDate ? medicine.expiryDate.split('T')[0] : '',
        price: medicine.price || ''
      });
    }
  }, [medicine]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!medicine) {
      setFormData({
        name: '',
        brand: '',
        category: '',
        quantity: '',
        expiryDate: '',
        price: ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const categories = [
    'Antibiotics',
    'Pain Relief',
    'Vitamins',
    'Cold & Flu',
    'Digestive Health',
    'Heart & Blood Pressure',
    'Diabetes',
    'Skin Care',
    'Eye Care',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {medicine ? 'Edit Medicine' : 'Add New Medicine'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Medicine Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter medicine name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Enter brand name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={handleChange}
            required
            placeholder="Enter quantity"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="price">Price per Unit (₹) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="0.00"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {medicine ? 'Update Medicine' : 'Add Medicine'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MedicineForm;