import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

export class Header extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <div className="comp">
        <div>
          <button onClick={this.props.logout}>Cerrar sesión</button>
        </div>
      </div>
    )

    const guestLinks = (
      <div className="comp">
        <div>
          <Link to="/login">Iniciar sesión</Link>
        </div>
        <div>
          <Link to="/register">Registrarse</Link>
        </div>
      </div>
    )

    return isAuthenticated ? authLinks : guestLinks;
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(Header);
