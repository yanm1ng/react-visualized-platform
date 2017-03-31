import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import Login from '../components/Login/index.jsx';
import Index from '../components/Index/index.jsx';
import Map from '../components/Map/index.jsx';
import City from '../components/City/index.jsx';
import Line from '../components/Line/index.jsx';

class App extends React.Component {
  render() {
    return (
      <div>
        <Router history={hashHistory}>
          <Route path="/index*" component={Index} />
          <Route path="/login" component={Login} />
        </Router>
        <Router history={hashHistory}>
          <Route path="/index">
            <IndexRoute component={Map} />
            <Route path="/index/map*" component={Map} />
            <Route path="/index/city*" component={City} />
            <Route path="/index/line*" component={Line} />
          </Route>
        </Router>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-content'));