import { getPreferenceValues } from '@raycast/api';
import { exec } from 'child_process';
import util from 'util';
import { RayacastPreferences } from './types';
import { REGEXP_VPN } from './utils';
import { IVPN } from './vpn.entity';

const CMD_PATH = '/usr/sbin/scutil';
const VPN_LIST = `${CMD_PATH} --nc list | grep "Shadowrocket"`;

const toggleVPN = async () => {
  const preferences = getPreferenceValues<RayacastPreferences>();
  const VPN_NAME = preferences.vpnName;
  console.log(VPN_NAME);
  let vpnInstance: IVPN;
  const execAsync = util.promisify(exec);
  const { stdout } = await execAsync(VPN_LIST);
  const splitedResult = stdout.split('\n').find((str) => str.includes(VPN_NAME));
  const parsedData = REGEXP_VPN.exec(splitedResult);
  /* if (splitedResult) {
								vpnInstance = new VpnEntity(parsedData[2], parsedData[3], parsedData[1]);
							 } else {
								return;
							 }
							 if (splitedResult && vpnInstance.status) {
								if (parsedData) {
								  const execAsync = util.promisify(exec);
								  await execAsync(`${CMD_PATH} --nc stop ${vpnInstance.id}`);
								  await showHUD('VpnEntity DISCONNECTED', { popToRootType: PopToRootType.Immediate });
								}
							 } else {
								await showHUD('NOT FOUND VPNs', { popToRootType: PopToRootType.Immediate });
							 } */
};

export default function Command() {
  void toggleVPN();
}
