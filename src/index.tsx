import { getPreferenceValues } from '@raycast/api';
import { exec } from 'child_process';
import util from 'util';
import { CMD_PATH, REGEXP_VPN } from './constants';
import { RayacastPreferences } from './types';
import { IVPN, VPN } from './vpn.entity';

let VPN_INSTANCE: IVPN;

const executeScript = async (command: string) => {
  const execAsync = util.promisify(exec);
  const { stdout } = await execAsync(command);
  return stdout;
};

const findVpn = async (vpnName: string) => {
  const VPN_LIST = `${CMD_PATH} --nc list | grep "${vpnName}"`;
  const result = await executeScript(VPN_LIST);
  const splittedResult = result.split('\n').find((str) => str.includes(vpnName));
  if (splittedResult) {
    const parsedVpnData = REGEXP_VPN.exec(splittedResult);
    VPN_INSTANCE = new VPN(parsedVpnData[2], parsedVpnData[3], parsedVpnData[1]);
  }
};

const toggleVPN = async (vpnName: string) => {
  await findVpn(vpnName);
  if (!VPN_INSTANCE.status) {
    await executeScript(`${CMD_PATH} --nc start ${VPN_INSTANCE.id}`);
  } else {
    await executeScript(`${CMD_PATH} --nc stop ${VPN_INSTANCE.id}`);
  }
};

export default async function Command() {
  const { vpnName } = getPreferenceValues<RayacastPreferences>();
  await toggleVPN(vpnName);
}
