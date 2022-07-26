import { Ref, computed } from 'vue';
import type { SortType, ServerOptions } from '../types/main';
import type { ServerOptionsComputed, EmitsEventName } from '../types/internal';

export default function useServerOptions(
  serverOptions: Ref<ServerOptions | null>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const serverOptionsComputed = computed({
    get: (): ServerOptionsComputed | null => {
      if (serverOptions.value) {
        const {
          page, rowsPerPage, sortBy, sortType,
        } = serverOptions.value;
        return {
          page,
          rowsPerPage,
          sortBy: sortBy ?? null,
          sortType: sortType ?? null,
        };
      }
      return null;
    },
    set: (value) => {
      emits('update:serverOptions', value);
    },
  });

  const updateServerOptionsPage = (page: number) => {
    if (serverOptionsComputed.value) {
      serverOptionsComputed.value = {
        ...serverOptionsComputed.value,
        page,
      };
    }
  };

  const updateServerOptionsRowsPerPage = (rowsPerPage: number) => {
    if (serverOptionsComputed.value) {
      serverOptionsComputed.value = {
        ...serverOptionsComputed.value,
        page: 1,
        rowsPerPage,
      };
    }
  };

  const updateServerOptionsSort = (newSortBy: string, newSortType: SortType | null) => {
    if (serverOptionsComputed.value) {
      serverOptionsComputed.value = {
        ...serverOptionsComputed.value,
        sortBy: newSortType !== null ? newSortBy : null,
        sortType: newSortType,
      };
    }
  };

  return {
    serverOptionsComputed,
    updateServerOptionsPage,
    updateServerOptionsSort,
    updateServerOptionsRowsPerPage,
  };
}
