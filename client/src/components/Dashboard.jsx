const Dashboard = ({ medicines }) => {
  const totalMedicines = medicines.length;
  const totalStock = medicines.reduce((sum, med) => sum + (med.quantity || 0), 0);
  const lowStockItems = medicines.filter(med => med.quantity < 10).length;
  const totalValue = medicines.reduce((sum, med) => sum + ((med.quantity || 0) * (med.price || 0)), 0);
  const expiringSoon = medicines.filter(med => {
    if (!med.expiryDate) return false;
    const expiryDate = new Date(med.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  }).length;

  const stats = [
    {
      name: 'Total Medicines',
      value: totalMedicines,
      icon: '💊',
      color: 'bg-blue-500',
    },
    {
      name: 'Total Stock',
      value: totalStock,
      icon: '📦',
      color: 'bg-green-500',
    },
    {
      name: 'Low Stock Alert',
      value: lowStockItems,
      icon: '⚠️',
      color: 'bg-yellow-500',
    },
    {
      name: 'Inventory Value',
      value: `₹${totalValue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-purple-500',
    },
    {
      name: 'Expiring Soon',
      value: expiringSoon,
      icon: '⏰',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-sm text-gray-700">
            Overview of your pharmacy's inventory and key metrics.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md p-3 text-white text-2xl`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Low Stock Alert */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Low Stock Alert
            </h3>
            <div className="space-y-3">
              {medicines
                .filter(med => med.quantity < 10)
                .slice(0, 5)
                .map((medicine) => (
                  <div key={medicine._id} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{medicine.name}</p>
                      <p className="text-sm text-gray-500">{medicine.brand}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {medicine.quantity} left
                      </span>
                    </div>
                  </div>
                ))}
              {medicines.filter(med => med.quantity < 10).length === 0 && (
                <p className="text-gray-500 text-center py-4">All medicines are well stocked!</p>
              )}
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Expiring Soon (30 days)
            </h3>
            <div className="space-y-3">
              {medicines
                .filter(med => {
                  if (!med.expiryDate) return false;
                  const expiryDate = new Date(med.expiryDate);
                  const thirtyDaysFromNow = new Date();
                  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                  return expiryDate <= thirtyDaysFromNow;
                })
                .slice(0, 5)
                .map((medicine) => (
                  <div key={medicine._id} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{medicine.name}</p>
                      <p className="text-sm text-gray-500">{medicine.brand}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {new Date(medicine.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              {medicines.filter(med => {
                if (!med.expiryDate) return false;
                const expiryDate = new Date(med.expiryDate);
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
                return expiryDate <= thirtyDaysFromNow;
              }).length === 0 && (
                <p className="text-gray-500 text-center py-4">No medicines expiring soon!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;