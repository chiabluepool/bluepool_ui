import { useSelector } from 'react-redux';
import type { RootState } from '../modules/rootReducer';
import FarmerStatus from '../constants/FarmerStatus';

export default function useFarmerStatus(): FarmerStatus {
  const harvesterConnected = useSelector(
    (state: RootState) => state.daemon_state.harvester_connected,
  );

  if (!harvesterConnected) {
    return FarmerStatus.NOT_CONNECTED;
  }

  return FarmerStatus.FARMING;
}
