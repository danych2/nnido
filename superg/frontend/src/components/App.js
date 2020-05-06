import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect, Link, useLocation } from 'react-router-dom';

import Home from './home/Home';
import View from './view/View';
import Login from './accounts/Login';
import Register from './accounts/Register';
import PrivateRoute from './common/PrivateRoute';
import Header from './common/Header';

import { Provider } from 'react-redux';
import store from '../store';
import { loadUser } from '../actions/auth';

class App extends Component {

  render() {
    store.dispatch(loadUser());
    return (
    <Provider store={store}>
      <Router>
          <Header />
          <Switch>
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute path="/view/:graph_id" component={View} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          <Home />
          </Switch>
        </Router>
      </Provider>
    )
  };
}

ReactDOM.render(<App />, document.getElementById('app'));
