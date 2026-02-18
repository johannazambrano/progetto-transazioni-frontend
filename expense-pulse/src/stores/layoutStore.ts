import api from '@/services/api';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { LayoutMapper } from '@/models/mappers/LayoutMapper';
import type { LayoutDTO } from '@/models/dtos/LayoutDTO';
import type { LayoutVO } from '@/models/vo/LayoutVO';
import type { LayoutItemVO } from '@/models/vo/LayoutItemVO';
import { DEFAULT_LAYOUT_HOME, USE_BACKEND_LAYOUTS } from '@/constants/app.constants';


export const useLayoutStore = defineStore('layout', () => {
  // --- STATE ---
  const currentLayout = ref<LayoutVO | null>(null);
  const allLayouts = ref<LayoutVO[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const isUsingFallback = ref(false); // 


  // --- GETTERS (computed) ---
  const hasLayout = computed(() => currentLayout.value !== null);
  const layoutItems = computed(() => currentLayout.value?.layout || []);

  
  /**
 * Crea un layout VO dalle costanti di default
 */
  const createDefaultLayoutVO = (): LayoutVO => {
    return {
      id: undefined,
      layoutName: 'default',
      layout: [...DEFAULT_LAYOUT_HOME],
      isDefault: true,
    };
  };

  /**
   * Verifica se un componente è presente nel layout
   */
  const hasComponent = computed(() => (componentId: string) => {
    if (!currentLayout.value) return false;
    return currentLayout.value.layout.some(item => item.i === componentId);
  });

  // --- HELPER FUNCTIONS ---

  /**
   * Trova una posizione disponibile nella griglia
   */
  const findAvailablePosition = (width: number, height: number): { x: number; y: number } => {
    if (!currentLayout.value) return { x: 0, y: 0 };

    const GRID_COLS = 12;
    const items = currentLayout.value.layout;
    
    let maxY = 0;
    items.forEach(item => {
      const itemBottom = item.y + item.h;
      if (itemBottom > maxY) maxY = itemBottom;
    });
    
    for (let y = 0; y <= maxY + 5; y++) {
      for (let x = 0; x <= GRID_COLS - width; x++) {
        if (isPositionAvailable(x, y, width, height, items)) {
          return { x, y };
        }
      }
    }
    
    return { x: 0, y: maxY + 1 };
  };

  const isPositionAvailable = (
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    items: LayoutItemVO[]
  ): boolean => {
    return !items.some(item => {
      return !(
        x + w <= item.x ||
        item.x + item.w <= x ||
        y + h <= item.y ||
        item.y + item.h <= y
      );
    });
  };

  // --- ACTIONS ---

  /**
   * Carica il layout dell'utente
   */
  const fetchLayout = async (layoutName: string = 'default') => {
    loading.value = true;
    error.value = null;
    isUsingFallback.value = false;

    if (!USE_BACKEND_LAYOUTS) {
      console.warn('[layoutStore.fetchLayout] ⚠️ Backend layouts disabilitato, uso layout dalle costanti');
      currentLayout.value = createDefaultLayoutVO();
      isUsingFallback.value = true;
      loading.value = false;
      console.log('[layoutStore.fetchLayout] 🔍 USE_BACKEND_LAYOUTS:', USE_BACKEND_LAYOUTS);
      return;
    }

    try {
      const response = await api.get<LayoutDTO>('/layouts', {
        params: { name: layoutName },
      });
      currentLayout.value = LayoutMapper.toVO(response.data);
      console.log('[layoutStore.fetchLayout] ✅ Layout caricato:', layoutName);
    } catch (e) {
      console.error('[layoutStore.fetchLayout] ❌ Errore nel caricamento del layout dal backend:', e);
      console.warn('[layoutStore.fetchLayout] 🔄 Uso layout di fallback dalle costanti');
      currentLayout.value = createDefaultLayoutVO();
      isUsingFallback.value = true;
      error.value = 'Backend non disponibile, uso layout locale';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Carica tutti i layout dell'utente
   */
  const fetchAllLayouts = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get<LayoutDTO[]>('/layouts/all');
      allLayouts.value = response.data.map(LayoutMapper.toVO);
      console.log('[layoutStore.fetchAllLayouts] ✅ Tutti i layout caricati:', allLayouts.value.length);
    } catch (e) {
      console.error('[layoutStore.fetchAllLayouts] ❌ Errore nel caricamento dei layout:', e);
      error.value = 'Impossibile caricare i layout';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Salva il layout corrente
   */
  const saveLayout = async () => {
    console.log('[layoutStore.saveLayout] saveLayout', currentLayout.value);
    if (!currentLayout.value) {
      error.value = 'Nessun layout da salvare';
      return;
    }

    // Validazione base
    if (!currentLayout.value.layoutName || currentLayout.value.layout.length === 0) {
      error.value = 'Layout non valido';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const dto = LayoutMapper.toDTO(currentLayout.value);
      const response = await api.post<LayoutDTO>('/layouts', dto);
      currentLayout.value = LayoutMapper.toVO(response.data);
      console.log('[layoutStore.saveLayout] 💾 Layout salvato');
    } catch (e) {
      console.error('[layoutStore.saveLayout] ❌ Errore nel salvataggio del layout:', e);
      error.value = 'Impossibile salvare il layout';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Aggiorna il layout corrente
   */
  const updateLayout = async () => {
    if (!currentLayout.value) {
      error.value = 'Nessun layout da aggiornare';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const dto = LayoutMapper.toDTO(currentLayout.value);
      const response = await api.put<LayoutDTO>('/layouts', dto);
      currentLayout.value = LayoutMapper.toVO(response.data);
      console.log('[layoutStore.updateLayout] 🔄 Layout aggiornato');
    } catch (e) {
      console.error('[layoutStore.updateLayout] ❌ Errore nell\'aggiornamento del layout:', e);
      error.value = 'Impossibile aggiornare il layout';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Elimina un layout
   */
  const deleteLayout = async (layoutName: string) => {
    if (layoutName === 'default') {
      error.value = 'Non puoi eliminare il layout di default';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      await api.delete(`/layouts/${layoutName}`);
      
      // Rimuovi dalla lista locale
      allLayouts.value = allLayouts.value.filter(l => l.layoutName !== layoutName);
      
      // Se era quello corrente, carica il default
      if (currentLayout.value?.layoutName === layoutName) {
        await fetchLayout('default');
      }
      
      console.log('[layoutStore.deleteLayout] 🗑️ Layout eliminato:', layoutName);
    } catch (e) {
      console.error('[layoutStore.deleteLayout] ❌ Errore nell\'eliminazione del layout:', e);
      error.value = 'Impossibile eliminare il layout';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Resetta al layout di default
   */
  const resetLayout = async () => {
    loading.value = true;
    error.value = null;

    if (!USE_BACKEND_LAYOUTS || isUsingFallback.value) {
      console.warn('🔄 Reset al layout dalle costanti');
      currentLayout.value = createDefaultLayoutVO();
      loading.value = false;
      return;
    }

    try {
      const response = await api.post<LayoutDTO>('/layouts/reset');
      currentLayout.value = LayoutMapper.toVO(response.data);
      console.log('[layoutStore.resetLayout] 🔄 Layout resettato');
    } catch (e) {
      console.error('[layoutStore.resetLayout] ❌ Errore nel reset del layout:', e);
    
      console.warn('[layoutStore.resetLayout] 🔄 Reset con fallback alle costanti');
      currentLayout.value = createDefaultLayoutVO();
      isUsingFallback.value = true;
      error.value = 'Backend non disponibile, layout resettato localmente';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Aggiunge un componente al layout corrente
   */
  const addComponent = (
    componentId: string,
    config: {
      w: number;
      h: number;
      minW?: number;
      maxW?: number;
      minH?: number;
      maxH?: number;
    }
  ): LayoutItemVO | null => {
    if (!currentLayout.value) {
      error.value = 'Nessun layout attivo';
      return null;
    }

    // Verifica duplicato (come fai con le categorie)
    if (currentLayout.value.layout.some(item => item.i === componentId)) {
      error.value = `Il componente "${componentId}" è già presente nel layout`;
      return null;
    }

    try {
      const position = findAvailablePosition(config.w, config.h);
      
      const newItem: LayoutItemVO = {
        i: componentId,
        x: position.x,
        y: position.y,
        w: config.w,
        h: config.h,
        minW: config.minW,
        maxW: config.maxW,
        minH: config.minH,
        maxH: config.maxH,
        static: false,
      };
      
      currentLayout.value.layout.push(newItem);
      console.log('[layoutStore.addComponent] ➕ Componente aggiunto:', componentId);
      return newItem;
    } catch (e) {
      console.error('[layoutStore.addComponent] ❌ Errore nell\'aggiunta del componente:', e);
      error.value = 'Impossibile aggiungere il componente';
      return null;
    }
  };

  /**
   * Rimuove un componente dal layout corrente
   */
  const removeComponent = (componentId: string): boolean => {
    if (!currentLayout.value) {
      error.value = 'Nessun layout attivo';
      return false;
    }

    try {
      const index = currentLayout.value.layout.findIndex(item => item.i === componentId);
      if (index !== -1) {
        currentLayout.value.layout.splice(index, 1);
        console.log('[layoutStore.removeComponent] ➖ Componente rimosso:', componentId);
        return true;
      }
      return false;
    } catch (e) {
      console.error('[layoutStore.removeComponent] ❌ Errore nella rimozione del componente:', e);
      error.value = 'Impossibile rimuovere il componente';
      return false;
    }
  };

  /**
   * Aggiorna l'intero array di items (dopo drag/resize dalla griglia)
   */
  const updateLayoutItems = (items: LayoutItemVO[]): void => {
    if (!currentLayout.value) {
      error.value = 'Nessun layout attivo';
      return;
    }

    currentLayout.value.layout = items;
    console.log('[layoutStore.updateLayoutItems] 🔄 Layout items aggiornati');
  };

  /**
   * Reset completo dello store
   */
  const $reset = () => {
    currentLayout.value = null;
    allLayouts.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    // State
    currentLayout,
    allLayouts,
    loading,
    error,
    isUsingFallback,

    // Getters (computed)
    hasLayout,
    layoutItems,
    hasComponent,

    // Actions
    fetchLayout,
    fetchAllLayouts,
    saveLayout,
    updateLayout,
    deleteLayout,
    resetLayout,
    addComponent,
    removeComponent,
    updateLayoutItems,
    $reset,
  };
});
