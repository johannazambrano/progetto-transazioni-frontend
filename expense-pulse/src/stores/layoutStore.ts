import api from '@/services/api';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { LayoutMapper } from '@/models/mappers/LayoutMapper';
import type { LayoutDTO } from '@/models/dtos/LayoutDTO';
import type { LayoutVO } from '@/models/vo/LayoutVO';
import type { LayoutItemVO } from '@/models/vo/LayoutItemVO';
import type { FiltroLayoutDTO } from '@/models/dtos/FiltroLayoutDTO';


export const useLayoutStore = defineStore('layout', () => {

  // --- STATE ---
  const currentLayout = ref<Record<string, LayoutVO>>({});
  const allLayouts = ref<LayoutVO[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);


  // --- GETTERS (computed) ---
  const hasLayout = (viewName: string) => computed(() => !!currentLayout.value[viewName]);
  const layoutItems = (viewName: string) => computed(() => currentLayout.value[viewName]?.layoutItems || []);
  const hasComponent = (viewName: string) => computed(() => (componentId: string) => {
    return currentLayout.value[viewName]?.layoutItems.some(item => item.i === componentId) ?? false;
  });

  /**
 * Crea un layout VO dalle costanti di default
 */
  // const createDefaultLayoutVO = (layoutName: string = 'default'): LayoutVO => {
  //   let items = DEFAULT_LAYOUT_HOME;

  //   if (layoutName === 'DEFAULT_LAYOUT_CATEGORIES' || layoutName === 'CategoriesView') {
  //     items = DEFAULT_LAYOUT_CATEGORIES;
  //   }

  //   return {
  //     id: undefined,
  //     layoutName: layoutName,
  //     layoutItems: [...items],
  //     isDefault: true,
  //   };
  // };


  // --- HELPER FUNCTIONS ---

  /**
   * Trova una posizione disponibile nella griglia
   */
  const findAvailablePosition = (viewName: string, width: number, height: number): { x: number; y: number } => {
    const items = currentLayout.value[viewName]?.layoutItems ?? [];
    if (!currentLayout.value) return { x: 0, y: 0 };

    const GRID_COLS = 12;
    // const items = currentLayout.value.layoutItems;

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
  const fetchLayout = async (layoutName: string, isDefault: boolean = false) => {
    const filtroLayoutDto: FiltroLayoutDTO = {
      layoutName: layoutName,
      isDefault: isDefault
    }
    loading.value = true;
    error.value = null;
    // isUsingFallback.value = false;

    // if (!USE_BACKEND_LAYOUTS) {
    //   console.warn('[layoutStore.fetchLayout] ⚠️ Backend layouts disabilitato, uso layout dalle costanti');
    //   // currentLayout.value = createDefaultLayoutVO(layoutName);
    //   // isUsingFallback.value = true;
    //   loading.value = false;
    //   console.log('[layoutStore.fetchLayout] 🔍 USE_BACKEND_LAYOUTS:', USE_BACKEND_LAYOUTS);
    //   return;
    // }

    try {
      let response;
      // Usa l'endpoint specifico per il layout di default
      response = await api.post<LayoutDTO>('/layouts/default', {params: filtroLayoutDto});

      if (!response.data || (typeof response.data === 'object' && Object.keys(response.data).length === 0)) {
        throw new Error(`Layout "${layoutName}" non trovato`);
      }

      currentLayout.value[layoutName] = LayoutMapper.toVO(response.data);
      console.log('[layoutStore.fetchLayout] ✅ Layout caricato dal backend:', layoutName);
    } catch (e) {
      console.error('[layoutStore.fetchLayout] ❌ Errore nel caricamento del layout dal backend:', e);
      if (isDefault) {
        console.warn(`[layoutStore.fetchLayout] 🔄 Fallback definitivo a costanti locali per: ${layoutName}`);
        // currentLayout.value = createDefaultLayoutVO(layoutName);
        // isUsingFallback.value = true;
        error.value = 'Backend non disponibile, uso layout locale';
      } else {
        // Rilancia l'errore per permettere al chiamante (es. CategoriesView) di gestire il retry
        throw e;
      }
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
  const saveLayout = async (viewName: string) => {
    const layout = currentLayout.value[viewName];
    console.log('[layoutStore.saveLayout] saveLayout', layout);
    if (!layout) {
      error.value = 'Nessun layout da salvare';
      return;
    }

    // Validazione base
    if (!layout || layout.layoutItems.length === 0) {
      error.value = 'Layout non valido';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const dto = LayoutMapper.toDTO(layout);

      if (layout.id && !layout.isDefault) {
        // Se ha un ID, facciamo un aggiornamento (PUT)
        await api.put(`/layouts/${dto.id}`, dto);
        console.log('[layoutStore.saveLayout] 🔄 Layout aggiornato via PUT');
      } else {
        // Altrimenti creazione (POST)
        await api.post<LayoutDTO>('/layouts', dto);
        console.log('[layoutStore.saveLayout] 💾 Layout creato via POST');
      }
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
  const updateLayout = async (viewName: string) => {
    const layout = currentLayout.value[viewName];
    console.log('[layoutStore.updateLayout] updateLayout', layout);
    if (!layout) {
      error.value = 'Nessun layout da aggiornare';
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const dto = LayoutMapper.toDTO(layout);
      await api.put<LayoutDTO>(`/layouts/${dto.id}`, dto);
      console.debug('[layoutStore.updateLayout] 🔄 Layout aggiornato');
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
  const deleteLayout = async (layoutDeleting: LayoutVO) => {
    if(layoutDeleting !== null) {
      if (layoutDeleting.isDefault) {
        error.value = 'Non puoi eliminare il layout di default';
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        await api.delete(`/layouts/${layoutDeleting.id}`);

        // Rimuovi dalla lista locale
        // allLayouts.value = allLayouts.value.filter(l => l.layoutName !== layoutName);

        // Se era quello corrente, carica il default
        // if (currentLayout.value?.layoutName === layoutName) {
        //   await fetchLayout(layoutName);
        // }

        console.log('[layoutStore.deleteLayout] 🗑️ Layout eliminato:', layoutDeleting.layoutName);
      } catch (e) {
        console.error('[layoutStore.deleteLayout] ❌ Errore nell\'eliminazione del layout:', e);
        error.value = 'Impossibile eliminare il layout';
      } finally {
        loading.value = false;
      }
    }
  };

  /**
   * Resetta al layout di default
   */
  const resetLayout = async (viewName: string) => {
    loading.value = true;
    error.value = null;

    // if (!USE_BACKEND_LAYOUTS || isUsingFallback.value) {
    //   console.warn('🔄 Reset al layout dalle costanti');
    //   // currentLayout.value = createDefaultLayoutVO();
    //   loading.value = false;
    //   return;
    // }

    const filtroLayoutDto: FiltroLayoutDTO = {
      layoutName: currentLayout.value[viewName]?.layoutName || 'default',
      isDefault: true
    }

    try {
      const response = await api.post<LayoutDTO>('/layouts/reset', filtroLayoutDto);
      currentLayout.value[viewName] = LayoutMapper.toVO(response.data);
      console.log('[layoutStore.resetLayout] 🔄 Layout resettato');
    } catch (e) {
      console.error('[layoutStore.resetLayout] ❌ Errore nel reset del layout:', e);

      console.warn('[layoutStore.resetLayout] 🔄 Reset con fallback alle costanti');
      // currentLayout.value = createDefaultLayoutVO();
      // isUsingFallback.value = true;
      error.value = 'Backend non disponibile, layout resettato localmente';
    } finally {
      loading.value = false;
    }
  };

  /**
   * Aggiunge un componente al layout corrente
   */
  const addComponent = (
    viewName: string,
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
    const layout = currentLayout.value[viewName];
    if (!layout) {
      error.value = 'Nessun layout attivo';
      return null;
    }

    // Verifica duplicato (come fai con le categorie)
    if (layout.layoutItems.some(item => item.i === componentId)) {
      error.value = `Il componente "${componentId}" è già presente nel layout`;
      return null;
    }

    try {
      const position = findAvailablePosition(viewName, config.w, config.h);

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

      layout.layoutItems.push(newItem);
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
  const removeComponent = (viewName: string, componentId: string): boolean => {
    const layout = currentLayout.value[viewName];
    if (!layout) {
      error.value = 'Nessun layout attivo';
      return false;
    }

    try {
      const index = layout.layoutItems.findIndex(item => item.i === componentId);
      if (index !== -1) {
        layout.layoutItems.splice(index, 1);
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
  const updateLayoutItems = (viewName: string, items: LayoutItemVO[]): void => {
    const layout = currentLayout.value[viewName];
    if (!layout) {
      error.value = 'Nessun layout attivo';
      return;
    }

    layout.layoutItems = items;
    console.log('[layoutStore.updateLayoutItems] 🔄 Layout items aggiornati');
  };

  /**
   * Reset completo dello store
   */
  const $reset = () => {
    currentLayout.value = {};
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
