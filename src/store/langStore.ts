import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LangStore = {
  lang: 'kk' | 'ru';
  setLang: (lang: 'kk' | 'ru') => void;
};

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: 'kk',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'lang-storage',
    }
  )
);
