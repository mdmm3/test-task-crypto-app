import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LOCALSTORAGE_KEYS, USER_MOCK_CREDENTIALS } from '@/shared/const';

interface AuthState {
  isAuthorized: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthorized: false,

      login: (username, password) => {
        if (username === USER_MOCK_CREDENTIALS.username && password === USER_MOCK_CREDENTIALS.password) {
          set({ isAuthorized: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthorized: false });
      },
    }),
    {
      name: LOCALSTORAGE_KEYS.authStorage,
      partialize: (state) => ({ isAuthorized: state.isAuthorized }),
    }
  )
);

export default useAuthStore;