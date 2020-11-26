import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const { login } = this.props;
    const { username, password } = this.state;
    login(username, password);
  };

  render() {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      return <Redirect to="/" />;
    }
    const { username, password } = this.state;
    return (
      <div className="comp">
        <form onSubmit={this.onSubmit}>
          <label>Nombre de usuario:</label>
          <input type="text" name="username" onChange={this.onChange} value={username} />
          <br />
          <label>Contraseña:</label>
          <input type="text" name="password" onChange={this.onChange} value={password} />
          <br />
          <button type="submit">Iniciar sesión</button>
          <div className="comp"><Link to="/register">Regístrate</Link></div>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
