import React from 'react';
import { Trans } from '@lingui/macro';
import { Folder as FolderIcon, Delete as DeleteIcon } from '@material-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {
  add_plot_directory_and_refresh,
  remove_plot_directory_and_refresh,
} from '../../modules/message';
import type { RootState } from '../../modules/rootReducer';
import useSelectDirectory from '../../hooks/useSelectDirectory';
import WalletImport from '../selectKey/WalletImport';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PlotAddKeys(props: Props) {
  const { onClose, open } = props;
  const dispatch = useDispatch();
  const selectDirectory = useSelectDirectory({
    buttonLabel: 'Select Plot Directory',
  });

  const directories = useSelector(
    (state: RootState) => state.farming_state.harvester.plot_directories ?? [],
  );

  function handleClose() {
    onClose();
  }

  function removePlotDir(dir: string) {
    dispatch(remove_plot_directory_and_refresh(dir));
  }

  async function handleSelectDirectory() {
    const directory = await selectDirectory();
    if (directory) {
      dispatch(add_plot_directory_and_refresh(directory));
    }
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="lg"
      aria-labelledby="confirmation-dialog-title"
      open={open}
    >
      <DialogTitle id="confirmation-dialog-title">
        <Trans>Add Keys</Trans>
      </DialogTitle>
      <WalletImport></WalletImport>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="secondary">
          <Trans>Close</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
}

PlotAddKeys.defaultProps = {
  open: false,
  onClose: () => {},
};