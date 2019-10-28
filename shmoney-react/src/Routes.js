import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import all routes here
import AppliedRoute from './components/util/AppliedRoute';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/signIn" exact component={SignIn} props={childProps} />
    <AppliedRoute path="/signUp" exact component={SignUp} props={childProps} />
    {/* Finally, catch all unmounted routes */}
    <Route component={NotFound} props={childProps}/>
  </Switch>;