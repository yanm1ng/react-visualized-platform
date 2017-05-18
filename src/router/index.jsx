import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Login from '../components/Login/index.js';
import Map from '../components/Map/index.js';
import City from '../components/City/index.js';
import Line from '../components/Line/index.js';

import Cookie from '../common/cookie.js';

function requireEnter(nextState, replace) {
  if (Cookie.get('login') == 'false') {
    window.location.hash = '#/'
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path="/" getComponent={Login} onEnter={requireEnter} />
          <Route path="map" getComponent={Map} onEnter={requireEnter} />
          <Route path="city" getComponent={City} onEnter={requireEnter} />
          <Route path="line" getComponent={Line} onEnter={requireEnter} />
        </Router>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-content'));