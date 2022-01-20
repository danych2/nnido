import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import Button from './Button';

const Header = (props) => {
  const { isAuthenticated } = props.auth;

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
      <div>
        <Link to="/login">Iniciar sesión</Link>
      </div>
      <div>
        <Link to="/register">Registrarse</Link>
      </div>
    </div>
  );

  return isAuthenticated ? authLinks : ''; // guestLinks;
};

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
