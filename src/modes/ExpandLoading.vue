<template>
  <DataTable
    v-model:items-selected="itemsSelected"
    :headers="headers"
    :items="items"
    @expand-row="loadIntroduction"
    :rows-per-page="4"
  >
    <template #expand="item">
      <div
        v-if="item.introduction"
        style="padding: 15px"
      >
        {{ item.introduction }}
      </div>
    </template>
  </DataTable>
</template>

<script lang="ts" setup>
import {
  computed, ref, reactive, toRefs,
} from 'vue';
import type {
  Header, Item, FilterOption, ClickRowArgument, HeaderItemClassNameFunction, BodyItemClassNameFunction, BodyRowClassNameFunction,
} from '../types/main';
import DataTable from '../components/DataTable.vue';

import { mockClientNestedItems, mockClientItems, mockDuplicateClientNestedItems } from '../mock';
const headers: Header[] = [
  { text: 'PLAYER', value: 'player' },
  { text: 'TEAM', value: 'team', sortable: true },
];

const items = ref<Item[]>([
  { player: 'Stephen Curry', team: 'GSW' },
  { player: 'Lebron James', team: 'LAL' },
  { player: 'Kevin Durant', team: 'BKN' },
  { player: 'Giannis Antetokounmpo', team: 'MIL' },
  { player: '1Stephen Curry', team: 'GSW' },
  { player: '2Lebron James', team: 'LAL' },
  { player: '3Kevin Durant', team: 'BKN' },
  { player: '4Giannis Antetokounmpo', team: 'MIL' },
]);

const itemsSelected = ref<Item[]>([items.value[0]]);

const mockItemIntroduction = async (name: string): Promise<string> => {
  await new Promise((s) => setTimeout(s, 2000));
  const introduction: Record<string, string> = {
    'Stephen Curry': 'Wardell Stephen Curry II is an American professional basketball player for the Golden State Warriors of the National Basketball Association (NBA).',
    'Lebron James': 'LeBron Raymone James Sr is an American professional basketball player for the Los Angeles Lakers of the National Basketball Association (NBA).',
    'Kevin Durant': 'Kevin Wayne Durant also known by his initials KD, is an American professional basketball player for the Brooklyn Nets of the National Basketball Association (NBA).',
    'Giannis Antetokounmpo': 'Giannis Sina Ugo Antetokounmpo (né Adetokunbo; December 6, 1994) is a Greek-Nigerian professional basketball player for the Milwaukee Bucks of the National Basketball Association (NBA).',
    '1Stephen Curry': 'Wardell Stephen Curry II is an American professional basketball player for the Golden State Warriors of the National Basketball Association (NBA).',
    '2Lebron James': 'LeBron Raymone James Sr is an American professional basketball player for the Los Angeles Lakers of the National Basketball Association (NBA).',
    '3Kevin Durant': 'Kevin Wayne Durant also known by his initials KD, is an American professional basketball player for the Brooklyn Nets of the National Basketball Association (NBA).',
    '4Giannis Antetokounmpo': 'Giannis Sina Ugo Antetokounmpo (né Adetokunbo; December 6, 1994) is a Greek-Nigerian professional basketball player for the Milwaukee Bucks of the National Basketball Association (NBA).',
  };
  return introduction[name];
};

const loadIntroduction = async (index: number): Promise<void> => {
  const expandedItem = items.value[index];
  if (!expandedItem.introduction) {
    expandedItem.expandLoading = true;
    expandedItem.introduction = await mockItemIntroduction(expandedItem.player);
    expandedItem.expandLoading = false;
  }
};
</script>
