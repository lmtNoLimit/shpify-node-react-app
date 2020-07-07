import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MyLayout from 'components/layouts/MyLayout';

import Pages from 'pages/Pages';
import Products from 'pages/Products';
import AddPage from 'pages/AddPage';

function App() {
  return (
    <Router>
      <MyLayout>
        <Switch>
          <Route path='/pages/create' component={AddPage} />
          <Route path='/pages' component={Pages} />
          <Route path='/products' component={Products} />
        </Switch>
      </MyLayout>
    </Router>
  );
}

export default App;
