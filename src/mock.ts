import { Item, ServerOptions, Header } from './types/main';

export const headersMocked: Header[] = [
  { text: 'Name', value: 'name' },
  { text: 'Address', value: 'address' },
  { text: 'Height', value: 'height', sortable: true },
  { text: 'Weight', value: 'weight', sortable: true },
  { text: 'Age', value: 'calories', sortable: true },
  { text: 'Calories', value: 'calories' },
  { text: 'Fat (g)', value: 'fat' },
  { text: 'Carbs (g)', value: 'carbs' },
  { text: 'Protein (g)', value: 'protein' },
  { text: 'Iron (%)', value: 'iron' },
];

export const mockClientItems = (itemsNumber = 100): Item[] => {
  const mockItems: Item[] = [];
  const sports = ['basketball', 'football', 'running', 'swimming'];
  const fruits = ['banana', 'apple', 'orange', 'peach'];

  for (let i = 1; i < itemsNumber + 1; i += 1) {
    mockItems.push({
      name: `name-${i}`,
      address: `address-${i}`,
      height: i,
      weight: i,
      age: i,
      favouriteSport: sports[i % 4],
      favouriteFruits: fruits[i % 4],
    });
  }
  return mockItems;
};

export const mockClientNestedItems = (itemsNumber = 100): Item[] => {
  const mockItems: Item[] = [];
  const sports = ['basketball', 'football', 'running', 'swimming'];
  const fruits = ['banana', 'apple', 'orange', 'peach'];

  for (let i = 1; i < itemsNumber + 1; i += 1) {
    mockItems.push({
      name: `name-${i}`,
      address: `address-${i}`,
      info: {out: { height: i, weight: i }},
      age: i,
      favouriteSport: sports[i % 4],
      favouriteFruits: fruits[i % 4],
    });
  }
  return mockItems;
};

export const mockDuplicateClientNestedItems = (itemsNumber = 100): Item[] => {
  const mockItems: Item[] = [];
  const sports = ['basketball', 'football', 'running', 'swimming'];
  const fruits = ['banana', 'apple', 'orange', 'peach'];

  for (let i = 1; i < itemsNumber + 1; i += 1) {
    mockItems.push({
      name: `name-${i}`,
      address: `address-${i}`,
      info: {out: { height: i, weight: i }},
      age: i,
      favouriteSport: sports[i % 4],
      favouriteFruits: fruits[i % 4],
    });
  }

  mockItems.push({
    name: 'name-1',
    address: 'address-1',
    info: { out: { height: 1, weight: 1 } },
    age: 1,
    favouriteSport: sports[1 % 4],
    favouriteFruits: fruits[1 % 4],
  });
  return mockItems;
};

export const mockServerItems = async (
  serverOptions: ServerOptions,
  serverItemsLength = 500,
): Promise<{
  serverCurrentPageItems: Item[];
  serverTotalItemsLength: number;
}> => {
  const {
    page, rowsPerPage, sortBy, sortType,
  } = serverOptions;
  const serverTotalItems = mockClientItems(serverItemsLength);
  if (sortBy && sortType) {
    serverTotalItems.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortType === 'desc' ? 1 : -1;
      if (a[sortBy] > b[sortBy]) return sortType === 'desc' ? -1 : 1;
      return 0;
    });
  }
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((s) => setTimeout(s, 2000));
  return {
    serverCurrentPageItems: serverTotalItems.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage,
    ),
    serverTotalItemsLength: serverItemsLength,
  };
};
