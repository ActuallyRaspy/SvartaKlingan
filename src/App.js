import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Layout from './components/Layout';
import Home from './pages/Home';
import Stock from './pages/Stock';
import Merchandise from './pages/Merchandise';
import Login from './pages/Login';
import Sales from './pages/Sales';
import MerchandiseDetail from './pages/MerchandiseDetail';


import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for session changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!session) {
    return (
      <Router basename="/SvartaKlingan">
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router basename="/SvartaKlingan">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/merchandise/:id" element={<MerchandiseDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;