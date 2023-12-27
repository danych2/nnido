import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/auth';

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      password2: '',
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const { register } = this.props;
    const {
      username, email, password, password2,
    } = this.state;
    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      const newUser = { email, username, password };
      register(newUser);
    }
  };

  render() {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      return <Redirect to="/" />;
    }
    const {
      username, email, password, password2,
    } = this.state;
    return (
      <div className="comp">
        <form onSubmit={this.onSubmit}>
          <label>Nombre de usuario:</label>
          <input type="text" name="username" onChange={this.onChange} value={username} />
          <br />
          <label>e-mail:</label>
          <input type="text" name="email" onChange={this.onChange} value={email} />
          <br />
          <label>Contraseña:</label>
          <input type="text" name="password" onChange={this.onChange} value={password} />
          <br />
          <label>Repite la contraseña:</label>
          <input type="text" name="password2" onChange={this.onChange} value={password2} />
          <br />
          <button type="submit">Registrar</button>
          <div className="comp"><Link to="/login">Inicia sesión</Link></div>
        </form>
      </div>
    );
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
