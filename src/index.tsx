import { Detail, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { exec } from "child_process";
import util from "util";

export default function Command() {
  const [result, setResult] = useState('')
  const CMD_PATH = "/usr/sbin/scutil";
  const VPN_LIST = `${CMD_PATH} --nc list | grep "Shadowrocket"`;

  const checkVPN = async () => {
    const execAsync = util.promisify(exec);
    const { stdout } = await execAsync(VPN_LIST);
    setResult(stdout)
  };

  useEffect(() => {
    void checkVPN()
  }, []);

  return (
    <>
      <Detail markdown="# Hello Worldss" />
      <List navigationTitle="HEY">
        <List.Item title={result}></List.Item>
      </List>
    </>
  );
}
