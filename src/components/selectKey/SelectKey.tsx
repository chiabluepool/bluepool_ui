import React from 'react';
import { Trans } from '@lingui/macro';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ConfirmDialog, Flex, Button, Link, Logo } from '@chia/core';
import {
  Card,
  Typography,
  Container,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@material-ui/icons';
import LayoutHero from '../layout/LayoutHero';
import {
  login_action,
  delete_key,
  get_private_key,
  selectFingerprint,
  delete_all_keys,
  sign_in,
} from '../../modules/message';
import { resetMnemonic } from '../../modules/mnemonic';
import type { RootState } from '../../modules/rootReducer';
import type Fingerprint from '../../types/Fingerprint';
import useOpenDialog from '../../hooks/useOpenDialog';
import { signInHarvester } from '../../modules/harvesterMessages';

const StyledFingerprintListItem = styled(ListItem)`
  padding-right: ${({ theme }) => `${theme.spacing(11)}px`};
`;

export default function SelectKey() {
  const dispatch = useDispatch();
  let email_input: HTMLInputElement;
  let password_input: HTMLInputElement;

  async function handle_sign_in() {
    console.log(email_input.value);
    console.log(password_input.value);
    dispatch(sign_in(email_input.value, password_input.value));
  }

  return (
    <LayoutHero>
      <Container maxWidth="xs">
        <Flex flexDirection="column" alignItems="center" gap={3}>
          <Logo width={130} />

          <Typography variant="h5" component="h1" gutterBottom>
            <Trans>Sign In</Trans>
          </Typography>
          <Typography variant="subtitle1">
            <Trans>
              Welcome to Bluepool harvester. If you don't have an acount yet go
              to bluepool.io and register.
            </Trans>
          </Typography>

          <TextField
            id="filled-secondary"
            variant="filled"
            color="secondary"
            fullWidth
            inputRef={(input) => {
              email_input = input;
            }}
            label={<Trans>Email</Trans>}
          />
          <TextField
            id="filled-secondary"
            variant="filled"
            color="secondary"
            type="password"
            fullWidth
            inputRef={(input) => {
              password_input = input;
            }}
            label={<Trans>Password</Trans>}
          />
          <Flex
            flexDirection="column"
            gap={3}
            alignItems="stretch"
            alignSelf="stretch"
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              onClick={handle_sign_in}
              fullWidth
            >
              <Trans>Sign In</Trans>
            </Button>
          </Flex>
        </Flex>
      </Container>
    </LayoutHero>
  );
}
