import { service_harvester, service_wallet } from '../util/service_names';
import type Wallet from '../types/Wallet';
import createWallet from '../util/createWallet';
import type FarmingInfo from '../types/FarmingInfo';

type IncomingState = {
  mnemonic: string[];
  logged_in_received: boolean;
  logged_in: boolean;
  status: {
    connections: [];
    connection_count: number;
    syncing: boolean;
    synced: boolean;
    height?: number;
  };
  server_started?: boolean;
  email: string;
  balance: number;
  total_partials: number;
  total_plots: number;
  connected: boolean;
  network_info?: {
    network_name: string;
    network_prefix: string;
  };
  last_farming_info: FarmingInfo[];
};

const initialState: IncomingState = {
  mnemonic: [],
  logged_in_received: false,
  logged_in: false,
  email: '',
  balance: 0,
  connected: false,
  total_partials: 0,
  total_plots: 0,
  status: {
    connections: [],
    connection_count: 0,
    syncing: false,
    synced: false,
  },
  last_farming_info: [],
};

export default function incomingReducer(
  state: IncomingState = { ...initialState },
  action: any,
): IncomingState {
  switch (action.type) {
    case 'LOG_OUT':
      return {
        ...initialState,
        logged_in_received: true,
      };
    case 'INCOMING_MESSAGE':
      if (action.message.origin !== service_harvester) {
        return state;
      }

      const { message } = action;
      const { data } = message;
      const { command } = message;
      let success;
      let wallets;
      console.log(data);
      console.log(action);

      if (command === 'ping') {
        const started = data.success;
        return { ...state, server_started: started };
      }
      if (command === 'account_info') {
        return {
          ...state,
          email: data.email,
          balance: data.balance,
          total_partials: data.total_partials,
          total_plots: data.total_plots,
        };
      }
      if (command === 'changed_state') {
        console.log(data);
      } else if (command === 'get_connections') {
        if (data.connections.length > 0) {
          return { ...state, connected: true };
        }
        return { ...state, connected: false };
      } else if (command === 'logged_in') {
        if (data.logged_in) {
          return { ...state, logged_in_received: true, logged_in: true };
        }
        return { ...state, logged_in_received: true, logged_in: false };
      } else if (command === 'farming_info') {
        const last_farming_info = [data, ...state.last_farming_info];
        return {
          ...state,
          connected: true,
          last_farming_info,
        };
      }

      return state;
    default:
      return state;
  }
}
