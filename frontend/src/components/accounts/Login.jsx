import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';

const Login = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const dispatch = useDispatch();
  const { username, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="comp">
      <form onSubmit={onSubmit}>
        <label>Nombre de usuario:</label>
        <input type="text" name="username" onChange={onChange} value={username} autoComplete="username" required />
        <br />
        <label>Contraseña:</label>
        <input type="text" name="password" onChange={onChange} value={password} autoComplete="current-password" required />
        <br />
        <button type="submit">Iniciar sesión</button>
        {/*
          <div className="comp"><Link to="/register">Regístrate</Link></div>
          Signing up is disabled until all security concerns are dealt with
        */}
      </form>
    </div>
  );
};

export default Login;
