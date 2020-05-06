import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

export class Login extends Component {
  state = {
    username: '',
    password: ''
  };

  static propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { username, email, password, password2 } = this.state;
    return (
      <div className="comp">
        <form onSubmit={this.onSubmit}>
          <label>Nombre de usuario:</label>
          <input type="text" name="username" onChange={this.onChange} value={username} /><br />
          <label>Contraseña:</label>
          <input type="text" name="password" onChange={this.onChange} value={password} /><br />
          <button type="submit">Iniciar sesión</button>
          <div className="comp"><Link to="/register">Regístrate</Link></div>
        </form>
      </div>
    )
  };
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login);
