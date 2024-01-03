import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { login, logout } from '../../actions/auth';
import Button from './Button';

const Header = (props) => {
  const { isAuthenticated } = props.auth;

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
            onClick={props.logout}
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

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
