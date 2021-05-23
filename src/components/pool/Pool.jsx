import React from 'react';
import { Trans } from '@lingui/macro';
import { get } from 'lodash';
import {
  FormatBytes,
  Flex,
  Card,
  Loading,
  StateColor,
  Table,
} from '@chia/core';
import { Status } from '@chia/icons';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Grid, Tooltip, Typography } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { unix_to_short_date } from '../../util/utils';
import LayoutMain from '../layout/LayoutMain';
import { mojo_to_chia } from '../../util/chia';
import FarmLastAttemptedProof from '../farm/FarmLastAttemptedProof';
/* global BigInt */

const cols = [
  {
    minWidth: '250px',
    field(row) {
      const { isFinished = false, header_hash, foliage } = row;

      const { foliage_transaction_block_hash } = foliage || {};

      const value = isFinished ? (
        header_hash
      ) : (
        <span>{foliage_transaction_block_hash}</span>
      );

      const color = isFinished ? StateColor.SUCCESS : StateColor.WARNING;

      const tooltip = isFinished ? (
        <Trans>Finished</Trans>
      ) : (
        <Trans>In Progress</Trans>
      );

      return (
        <Flex gap={1} alignItems="center">
          <Tooltip title={<span>{tooltip}</span>}>
            <Status color={color} />
          </Tooltip>
          <Tooltip title={<span>{value}</span>}>
            <Box textOverflow="ellipsis" overflow="hidden">
              {value}
            </Box>
          </Tooltip>
        </Flex>
      );
    },
    title: <Trans>Header Hash</Trans>,
  },
  {
    field(row) {
      const { isFinished, foliage } = row;

      const { height: foliageHeight } = foliage || {};

      const height = get(row, 'reward_chain_block.height');

      if (!isFinished) {
        return <i>{foliageHeight}</i>;
      }

      return height;
    },
    title: <Trans>Height</Trans>,
  },
  {
    field(row) {
      const { isFinished } = row;

      const timestamp = get(row, 'foliage_transaction_block.timestamp');
      const value = timestamp;

      return value ? unix_to_short_date(Number.parseInt(value)) : '';
    },
    title: <Trans>Time Created</Trans>,
  },
  {
    field(row) {
      const { isFinished = false } = row;

      return isFinished ? <Trans>Finished</Trans> : <Trans>Unfinished</Trans>;
    },
    title: <Trans>State</Trans>,
  },
];

const getStatusItems = (email, connected, networkInfo, balance, total_partials, total_plots) => {
  console.log(email)
  console.log(connected)
  console.log(networkInfo)
  console.log(balance)

  const status_items = [];
  status_items.push({
    label: <Trans>Email</Trans>,
    value: email,
  });
  if (connected) {
    status_items.push({
      label: <Trans>Connection Status</Trans>,
      value: connected ? (
        <Trans>Connected</Trans>
      ) : (
        <Trans>Not connected</Trans>
      ),
      colour: connected ? '#3AAC59' : 'red',
    });
  } else {
    const item = {
      label: <Trans>Status</Trans>,
      value: <Trans>Not connected</Trans>,
      colour: 'black',
    };
    status_items.push(item);
  }

  const networkName = networkInfo
  status_items.push({
    label: <Trans>Network Name</Trans>,
    value: networkName,
  });

  status_items.push({
    label: <Trans>Partial Proofs </Trans>,
    value: total_partials,
    tooltip: (
      <Trans>
        Number of partial proofs in last 24 hours
      </Trans>
    ),
  });

  status_items.push({
    label: <Trans>Plots being farmed</Trans>,
    value: total_plots,
    tooltip: (
      <Trans>
        Number of plots used for farming. (includes all harvesters linked to this account)
      </Trans>
    ),
  });

  // const space_item = {
  //   label: <Trans>Estimated network space</Trans>,
  //   value: <FormatBytes value={state.space} precision={3} />,
  //   tooltip: (
  //     <Trans>
  //       Estimated sum of all the plotted disk space of all farmers in the
  //       network
  //     </Trans>
  //   ),
  // };
  // status_items.push(space_item);
  const val = BigInt(balance.toString());
  const chia_val = mojo_to_chia(val);
  const space_item_pool = {
    label: <Trans>Balance</Trans>,
    value: chia_val + " XCH",
    tooltip: (
      <Trans>
        Your current balance. Go to bluepool.io to make a withdrawal.
      </Trans>
    ),
  };
  status_items.push(space_item_pool);

  return status_items;
};

const StatusCell = (props) => {
  const { item } = props;
  const { label } = item;
  const { value } = item;
  const { tooltip } = item;
  const { colour } = item;
  return (
    <Grid item xs={12} md={6}>
      <Flex mb={-2} alignItems="center">
        <Flex flexGrow={1} gap={1} alignItems="center">
          <Typography variant="subtitle1">{label}</Typography>
          {tooltip && (
            <Tooltip title={tooltip}>
              <HelpIcon style={{ color: '#c8c8c8', fontSize: 12 }} />
            </Tooltip>
          )}
        </Flex>
        <Typography variant="subtitle1">
          <span style={colour ? { color: colour } : {}}>{value}</span>
        </Typography>
      </Flex>
    </Grid>
  );
};

const PoolStatus = (props) => {
  const connected = useSelector(
    (state) => state.harvester_state.connected,
  );

  var balance = useSelector(
    (state) => state.harvester_state.balance,
  );
  const email = useSelector(
    (state) => state.harvester_state.email,
  );
  const partials_today = useSelector(
    (state) => state.harvester_state.total_partials,
  );
  const total_plots = useSelector(
    (state) => state.harvester_state.total_plots,
  );
  const networkInfo = "Mainnet"
  if (!balance) {
    balance = 0
  }
  const statusItems =  getStatusItems(email, connected, networkInfo, balance, partials_today, total_plots);

  return (
    <Card title={<Trans>Pool Farming</Trans>}>
      {statusItems ? (
        <Grid spacing={4} container>
          {statusItems.map((item) => (
            <StatusCell item={item} key={item.label.props.id} />
          ))}
        </Grid>
      ) : (
        <Flex justifyContent="center">
          <Loading />
        </Flex>
      )}
    </Card>
  );
};

export default function Pool() {
  return (
    <LayoutMain title={<Trans>Pool</Trans>}>
      <Flex flexDirection="column" gap={3}>
        <PoolStatus />
        <FarmLastAttemptedProof />
      </Flex>
    </LayoutMain>
  );
}
