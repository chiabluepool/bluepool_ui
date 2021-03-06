import { service_harvester } from '../util/service_names';

export const harvesterMessage = () => ({
  type: 'OUTGOING_MESSAGE',
  message: {
    destination: service_harvester,
  },
});

export const pingHarvester = () => {
  const action = harvesterMessage();
  action.message.command = 'ping';
  action.message.data = {};
  return action;
};

export const getConnectionsHarvester = () => {
  const action = harvesterMessage();
  action.message.command = 'get_connections';
  action.message.data = {};
  return action;
};

export const getPlots = () => {
  const action = harvesterMessage();
  action.message.command = 'get_plots';
  action.message.data = {};
  return action;
};

export const getPlotDirectories = () => {
  const action = harvesterMessage();
  action.message.command = 'get_plot_directories';
  action.message.data = {};
  return action;
};

export const deletePlot = (filename) => {
  const action = harvesterMessage();
  action.message.command = 'delete_plot';
  action.message.data = { filename };
  return action;
};

export const refreshPlots = () => {
  const action = harvesterMessage();
  action.message.command = 'refresh_plots';
  action.message.data = {};
  return action;
};

export const addPlotDirectory = (dirname) => {
  const action = harvesterMessage();
  action.message.command = 'add_plot_directory';
  action.message.data = { dirname };
  return action;
};

export const removePlotDirectory = (dirname) => {
  const action = harvesterMessage();
  action.message.command = 'remove_plot_directory';
  action.message.data = { dirname };
  return action;
};

export const signInHarvester = (username, password) => {
  const action = harvesterMessage();
  action.message.command = 'add_user';
  action.message.data = { username, password };
  return action;
};

export const getAccountInfo = () => {
  const action = harvesterMessage();
  action.message.command = 'account_info';
  action.message.data = {};
  return action;
};

export const logOutHarvester = () => {
  const action = harvesterMessage();
  action.message.command = 'logout';
  action.message.data = { };
  return action;
};

export const loggedInHarvester = () => {
  const action = harvesterMessage();
  action.message.command = 'logged_in';
  action.message.data = { };
  return action;
};
