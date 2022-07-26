import {
  ref, Ref, computed, ComputedRef,
} from 'vue';
import type { ServerOptions } from '../types/main';

export default function usePagination(
  isServerSideMode: ComputedRef<boolean>,
  loading: Ref<boolean>,
  totalItemsLength: Ref<number>,
  rowsPerPage: Ref<number>,
  serverOptions: Ref<ServerOptions | null>,
  updateServerOptionsPage: (page: number) => void,
) {
  const currentPaginationNumber = ref(serverOptions.value ? serverOptions.value.page : 1);
  const maxPaginationNumber = computed((): number => Math.ceil(totalItemsLength.value / rowsPerPage.value));
  const isLastPage = computed((): boolean => currentPaginationNumber.value === maxPaginationNumber.value);
  const isFirstPage = computed((): boolean => currentPaginationNumber.value === 1);

  const nextPage = () => {
    if (isLastPage.value) return;
    if (loading.value) return;
    if (isServerSideMode.value) {
      const nextPaginationNumber = currentPaginationNumber.value + 1;
      updateServerOptionsPage(nextPaginationNumber);
    } else {
      currentPaginationNumber.value += 1;
    }
  };

  const prevPage = () => {
    if (isFirstPage.value) return;
    if (loading.value) return;
    if (isServerSideMode.value) {
      const prevPaginationNumber = currentPaginationNumber.value - 1;
      updateServerOptionsPage(prevPaginationNumber);
    } else {
      currentPaginationNumber.value -= 1;
    }
  };

  const updatePage = (page: number) => {
    if (loading.value) return;
    if (isServerSideMode.value) {
      updateServerOptionsPage(page);
    } else {
      currentPaginationNumber.value = page;
    }
  };

  const updateCurrentPaginationNumber = (page: number) => {
    currentPaginationNumber.value = page;
  };

  return {
    currentPaginationNumber,
    maxPaginationNumber,
    isLastPage,
    isFirstPage,
    nextPage,
    prevPage,
    updatePage,
    updateCurrentPaginationNumber,
  };
}
