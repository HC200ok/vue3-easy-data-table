import { Ref, computed } from 'vue';
import type { HeaderForRender } from '../types/internal';

type FixedColumnsInfo = {
  value: string,
  fixed: Boolean,
  distance: number,
  width: number,
};

export default function useFixedColumn(
  headersForRender: Ref<HeaderForRender[]>,
) {
  const fixedHeaders = computed((): HeaderForRender[] => headersForRender.value.filter((header) => header.fixed));

  const lastFixedColumn = computed((): string => {
    if (!fixedHeaders.value.length) return '';
    return fixedHeaders.value[fixedHeaders.value.length - 1].value;
  });

  const fixedColumnsInfos = computed((): FixedColumnsInfo[] => {
    if (!fixedHeaders.value.length) return [];
    const fixedHeadersWidthArr = fixedHeaders.value.map((header) => header.width ?? 100);
    return fixedHeaders.value.map((header: HeaderForRender, index: number): FixedColumnsInfo => ({
      value: header.value,
      fixed: header.fixed ?? true,
      width: header.width ?? 100,
      distance: index === 0 ? 0 : fixedHeadersWidthArr.reduce((previous: number, current: number, i: number): number => {
        let distance = previous;
        if (i < index) distance += current;
        return distance;
      }),
    }));
  });

  return {
    fixedHeaders,
    lastFixedColumn,
    fixedColumnsInfos,
  };
}
