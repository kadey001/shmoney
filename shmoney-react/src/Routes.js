import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import all routes here
import AppliedRoute from './components/util/AppliedRoute';
import Home from './containers/Home';
import NotFound from './containers/NotFound';
import Profile from './containers/Profile';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import UploadImage from './components/UploadImage';
import SearchUsers from './components/SearchUsers';
import CreateGroup from './components/CreateGroup';

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/signIn" exact component={SignIn} props={childProps} />
    <AppliedRoute path="/signUp" exact component={SignUp} props={childProps} />
    <AppliedRoute path="/profile" exact component={Profile} props={childProps} />
    <AppliedRoute path="/updateProfilePicture" exact component={UploadImage} props={childProps} />
    <AppliedRoute path="/search" exact component={SearchUsers} props={childProps} />
    <AppliedRoute path="/createGroup" exact component={CreateGroup} props={childProps} />
    {/* Finally, catch all unmounted routes */}
    <AppliedRoute component={NotFound} props={childProps}/>
  </Switch>;