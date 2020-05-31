import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Spinner from './components/UI/Spinner/Spinner'
import * as actions from './store/actions/index';

const Logout = React.lazy(() => {
  return import('./containers/Auth/Logout/Logout');
});

const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignIn();
  }

  render() {

    let routes = (
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route path="/build-a-burger" component={BurgerBuilder} />
          <Route path="/auth" component={Auth} />
          <Redirect path="/" to="/build-a-burger" />
        </Switch>
      </Suspense >

    );

    if (this.props.isAuthenticated) {
      routes = (
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path="/build-a-burger" component={BurgerBuilder} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/orders" component={Orders} />
            <Route path="/auth" component={Auth} />
            <Route path="/signout" component={Logout} />
            <Redirect path="/" to="/build-a-burger" />
          </Switch>
        </Suspense>

      );
    }
    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignIn: () => dispatch(actions.authCheckState())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
