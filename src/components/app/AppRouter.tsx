import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Trans } from '@lingui/macro';
import { PrivateRoute } from '@chia/core';
import SelectKey from '../selectKey/SelectKey';
import Dashboard from '../dashboard/Dashboard';
import type { RootState } from '../../modules/rootReducer';
import LayoutLoading from '../layout/LayoutLoading';

export default function AppRouter() {
  const walletConnected = useSelector(
    (state: RootState) => state.daemon_state.harvester_connected,
  );
  const logged_in_received = useSelector(
    (state: RootState) => state.harvester_state.logged_in_received,
  );
  const exiting = useSelector((state: RootState) => state.daemon_state.exiting);

  if (exiting) {
    return (
      <LayoutLoading>
        <Trans>Closing down node and server</Trans>
      </LayoutLoading>
    );
  }
  console.log('Here');

  if (!walletConnected) {
    return (
      <LayoutLoading>
        <Trans>Connecting to harvester</Trans>
      </LayoutLoading>
    );
  }
  console.log('Here');

  if (!logged_in_received) {
    return (
      <LayoutLoading>
        <Trans>Logging in</Trans>
      </LayoutLoading>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <SelectKey />
      </Route>{' '}
      <PrivateRoute path="/dashboard">
        <Dashboard />
      </PrivateRoute>
      <Route path="*">
        <Redirect to="/dashboard" />
      </Route>
    </Switch>
  );
}
