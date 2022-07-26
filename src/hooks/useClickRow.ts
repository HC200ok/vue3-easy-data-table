import { Ref, ComputedRef } from 'vue';
import type { Item } from '../types/main';
import type { EmitsEventName } from '../types/internal';

export default function useClickRow(
  isMutipleSelectable: ComputedRef<boolean>,
  showIndex: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const clickRow = (item: Item) => {
    const clickRowArgument = { ...item };
    if (isMutipleSelectable.value) {
      const { checkbox } = item;
      delete clickRowArgument.checkbox;
      clickRowArgument.isSelected = checkbox;
    }
    if (showIndex.value) {
      const { index } = item;
      delete clickRowArgument.index;
      clickRowArgument.indexInCurrentPage = index;
    }
    emits('clickRow', clickRowArgument);
  };

  return {
    clickRow,
  };
}
