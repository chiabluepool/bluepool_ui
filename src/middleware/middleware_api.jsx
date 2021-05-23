import React from 'react';
import { Trans } from '@lingui/macro';
import { AlertDialog } from '@chia/core';
import styled from 'styled-components';
import { Grid, Typography } from '@material-ui/core';
import {
  get_address,
  format_message,
  incomingMessage,
  get_balance_for_wallet,
  get_transactions,
  get_height_info,
  get_sync_status,
  get_connection_info,
  get_colour_info,
  get_colour_name,
  did_get_recovery_list,
  did_get_did,
  pingWallet,
  get_farmed_amount,
  getNetworkInfo,
} from '../modules/message';

import { offerParsed, resetTrades } from '../modules/trade';
import { openDialog, openErrorDialog } from '../modules/dialog';
import {
  service_plotter,
  service_harvester,
} from '../util/service_names';

import {
  getPlots,
  getPlotDirectories,
  pingHarvester,
  refreshPlots,
  loggedInHarvester
} from '../modules/harvesterMessages';
import { plottingStopped } from '../modules/plotter_messages';
import { plotQueueInit, plotQueueUpdate } from '../modules/plotQueue';
import { startService, startServiceTest } from '../modules/daemon_messages';
import { get_all_trades } from '../modules/trade_messages';
import { push } from 'connected-react-router';

const StyledTypographyDD = styled(Typography)`
  word-break: break-all;
`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ping_harvester(store) {
  store.dispatch(pingHarvester());
  await sleep(1000);
  const state = store.getState();
  const { harvester_connected } = state.daemon_state;
  if (!harvester_connected) {
    ping_harvester(store);
  }
}

export function refreshAllState() {
  return async (dispatch, getState) => {
    dispatch(startService(service_harvester));

    dispatch(getNetworkInfo());
    dispatch(get_connection_info());

    dispatch(getPlots());
    dispatch(getPlotDirectories());
  };
}

export const handle_message = async (store, payload, errorProcessed) => {
  const { dispatch } = store;
  const { command } = payload;
  const stateBefore = store.getState();

  await store.dispatch(incomingMessage(payload));
  if (payload.command === 'ping') {
      if (payload.origin === service_harvester) {
      // get plots is working only when harcester is connected
      const state = store.getState();
      if (!state.farming_state.logged_in_received) {
        store.dispatch(loggedInHarvester())
      }
      if (!state.farming_state.harvester?.plots) {
        store.dispatch(getPlots());
      }
      if (!state.farming_state.harvester?.plot_directories) {
        store.dispatch(getPlotDirectories());
      }
    }
  } else if (payload.command === 'delete_plot') {
    store.dispatch(refreshPlots());
  } else if (payload.command === 'refresh_plots') {
    store.dispatch(getPlots());
  }  else if (payload.command === 'register_service') {
    const { service, queue } = payload.data;
    if (service === service_plotter) {
      store.dispatch(plotQueueInit(queue));
    }
  } else if (payload.command === 'state_changed') {
    const { origin } = payload;
    const { state } = payload.data;

    if (origin === service_plotter) {
      const { queue, state } = payload.data;
      await store.dispatch(plotQueueUpdate(queue, state));
      // updated state of the plots
      if (state === 'state') {
        store.dispatch(refreshPlots());
      }
    }
  } else if (payload.command === 'start_service') {
    const { service } = payload.data;
    if (payload.data.success) {
      if (service === service_harvester) {
        ping_harvester(store);
      }
    } else if (payload.data.error.includes('already running')) {
      if (service === service_harvester) {
        ping_harvester(store);
      } else if (service === service_plotter) {
      }
    }
  } else if (payload.command === 'stop_service') {
    if (payload.data.success) {
      if (payload.data.service_name === service_plotter) {
        await store.dispatch(plottingStopped());
      }
    }
  } else if (payload.command === 'logged_in') {
    if (payload.data.logged_in) {
      store.dispatch(push('/dashboard'));
    }
  }
  if (payload.data.success === false) {
    if (
      payload.data.error.includes('already running') ||
      payload.data.error === 'not_initialized'
    ) {
      return;
    }

    // DEPRECATED we will throw Error instead
    if (payload.data.error && !errorProcessed) {
      store.dispatch(openErrorDialog(payload.data.error));
    }
  }
};
