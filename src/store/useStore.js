import { create } from 'zustand';

export const useStore = create((set) => ({
  // Authentication State
  user: null,
  isAuthenticated: false,
  hasCompletedWizard: false,
  
  // Onboarding Wizard Cache States
  measuredArea: '',
  measurementMethod: '', // 'map' | 'gps' | ''
  selectedLandType: '',
  selectedSoilType: '',

  login: (userData) => set({ user: userData, isAuthenticated: true }),
  updateUserProfile: (profile) => set((state) => ({ user: { ...state.user, ...profile } })),
  logout: () => set({ 
    user: null, 
    isAuthenticated: false, 
    hasCompletedWizard: false,
    measuredArea: '',
    measurementMethod: '',
    selectedLandType: '',
    selectedSoilType: '',
    customCrops: [],
    lands: [],
    todos: []
  }),
  
  setHasCompletedWizard: (value) => set({ hasCompletedWizard: value }),
  setOnboardingState: (updates) => set((state) => ({ ...state, ...updates })),
  resetOnboardingState: () => set({
    measuredArea: '',
    measurementMethod: '',
    selectedLandType: '',
    selectedSoilType: ''
  }),

  // Global Multi-Toast Notifications State (Queue)
  toasts: [],
  triggerToast: (message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ 
      toasts: [...state.toasts, { id, message, type, duration }] 
    }));
  },
  removeToast: (id) => set((state) => ({ 
    toasts: state.toasts.filter(t => t.id !== id) 
  })),

  // Lands State
  lands: [
    { id: 'land-1', name: 'North Paddy Plot', area: '1.2 Acres', landType: 'wetland', soilType: 'alluvial', measurementMethod: 'gps' }
  ],
  addLand: (land) => set((state) => ({ lands: [...state.lands, land] })),
  removeLand: (landId) => set((state) => {
    const land = state.lands.find(l => l.id === landId);
    const landName = land ? land.name : '';
    return {
      lands: state.lands.filter((l) => l.id !== landId),
      todos: state.todos.filter((todo) => !todo.task.includes(`[${landName}]`))
    };
  }),

  // Todos State
  todos: [
    { id: '1', task: 'Check nitrogen level in Paddy Field', priority: 'high', completed: false, scheduledDayIndex: new Date().getDay() },
    { id: '2', task: 'Clear weeds along borders of Garden Land', priority: 'medium', completed: false, scheduledDayIndex: (new Date().getDay() + 1) % 7 },
    { id: '3', task: 'Adjust irrigation timer for Dryland Zone', priority: 'low', completed: true, scheduledDayIndex: (new Date().getDay() + 2) % 7 },
    { id: '4', task: 'Apply organic vermicompost to red soil area', priority: 'high', completed: false, scheduledDayIndex: new Date().getDay() }
  ],
  addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })),
  addTodos: (newTodos) => set((state) => ({ todos: [...newTodos, ...state.todos] })),
  toggleTodo: (todoId) => set((state) => ({
    todos: state.todos.map((t) => t.id === todoId ? { ...t, completed: !t.completed } : t)
  })),
  removeTodo: (todoId) => set((state) => ({
    todos: state.todos.filter((t) => t.id !== todoId)
  })),

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
  plantedCrops: [
    {
      landId: 'land-1',
      cropId: 'paddy',
      elapsedDays: 25,
      sownDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      journalLogs: [
        { day: 1, date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toLocaleDateString(), note: "Prepared nursery beds. Sowed pre-germinated Samba seeds. Soil moisture is optimal." },
        { day: 10, date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString(), note: "Sprouts have emerged. Checked nitrogen levels and cleared light weeds." },
        { day: 25, date: new Date().toLocaleDateString(), note: "Uprooting saplings from nursery bed and completed main field transplantation." }
      ]
    }
  ],
  addPlantedCrop: (planted) => set((state) => ({ plantedCrops: [...state.plantedCrops, planted] })),
  updatePlantedCropDays: (index, days) => set((state) => ({
    plantedCrops: state.plantedCrops.map((c, idx) => idx === index ? { ...c, elapsedDays: days } : c)
  })),
  addJournalLog: (index, log) => set((state) => ({
    plantedCrops: state.plantedCrops.map((c, idx) => idx === index ? { ...c, journalLogs: [...(c.journalLogs || []), log] } : c)
  })),
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
  })),

  // Custom Crops Recipes State
  customCrops: [],
  addCustomCrop: (crop) => set((state) => ({ customCrops: [...state.customCrops, crop] })),
  removeCustomCrop: (cropId) => set((state) => ({ customCrops: state.customCrops.filter((c) => c.id !== cropId) })),

  // Reset all application data
  resetAppData: () => set({
    measuredArea: '',
    measurementMethod: '',
    selectedLandType: '',
    selectedSoilType: '',
    customCrops: [],
    lands: [],
    plantedCrops: [],
    todos: [
      { id: '1', task: 'Check nitrogen level in Paddy Field', priority: 'high', completed: false, scheduledDayIndex: new Date().getDay() },
      { id: '2', task: 'Clear weeds along borders of Garden Land', priority: 'medium', completed: false, scheduledDayIndex: (new Date().getDay() + 1) % 7 },
      { id: '3', task: 'Adjust irrigation timer for Dryland Zone', priority: 'low', completed: true, scheduledDayIndex: (new Date().getDay() + 2) % 7 },
      { id: '4', task: 'Apply organic vermicompost to red soil area', priority: 'high', completed: false, scheduledDayIndex: new Date().getDay() }
    ],
    inventory: [
      { id: 'inv-1', name: 'Groundnut Kernels', type: 'seed', quantity: 20, unit: 'kg', lastUpdated: '06/08/2026' },
      { id: 'inv-2', name: 'Paddy Seeds (CO-51)', type: 'seed', quantity: 40, unit: 'kg', lastUpdated: '06/09/2026' },
      { id: 'inv-3', name: 'Gypsum Fertilizer', type: 'fertilizer', quantity: 120, unit: 'kg', lastUpdated: '06/10/2026' }
    ]
  })
}));
