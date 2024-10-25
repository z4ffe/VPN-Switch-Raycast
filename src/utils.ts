import { exec } from 'child_process';
import util from 'util';

export const executeScript = async (command: string) => {
  const execAsync = util.promisify(exec);
  const { stdout } = await execAsync(command);
  return stdout;
};
