import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const auth = getAuth();
  
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default ProtectedRoute;