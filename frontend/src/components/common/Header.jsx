import React, { useState, useSelector } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../../actions/auth';
import Button from './Button';

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [signInData, setSignInData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = signInData;

  const dispatch = useDispatch();
  const onChange = (e) => setSignInData({ ...signInData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  const authLinks = (
    <div className="comp" style={{ flexShrink: '0' }}>
      <div>
        <Button
          text="Inicio"
          onClick={() => { window.location.href = '/'; }}
        />
        <span style={{ width: '10px' }}> </span>
        <Button
          text="?"
          onClick={() => { window.location.href = '/info'; }}
        />
        <span style={{ float: 'right' }}>
          <Button
            text="Cerrar sesión"
            onClick={logout}
          />
        </span>
      </div>
    </div>
  );

  const guestLinks = (
    <div className="comp" style={{ flexShrink: '0' }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'row' }}>
        <label>Nombre de usuario:</label>
        <input type="text" name="username" onChange={onChange} value={username} autoComplete="username" required />
        <br />
        <label>Contraseña:</label>
        <input type="text" name="password" onChange={onChange} value={password} autoComplete="current-password" required />
        <br />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );

  return isAuthenticated ? authLinks : guestLinks;
};

export default Header;
