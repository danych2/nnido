import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { login, logout } from '../../slices/authSlice';
import Button from './Button';
import './Header.css';
import logo from '../../images/logo_nnido_trans.png';

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = signInData;

  const dispatch = useDispatch();
  const onChange = (e) => setSignInData({ ...signInData, [e.target.name]: e.target.value });
  const location = useLocation();

  const headerLeft = (
    <span>
      { location.pathname !== '/' && (
        <Button
          text="Inicio"
          onClick={() => { window.location.href = '/'; }}
        />
      )}
      <span style={{ width: '10px' }}> </span>
      <Button
        text="?"
        onClick={() => { window.location.href = '/info'; }}
      />
    </span>
  );

  const headerRight = isAuthenticated ? (
    <span>
      <Button
        text="Cerrar sesión"
        onClick={() => dispatch(logout())}
      />
    </span>
  ) : (
    <span>
      <label><small>Nombre de usuario:</small></label>
      <input type="text" name="username" onChange={onChange} value={username} autoComplete="username" required />
      <br />
      <label><small>Contraseña:</small></label>
      <input type="text" name="password" onChange={onChange} value={password} autoComplete="current-password" required />
      <br />
      <Button text="Iniciar sesión" onClick={() => dispatch(login({ username, password }))} />
    </span>
  );

  return (
    <div id="header" className="comp">
      { headerLeft }
      <img
        src={logo}
        style={{
          height: '50px',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      { headerRight }
    </div>
  );
};

export default Header;
