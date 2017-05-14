import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Login from '../components/Login/index.jsx';

import Map from '../components/Map/index.jsx';
import City from '../components/City/index.jsx';
import Line from '../components/Line/index.jsx';
import Cookie from '../common/cookie.js';


function requireEnter (nextState, replace) {

  if (Cookie.get('login') == 'false') {
    window.location.hash = '#/login/'
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path="login" component={Login} onEnter={requireEnter}/>
          <Route path="map" component={Map} onEnter={requireEnter}/>
          <Route path="city" component={City} onEnter={requireEnter}/>
          <Route path="line" component={Line} onEnter={requireEnter}/>
        </Router>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-content'));