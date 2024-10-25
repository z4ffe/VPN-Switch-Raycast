import { getPreferenceValues, PopToRootType, showHUD } from '@raycast/api';
import { CMD_PATH, DEFAULT_ERROR, ERROR_DESC_VPN_NOT_FOUND, ERROR_VPN_NOT_FOUND, REGEXP_VPN } from './constants';
import { IVPN, RayacastPreferences } from './types';
import { executeScript } from './utils';
import { VPN } from './vpn.entity';

let VPN_INSTANCE: IVPN;

const findVpn = async (vpnName: string) => {
  const VPN_LIST = `${CMD_PATH} --nc list | grep "${vpnName}"`;
  try {
    const result = await executeScript(VPN_LIST);
    const splittedResult = result.split('\n').find((str) => str.includes(vpnName));
    if (splittedResult) {
      const parsedVpnData = REGEXP_VPN.exec(splittedResult) as string[];
      VPN_INSTANCE = new VPN(parsedVpnData[2], parsedVpnData[3], parsedVpnData[1]);
    }
  } catch (error) {
    await showHUD(ERROR_VPN_NOT_FOUND, { popToRootType: PopToRootType.Immediate });
    throw new Error(ERROR_DESC_VPN_NOT_FOUND);
  }
};

const toggleVPN = async (vpnName: string) => {
  await findVpn(vpnName);
  try {
    if (!VPN_INSTANCE.status) {
      await executeScript(`${CMD_PATH} --nc start ${VPN_INSTANCE.id}`);
      await showHUD(`✅ ${VPN_INSTANCE.name} VPN is connected`);
    } else {
      await executeScript(`${CMD_PATH} --nc stop ${VPN_INSTANCE.id}`);
      await showHUD(`🔴 ${VPN_INSTANCE.name} VPN is disconnected`);
    }
  } catch (error) {
    await showHUD(DEFAULT_ERROR, { popToRootType: PopToRootType.Immediate });
    throw new Error(DEFAULT_ERROR);
  }
};

export default async function Command() {
  const { vpnName } = getPreferenceValues<RayacastPreferences>();
  await toggleVPN(vpnName);
}
