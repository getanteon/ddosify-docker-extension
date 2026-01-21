import { Protocol } from '../types';

export interface ProtocolOption {
  value: Protocol;
  label: string;
}

export const PROTOCOLS: ProtocolOption[] = [
  { value: 'https', label: 'HTTPS' },
  { value: 'http', label: 'HTTP' },
];
