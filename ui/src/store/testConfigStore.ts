import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TestOptions, Header, DEFAULT_OPTIONS, DEFAULT_HEADER } from '../types';

interface TestConfigState {
  options: TestOptions;
  headers: Header[];
  setOption: <K extends keyof TestOptions>(key: K, value: TestOptions[K]) => void;
  setOptions: (options: Partial<TestOptions>) => void;
  resetOptions: () => void;
  addHeader: () => void;
  updateHeader: (id: string, key: string, value: string) => void;
  removeHeader: (id: string) => void;
  resetHeaders: () => void;
}

export const useTestConfigStore = create<TestConfigState>()(
  persist(
    (set) => ({
      options: DEFAULT_OPTIONS,
      headers: [{ ...DEFAULT_HEADER, id: crypto.randomUUID() }],

      setOption: (key, value) =>
        set((state) => ({
          options: { ...state.options, [key]: value },
        })),

      setOptions: (newOptions) =>
        set((state) => ({
          options: { ...state.options, ...newOptions },
        })),

      resetOptions: () =>
        set(() => ({
          options: DEFAULT_OPTIONS,
        })),

      addHeader: () =>
        set((state) => ({
          headers: [...state.headers, { id: crypto.randomUUID(), key: '', value: '' }],
        })),

      updateHeader: (id, key, value) =>
        set((state) => ({
          headers: state.headers.map((header) =>
            header.id === id ? { ...header, key, value } : header
          ),
        })),

      removeHeader: (id) =>
        set((state) => ({
          headers: state.headers.filter((header) => header.id !== id),
        })),

      resetHeaders: () =>
        set(() => ({
          headers: [{ ...DEFAULT_HEADER, id: crypto.randomUUID() }],
        })),
    }),
    {
      name: 'ddosify-config',
      partialize: (state) => ({
        options: state.options,
        headers: state.headers,
      }),
    }
  )
);
