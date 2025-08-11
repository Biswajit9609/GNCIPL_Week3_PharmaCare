import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import MedicineForm from './components/MedicineForm.jsx';
import MedicineTable from './components/MedicineTable.jsx';
import SaleForm from './components/SaleForm.jsx';
import Dashboard from './components/Dashboard.jsx';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines`);
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      setMessage('Error fetching medicines');
    }
  };

  const handleAddMedicine = async (medicineData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicineData),
      });

      if (response.ok) {
        setMessage('Medicine added successfully');
        setShowAddForm(false);
        fetchMedicines();
      } else {
        setMessage('Error adding medicine');
      }
    } catch (error) {
      setMessage('Error adding medicine');
    }
  };

  const handleEditMedicine = async (medicineData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/${editingMedicine._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicineData),
      });

      if (response.ok) {
        setMessage('Medicine updated successfully');
        setEditingMedicine(null);
        fetchMedicines();
      } else {
        setMessage('Error updating medicine');
      }
    } catch (error) {
      setMessage('Error updating medicine');
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessage('Medicine deleted successfully');
          fetchMedicines();
        } else {
          setMessage('Error deleting medicine');
        }
      } catch (error) {
        setMessage('Error deleting medicine');
      }
    }
  };

  const handleSale = async (saleData) => {
    try {
      if (saleData.cart) {
        // Handle cart-based sale
        for (const item of saleData.cart) {
          const medicine = medicines.find(m => m._id === item.medicineId);
          const updatedQuantity = medicine.quantity - item.quantity;
          
          const response = await fetch(`${API_BASE_URL}/medicines/${item.medicineId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...medicine, quantity: updatedQuantity }),
          });

          if (!response.ok) {
            setMessage('Error processing sale');
            return;
          }
        }
        
        const totalItems = saleData.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = saleData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setMessage(`Sale completed! ${totalItems} items sold for ₹${totalAmount.toFixed(2)}`);
      } else {
        // Handle single item sale (legacy)
        const medicine = medicines.find(m => m._id === saleData.medicineId);
        if (medicine.quantity < saleData.quantity) {
          setMessage('Insufficient stock available');
          return;
        }

        const updatedQuantity = medicine.quantity - saleData.quantity;
        const response = await fetch(`${API_BASE_URL}/medicines/${saleData.medicineId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...medicine, quantity: updatedQuantity }),
        });

        if (response.ok) {
          setMessage(`Sale completed! ${saleData.quantity} units of ${medicine.name} sold`);
        } else {
          setMessage('Error processing sale');
        }
      }
      
      fetchMedicines();
    } catch (error) {
      setMessage('Error processing sale');
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setActiveTab('inventory');
  };

  const handleCancelEdit = () => {
    setEditingMedicine(null);
  };

  const handleSubmit = (medicineData) => {
    if (editingMedicine) {
      handleEditMedicine(medicineData);
    } else {
      handleAddMedicine(medicineData);
    }
  };

  const clearMessage = () => {
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    if (message) clearMessage();
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900">PharmaCare</h1>
                <p className="text-sm text-gray-500">Professional Stock Management</p>
              </div>
            </div>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'inventory'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'sales'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sales
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Alert Messages */}
        {message && (
          <div className="mb-6 mx-4 sm:mx-0">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{message}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <Dashboard medicines={medicines} />
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="px-4 sm:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-2xl font-semibold text-gray-900">Medicine Inventory</h2>
                <p className="mt-2 text-sm text-gray-700">
                  Manage your pharmacy's medicine stock and inventory.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {showAddForm ? 'Cancel' : 'Add Medicine'}
                </Button>
              </div>
            </div>

            {(showAddForm || editingMedicine) && (
              <div className="mt-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <MedicineForm
                    medicine={editingMedicine}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                      handleCancelEdit();
                      setShowAddForm(false);
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="bg-white shadow rounded-lg">
                <MedicineTable
                  medicines={medicines}
                  onEdit={handleEdit}
                  onDelete={handleDeleteMedicine}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div className="px-4 sm:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-2xl font-semibold text-gray-900">Sales Management</h2>
                <p className="mt-2 text-sm text-gray-700">
                  Process medicine sales and update inventory automatically.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <SaleForm medicines={medicines} onSale={handleSale} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;