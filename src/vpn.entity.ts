import { IVPN } from './types';

export class VPN implements IVPN {
  public id;
  public name;
  public status;

  constructor(id: string, name: string, status: string) {
    this.id = id;
    this.name = name;
    this.status = status.includes('(Connected)');
  }
}
