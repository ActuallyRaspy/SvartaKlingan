import { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../App.css'; // Optional for styling

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Success – handled by App.js session change
    }
  };

  return (
    <div className="login-container">
      <h2>Logga in till Svarta Klingan</h2>
      <form onSubmit={handleLogin}>
        <input className='loginInput'
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input className='loginInput'
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button id="loginBtn" type="submit">Logga in</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;