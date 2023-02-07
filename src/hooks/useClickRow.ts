import { Ref, ComputedRef } from 'vue';
import type { Item } from '../types/main';
import type { EmitsEventName, ClickEventType } from '../types/internal';

export default function useClickRow(
  clickEventType: Ref<ClickEventType>,
  isMultipleSelectable: ComputedRef<boolean>,
  showIndex: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const clickRow = (item: Item, clickType: ClickEventType, $event: Event) => {
    if (clickEventType.value !== clickType) return;

    const clickRowArgument = { ...item };
    if (isMultipleSelectable.value) {
      const { checkbox } = item;
      delete clickRowArgument.checkbox;
      clickRowArgument.isSelected = checkbox;
    }
    if (showIndex.value) {
      const { index } = item;
      delete clickRowArgument.index;
      clickRowArgument.indexInCurrentPage = index;
    }
    emits('clickRow', clickRowArgument, $event);
  };

  return {
    clickRow,
  };
}
