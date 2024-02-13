import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import Home from './home/Home';
import Info from './home/Info';
import View from './view/View';
import Login from './accounts/Login';
import PrivateRoute from './common/PrivateRoute';
import Header from './common/Header';
import '../index.css';
import '../style.css';
import './App.css';

import store from '../store';
import { loadUser } from '../slices/authSlice';

function App() {
  store.dispatch(loadUser());

  return (
    <Provider store={store}>
      <Router>
        <div id="main">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/view/:graph_id" component={View} />
            <Route path="/info" component={Info} />
            {/*
              <Route exact path="/register" component={Register} />
              Signing up is disabled until all security concerns are dealt with
            */}
            <Route exact path="/login" component={Login} />
            <Home />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
