import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface NotificationStore {
  readIds: number[];
  markAllRead: (ids: number[]) => void;
  clearReadIds: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      readIds: [],
      markAllRead: (ids) =>
        set((state) => ({
          readIds: Array.from(new Set([...state.readIds, ...ids])),
        })),
      clearReadIds: () => set({ readIds: [] }),
    }),
    {
      name: "gudocs-notification-read",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ readIds: state.readIds }),
    },
  ),
);
