import { create } from 'zustand';

export const useStore = create((set) => ({
  // Authentication State
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // Global Toast Notifications State
  toastMessage: '',
  toastType: 'success',
  isToastOpen: false,
  triggerToast: (message, type = 'success') => set({
    toastMessage: message,
    toastType: type,
    isToastOpen: true
  }),
  closeToast: () => set({ isToastOpen: false }),

  // Lands State
  lands: [
    { id: 'land-1', name: 'North Paddy Plot', area: '1.2 Acres', landType: 'wetland', soilType: 'alluvial', measurementMethod: 'gps' }
  ],
  addLand: (land) => set((state) => ({ lands: [...state.lands, land] })),
  removeLand: (landId) => set((state) => ({ lands: state.lands.filter((l) => l.id !== landId) })),

  // Inventory State
  inventory: [
    { id: 'inv-1', name: 'Groundnut Kernels', type: 'seed', quantity: 20, unit: 'kg', lastUpdated: '06/08/2026' },
    { id: 'inv-2', name: 'Paddy Seeds (CO-51)', type: 'seed', quantity: 40, unit: 'kg', lastUpdated: '06/09/2026' },
    { id: 'inv-3', name: 'Gypsum Fertilizer', type: 'fertilizer', quantity: 120, unit: 'kg', lastUpdated: '06/10/2026' },
    { id: 'inv-4', name: 'Urea Fertilizer', type: 'fertilizer', quantity: 15, unit: 'kg', lastUpdated: '06/07/2026' },
    { id: 'inv-5', name: 'Potash Fertilizer', type: 'fertilizer', quantity: 30, unit: 'kg', lastUpdated: '06/08/2026' }
  ],
  addInventoryItem: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  updateInventoryItem: (updatedItem) => set((state) => ({
    inventory: state.inventory.map((item) => item.id === updatedItem.id ? updatedItem : item)
  })),
  removeInventoryItem: (itemId) => set((state) => ({
    inventory: state.inventory.filter((item) => item.id !== itemId)
  })),
  deductInventoryStock: (requirements) => set((state) => ({
    inventory: state.inventory.map((invItem) => {
      const req = requirements.find(r => 
        r.name.toLowerCase().trim() === invItem.name.toLowerCase().trim() && 
        r.type === invItem.type
      );
      if (req) {
        return {
          ...invItem,
          quantity: Math.max(0, invItem.quantity - req.quantity),
          lastUpdated: new Date().toLocaleDateString()
        };
      }
      return invItem;
    })
  })),

  // Sowing Logs / Planted Crops State
  plantedCrops: [],
  addPlantedCrop: (planted) => set((state) => ({ plantedCrops: [...state.plantedCrops, planted] })),
  removePlantedCrop: (index) => set((state) => ({
    plantedCrops: state.plantedCrops.filter((_, idx) => idx !== index)
  })),

  // Harvest History Logs State
  harvestHistory: [
    {
      id: 'historic-1',
      cropName: 'Groundnut',
      cropIcon: '🥜',
      landName: 'North Paddy Plot',
      sownDate: '02/15/2026',
      harvestDate: '05/27/2026',
      durationDays: 102,
      yieldEst: '1.8 Tons/Acre',
      journalLogs: [
        { day: 1, date: '02/15/2026', note: "Sowed groundnut seeds in dry raised beds. Soil moisture is optimal." },
        { day: 45, date: '03/31/2026', note: "Irrigated lightly for pegging phase. Gypsum applied to shell." },
        { day: 102, date: '05/27/2026', note: "Harvested golden groundnuts. Pods detached and spread to dry." }
      ]
    }
  ],
  addHarvestRecord: (record) => set((state) => ({ harvestHistory: [record, ...state.harvestHistory] })),
  removeHarvestRecord: (recordId) => set((state) => ({
    harvestHistory: state.harvestHistory.filter((r) => r.id !== recordId)
  }))
}));
