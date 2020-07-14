import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MyLayout from 'components/layouts/MyLayout';

const Pages = React.lazy(() => import('pages/Pages'));
const Products = React.lazy(() => import('pages/Products'));
const PageCreate = React.lazy(() => import('pages/PageCreate'));
const PageDetail = React.lazy(() => import('pages/PageDetail'));

function App() {
  return (
    <Router>
      <MyLayout>
        <Switch>
          <Route path='/pages/create' component={PageCreate} />
          <Route path='/pages/:id' component={PageDetail} />
          <Route path='/pages' component={Pages} />
          <Route path='/products' component={Products} />
        </Switch>
      </MyLayout>
    </Router>
  );
}

export default App;
