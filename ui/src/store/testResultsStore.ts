import { create } from 'zustand';
import { ParsedResult } from '../utils/resultParser';

interface TestResultsState {
  isRunning: boolean;
  result: ParsedResult | null;
  streamOutput: string;
  error: string | null;
  enableDownload: boolean;
  setRunning: (running: boolean) => void;
  setResult: (result: ParsedResult | null) => void;
  appendStreamOutput: (output: string) => void;
  clearStreamOutput: () => void;
  setError: (error: string | null) => void;
  setEnableDownload: (enable: boolean) => void;
  reset: () => void;
}

const clearEmoji = (str: string): string => {
  return str
    .replace('â\x9A\x99ï¸\x8F  ', '  ')
    .replace('ð\x9F\x94¥ ', ' ')
    .replace('ð\x9F\x9B\x91 ', '')
    .replace('â\x9C\x94ï¸\x8F  ', ' ')
    .replace('â\x9D\x8C ', ' ')
    .replace('â\x8F±ï¸\x8F  ', ' ')
    .replace('CTRL+C to gracefully stop.', '');
};

export const useTestResultsStore = create<TestResultsState>()((set) => ({
  isRunning: false,
  result: null,
  streamOutput: '',
  error: null,
  enableDownload: false,

  setRunning: (running) => set({ isRunning: running }),

  setResult: (result) => set({ result, enableDownload: result !== null }),

  appendStreamOutput: (output) =>
    set((state) => {
      const cleanOutput = clearEmoji(output);
      const newOutput = state.streamOutput.includes('Initializing')
        ? cleanOutput
        : state.streamOutput + cleanOutput;
      return { streamOutput: newOutput };
    }),

  clearStreamOutput: () => set({ streamOutput: '' }),

  setError: (error) => set({ error }),

  setEnableDownload: (enable) => set({ enableDownload: enable }),

  reset: () =>
    set({
      isRunning: false,
      result: null,
      streamOutput: '',
      error: null,
      enableDownload: false,
    }),
}));
