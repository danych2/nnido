import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { register } from '../../slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const {
    username, email, password, password2,
  } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      const newUser = { email, username, password };
      dispatch(register(newUser));
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className="comp">
      <form onSubmit={onSubmit}>
        <label>Nombre de usuario:</label>
        <input
          type="text"
          name="username"
          onChange={onChange}
          value={username}
        />
        <br />
        <label>e-mail:</label>
        <input type="text" name="email" onChange={onChange} value={email} />
        <br />
        <label>Contraseña:</label>
        <input
          type="text"
          name="password"
          onChange={onChange}
          value={password}
        />
        <br />
        <label>Repite la contraseña:</label>
        <input
          type="text"
          name="password2"
          onChange={onChange}
          value={password2}
        />
        <br />
        <button type="submit">Registrar</button>
        <div className="comp">
          <Link to="/login">Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
