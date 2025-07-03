// src/pages/MerchandiseDetail.js
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function MerchandiseDetail() {

    const { id } = useParams(); // merchandise id
    const [merchandise, setMerchandise] = useState(null);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ item_name: '', quantity: 1 });


 


  const fetchMerchandise = useCallback(async () => {
    const { data } = await supabase.from('merchandise').select('*').eq('id', id).single();
    setMerchandise(data);
  }, [id]);

  const fetchItems = useCallback(async () => {
    const { data } = await supabase
      .from('merchandise_items')
      .select('*')
      .eq('merchandise_id', id);
    setItems(data);
  }, [id]);


  const handleAddItem = async () => {
    const { error } = await supabase.from('merchandise_items').insert([
      {
        ...newItem,
        merchandise_id: id,
      },
    ]);
    if (!error) {
      setNewItem({ item_name: '', quantity: 1 });
      fetchItems();
    }
  };

  const handleUpdateItem = async (itemId, field, value) => {
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setItems(updated);
  };

  const handleSaveItem = async (item) => {
    await supabase.from('merchandise_items').update(item).eq('id', item.id);
    fetchItems();
  };

  const handleDeleteItem = async (itemId) => {
    await supabase.from('merchandise_items').delete().eq('id', itemId);
    fetchItems();
  };

  const handleSellItem = async (item) => {
    const soldQuantity = prompt(`How many "${item.item_name}" sold?`);
    const price = prompt(`Total price sold for:`);

    if (!soldQuantity || !price) return;

    await supabase.from('sales').insert([
      {
        item_name: item.item_name,
        quantity_sold: parseInt(soldQuantity),
        total_price: parseFloat(price),
        category: 'merchandise',
        notes: `Sold from merchandise: ${merchandise.name}`,
      },
    ]);

    const newQty = item.quantity - parseInt(soldQuantity);
    await supabase
      .from('merchandise_items')
      .update({ quantity: newQty })
      .eq('id', item.id);

    fetchItems();
  };

   useEffect(() => {
    if (id) {
      fetchMerchandise();
      fetchItems();
    }
  }, [id, fetchMerchandise, fetchItems]);

  return (
    <div className="page merchandise-detail">
      <h2>{merchandise?.name}</h2>

      <div className="merch-detail-form">
        <input
          placeholder="Item name"
          value={newItem.item_name}
          onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <table className="merch-detail-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <input
                  value={item.item_name}
                  onChange={(e) =>
                    handleUpdateItem(item.id, 'item_name', e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateItem(item.id, 'quantity', parseInt(e.target.value))
                  }
                />
              </td>
              <td>
                <button onClick={() => handleSaveItem(item)}>Save</button>
                <button onClick={() => handleSellItem(item)}>Sell</button>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MerchandiseDetail;