// Stock.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Stock() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newSellPrice, setNewSellPrice] = useState('');
  const [editStates, setEditStates] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase.from('items').select('*').order('created_at', { ascending: false });
    if (error) alert('Error: ' + error.message);
    else setItems(data);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newName || !newQuantity || !newSellPrice) return alert('Fyll i alla fält!');
    const { error } = await supabase.from('items').insert([
      {
        name: newName,
        quantity: parseInt(newQuantity),
        sell_price: parseFloat(newSellPrice),
      },
    ]);
    if (error) alert('Error: ' + error.message);
    else {
      setNewName('');
      setNewQuantity('');
      setNewSellPrice('');
      fetchItems();
    }
  }

  async function handleUpdate(id, updatedItem) {
    const { error } = await supabase.from('items').update(updatedItem).eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchItems();
  }

  async function handleDelete(id) {
    if (!window.confirm('Ta bort föremålet?')) return;
    const { error } = await supabase.from('items').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchItems();
  }

  function toggleEdit(id, item) {
    setEditStates((prev) => ({
      ...prev,
      [id]: prev[id]
        ? undefined
        : {
            name: item.name,
            quantity: item.quantity,
            sell_price: item.sell_price,
          },
    }));
  }

  function updateEditState(id, field, value) {
    setEditStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  return (
    <div className="stock-page">
      <h1 className="stock-title">Lagerhantering</h1>

      {/* New item */}
      <form onSubmit={handleCreate} className="stock-form">
        <input type="text" placeholder="Namn" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <input type="number" placeholder="Antal" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} />
        <input type="number" step="0.01" placeholder="Pris (SEK)" value={newSellPrice} onChange={(e) => setNewSellPrice(e.target.value)} />
        <button type="submit" className="btn-primary">Skapa</button>
      </form>

      {loading && <p>Laddar...</p>}

      <div className="stock-list">
        {items.map((item) => {
          const editing = !!editStates[item.id];
          const edit = editStates[item.id] || {};

          return (
            <div key={item.id} className="stock-card">
              {editing ? (
                <>
                  <p>Namn:</p>
                  <input value={edit.name} onChange={(e) => updateEditState(item.id, 'name', e.target.value)} />
                  <p>Antal:</p>
                  <input type="number" value={edit.quantity} onChange={(e) => updateEditState(item.id, 'quantity', e.target.value)} />
                  <p>Pris:</p>
                  <input type="number" step="0.01" value={edit.sell_price} onChange={(e) => updateEditState(item.id, 'sell_price', e.target.value)} />
                  <div className="button-group">
                    <button className="btn-primary" onClick={() => { handleUpdate(item.id, { name: edit.name, quantity: parseInt(edit.quantity), sell_price: parseFloat(edit.sell_price) }); toggleEdit(item.id); }}>Spara</button>
                    <button className="btn-secondary" onClick={() => toggleEdit(item.id)}>Avbryt</button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>{item.name}</strong></p>
                  <p>Antal: {item.quantity}</p>
                  <p>Pris: {item.sell_price.toFixed(2)} kr</p>
                  <div className="button-group">
                    <button className="btn-secondary" onClick={() => toggleEdit(item.id, item)}>Redigera</button>
                    <button className="btn-danger" onClick={() => handleDelete(item.id)}>Ta bort</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Stock;
