import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Make sure this path is correct!
import logo from '../assets/logo192.png';

function Sidebar() {
  const [merchandise, setMerchandise] = useState([]);

  const fetchMerchandise = async () => {
    const { data, error } = await supabase
      .from('merchandise')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error) setMerchandise(data);
  };

  useEffect(() => {
    fetchMerchandise();
  }, []);

  const handleCreateMerch = async () => {
    const name = prompt("Name of new merchandise?");
    if (!name) return;
    const { error } = await supabase.from('merchandise').insert([{ name }]);
    if (!error) fetchMerchandise(); // Refresh nav
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Svarta Klingan logo" className="logo" />
        <h1 className="company-name">Svarta Klingan</h1>
      </div>

      <nav className="nav-links">
        <NavLink to="/" end className="nav-link">Home</NavLink>
        <NavLink to="/stock" className="nav-link">Stock</NavLink>
        <NavLink to="/merchandise" className="nav-link">Merchandise</NavLink>
        <NavLink to="/sales" className="nav-link">Sales</NavLink>

        {/* Dynamically generated merchandise tabs */}
        {merchandise.map((m) => (
          <NavLink key={m.id} to={`/merchandise/${m.id}`} className="nav-link">
            {m.pinned ? '📌 ' : ''}{m.name}
          </NavLink>
        ))}

        <button className="new-tab-button" onClick={handleCreateMerch}>➕ New Tab</button>
      </nav>
    </aside>
  );
}

export default Sidebar;
