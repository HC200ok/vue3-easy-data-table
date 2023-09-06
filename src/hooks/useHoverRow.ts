import { Ref, ComputedRef } from 'vue';
import type { Item } from '../types/main';
import type { EmitsEventName, ClickEventType } from '../types/internal';

export default function useHoverRow(
  showIndex: Ref<boolean>,
  emits: (event: EmitsEventName, ...args: any[]) => void,
) {
  const hoverRow = (item: Item, $event: Event) => {
    const hoverRowArgument = { ...item };
      const { index } = item;
      delete hoverRowArgument.index;
      hoverRowArgument.indexInCurrentPage = index;
    emits('hoverRow', hoverRowArgument, $event);
  };

  return {
    hoverRow,
  };
}
