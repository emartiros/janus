import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
  const [accessKeyValue, setAccessKeyValue] = useState('');
  const [secretKeyValue, setSecretKeyValue] = useState('');
  const {auth} = useContext(AuthContext)

  const handleSubmit = (e) => {
    e.preventDefault();
    auth(accessKeyValue, secretKeyValue)
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              id="access-key"
              value={accessKeyValue}
              onChange={(e) => setAccessKeyValue(e.target.value)}
              placeholder="Access key"
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              id="secret-key"
              value={secretKeyValue}
              onChange={(e) => setSecretKeyValue(e.target.value)}
              placeholder="Secret key"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;