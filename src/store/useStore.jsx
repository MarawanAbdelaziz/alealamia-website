import { create } from 'zustand'

export const useStore = create((set) => ({
  home: '',
  goToHome: (check) => set({ home: check })
}))

// bears: 0,
// increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
// removeAllBears: () => set({ bears: 0 }),
// updateBears: (newBears) => set({ bears: newBears })
