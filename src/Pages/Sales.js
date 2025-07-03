// src/pages/Sales.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Sales() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSale, setNewSale] = useState({
    item_name: '',
    quantity_sold: '',
    total_price: '',
    category: '',
    notes: '',
  });

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    const filtered = sales.filter((sale) =>
      sale.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSales(filtered);
  }, [searchTerm, sales]);

  const fetchSales = async () => {
    const { data, error } = await supabase.from('sales').select('*').order('sold_at', { ascending: false });
    if (!error) setSales(data);
  };

  const handleCreate = async () => {
    const { error } = await supabase.from('sales').insert([{ ...newSale }]);
    if (!error) {
      setNewSale({ item_name: '', quantity_sold: '', total_price: '', category: '', notes: '' });
      fetchSales();
    }
  };

  const handleUpdate = async (id, updatedSale) => {
    const { error } = await supabase.from('sales').update(updatedSale).eq('id', id);
    if (!error) fetchSales();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (!error) fetchSales();
  };

  const exportCSV = () => {
    const headers = ['Date', 'Item Name', 'Quantity', 'Total Price', 'Category', 'Notes'];
    const rows = sales.map(s => [
      new Date(s.sold_at).toLocaleString('sv-SE'),
      s.item_name,
      s.quantity_sold,
      s.total_price,
      s.category,
      s.notes
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'sales.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sales-container" id="sales-page">
  <h1 className="sales-title">Sales</h1>

  <div className="sales-form" id="sales-form">
    <input
      className="sales-input"
      placeholder="Item name"
      value={newSale.item_name}
      onChange={e => setNewSale({ ...newSale, item_name: e.target.value })}
    />
    <input
      className="sales-input"
      type="number"
      placeholder="Quantity"
      value={newSale.quantity_sold}
      onChange={e => setNewSale({ ...newSale, quantity_sold: e.target.value })}
    />
    <input
      className="sales-input"
      type="number"
      placeholder="Total price"
      value={newSale.total_price}
      onChange={e => setNewSale({ ...newSale, total_price: e.target.value })}
    />
    <input
      className="sales-input"
      placeholder="Category"
      value={newSale.category}
      onChange={e => setNewSale({ ...newSale, category: e.target.value })}
    />
    <input
      className="sales-input"
      placeholder="Notes"
      value={newSale.notes}
      onChange={e => setNewSale({ ...newSale, notes: e.target.value })}
    />
    <button className="sales-create-button" onClick={handleCreate}>Add Sale</button>
    <button className="sales-export-button" onClick={exportCSV}>Export CSV</button>
    <input
      className="sales-search"
      placeholder="Search by name/category"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
  </div>

  <table className="sales-table" id="sales-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Item</th>
        <th>Qty</th>
        <th>Total</th>
        <th>Category</th>
        <th>Notes</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredSales.map(s => (
        <tr key={s.id} className="sales-row">
          <td>{new Date(s.sold_at).toLocaleString('sv-SE')}</td>
          <td>
            <input
              className="sales-edit-input"
              value={s.item_name}
              onChange={e => setSales(sales.map(sale => sale.id === s.id ? { ...sale, item_name: e.target.value } : sale))}
            />
          </td>
          <td>
            <input
              className="sales-edit-input"
              type="number"
              value={s.quantity_sold}
              onChange={e => setSales(sales.map(sale => sale.id === s.id ? { ...sale, quantity_sold: e.target.value } : sale))}
            />
          </td>
          <td>
            <input
              className="sales-edit-input"
              type="number"
              value={s.total_price}
              onChange={e => setSales(sales.map(sale => sale.id === s.id ? { ...sale, total_price: e.target.value } : sale))}
            />
          </td>
          <td>
            <input
              className="sales-edit-input"
              value={s.category || ''}
              onChange={e => setSales(sales.map(sale => sale.id === s.id ? { ...sale, category: e.target.value } : sale))}
            />
          </td>
          <td>
            <input
              className="sales-edit-input"
              value={s.notes || ''}
              onChange={e => setSales(sales.map(sale => sale.id === s.id ? { ...sale, notes: e.target.value } : sale))}
            />
          </td>
          <td className="sales-actions">
            <button className="sales-save-btn" onClick={() => handleUpdate(s.id, s)}>Save</button>
            <button className="sales-delete-btn" onClick={() => handleDelete(s.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}

export default Sales;
