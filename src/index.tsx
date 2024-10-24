import { Action, ActionPanel, Detail, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { exec } from "child_process";
import util from "util";

const CMD_PATH = "/usr/sbin/scutil";
const VPN_LIST = `${CMD_PATH} --nc list | grep "Shadowrocket"`;
const REG_VPN = /(\(\w+\))\s+([\w-]+?)\s+VPN\s+\(.*?"(.*?)"?\s+\[VPN:/gm;
const VPN_NAME: string = "Shadowrocket";

interface IVPN {
  id: number
  name: string
  status: boolean
}

class VPN implements IVPN {
  public id
  public name
  public status

  constructor(id: number, name: string, status: string) {
    this.id = id;
    this.name = name;
    this.status = status.includes("(Connected)");
  }
}

export default function Command() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [vpnInstance, setVpnInstance] = useState<IVPN>()

  const checkVPN = async () => {
    const execAsync = util.promisify(exec);
    const { stdout } = await execAsync(VPN_LIST);
    const splitedResult = stdout
      .split("\n")
      .find((str) => str.includes(VPN_NAME));
    if (splitedResult) {
      const parsedData = REG_VPN.exec(splitedResult);
      setVpnInstance( new VPN(parsedData[2], parsedData[3], parsedData[1]))
    }
    setResult(vpnInstance?.id);
    setLoading(false);
  };

  useEffect(() => {
    void checkVPN();
  }, []);

  return (
    <>
      <Detail markdown="# Hello Worldss" actions={ <ActionPanel>
        <ActionPanel.Section>
          <Action title="asd" onAction={() => setResult("asd")} />
        </ActionPanel.Section>
      </ActionPanel>}/>
      <List navigationTitle="HEY" isLoading={loading}>
        <List.Item
          title={'asd'}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action title="asd" onAction={() => console.log(vpnInstance)} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        ></List.Item>
      </List>
    </>
  );
}
