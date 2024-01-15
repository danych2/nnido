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
    <div id="header-left">
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
    </div>
  );

  const headerRight = (
    <div id="header-right">
      { isAuthenticated ? (
        <Button
          text="Cerrar sesión"
          onClick={() => dispatch(logout())}
        />
      ) : (
        <>
          <table>
            <tbody>
              <tr>
                <td>
                  <label><small>Nombre de usuario:</small></label>
                </td>
                <td>
                  <input type="text" name="username" onChange={onChange} value={username} autoComplete="username" required />
                </td>
              </tr>
              <tr>
                <td>
                  <label><small>Contraseña:</small></label>
                </td>
                <td>
                  <input type="password" name="password" onChange={onChange} value={password} autoComplete="current-password" required />
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <Button text="Iniciar sesión" onClick={() => dispatch(login({ username, password }))} />
        </>
      )}
    </div>
  );

  return (
    <div id="header" className="comp">
      { headerLeft }
      <div id="header-center">
        <img src={logo} />
      </div>
      { headerRight }
    </div>
  );
};

export default Header;
