/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DataTable from '../src/components/DataTable.vue';
import { mockClientItems, headersMocked, mockServerItems } from "../src/mock";

// Button Pagination
describe('Button Pagination', () => {
  it('should render', () => {
    const wrapper = mount(DataTable, {
      props: {
        items: mockClientItems(200),
        buttonsPagination: true,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    expect(wrapper.find('.data-table').exists()).toBe(true);
  });

  /**
   * conditions:
   *  1. total items count is 200
   *  2. rows per page is 5
   * expection:
   *  max pagination number should be 40
   */
  it('Max pagination number should be 40', () => {
    const wrapper = mount(DataTable, {
      props: {
        items: mockClientItems(200),
        buttonsPagination: true,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    expect(wrapper.find('.item.button:last-of-type').exists()).toBe(true);
    expect(wrapper.find('.item.button:last-of-type').text()).toBe('40');
  });

  it('Prev arrow button unavailable in first page', () => {
    const wrapper = mount(DataTable, {
      props: {
        items: mockClientItems(200),
        buttonsPagination: true,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    expect(wrapper.find('.previous-page__click-button').classes()).include('first-page');
  });

  it('Click the second pagination button to nagivate to the second page', async () => {
    const wrapper = mount(DataTable, {
      props: {
        items: mockClientItems(200),
        buttonsPagination: true,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    const buttonArr = wrapper.findAll('.item.button');
    const secondButton = buttonArr.at(1);
    await secondButton.trigger('click');
    expect(secondButton.classes()).include('active');

    const tdArr = wrapper.findAll('td');
    const firstTd = tdArr.at(0);
    expect(firstTd.text()).toBe(mockClientItems(200)[5].name);
    const trArr = wrapper.findAll('tbody tr');
    expect(trArr.length).equal(5);
  });
});

// Multiple selecting
describe('Multiple selecting', () => {
  it('Gather data of the the top two row items', async () => {
    const mockItems = mockClientItems(200);
    const wrapper = mount(DataTable, {
      props: {
        itemsSelected: [],
        items: mockItems,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    const singleCheckboxArr = wrapper.findAll('.single-select__checkbox');
    const firstSingleCheckbox = singleCheckboxArr.at(0);
    const secondSingleCheckbox = singleCheckboxArr.at(1);
    await firstSingleCheckbox.trigger('click');
    await secondSingleCheckbox.trigger('click');
    const updateItemsSelecedEvent = wrapper.emitted('update:itemsSelected');
    expect(updateItemsSelecedEvent).toHaveLength(2);
    expect(updateItemsSelecedEvent[1]).toEqual([[mockItems[1], mockItems[0]]]);
  });

  it('Gather data of the the first and sixth row items', async () => {
    const mockItems = mockClientItems(200);
    const wrapper = mount(DataTable, {
      props: {
        itemsSelected: [],
        items: mockItems,
        headers: headersMocked,
        rowsPerPage: 5,
      },
    });
    const singleCheckboxArr = wrapper.findAll('.single-select__checkbox');
    const firstSingleCheckbox = singleCheckboxArr.at(0);
    await firstSingleCheckbox.trigger('click');

    const nextPageButton = wrapper.find('.next-page__click-button');
    await nextPageButton.trigger('click');

    const singleCheckboxArrInSecondPage = wrapper.findAll('.single-select__checkbox');
    const firstSingleCheckboxInSecondPage = singleCheckboxArrInSecondPage.at(0);
    await firstSingleCheckboxInSecondPage.trigger('click');

    const updateItemsSelecedEvent = wrapper.emitted('update:itemsSelected');
    expect(updateItemsSelecedEvent).toHaveLength(2);
    expect(updateItemsSelecedEvent[1]).toEqual([[mockItems[5], mockItems[0]]]);
  });
});

// Single field sorting
describe('Single field sorting', () => {
  it('Sorting by height column', async () => {
    const mockItems = mockClientItems(200);
    const wrapper = mount(DataTable, {
      props: {
        items: mockItems,
        headers: headersMocked,
        rowsPerPage: 5,
        sortBy: 'height',
        sortType: 'desc',
      },
    });
    const trArr = wrapper.findAll('tbody tr');
    const firstTr = trArr.at(0);
    expect(firstTr.findAll('td').at(0).text()).toBe(mockItems[mockItems.length - 1].name);
  });

  it('Sorting by height column', async () => {
    const mockItems = mockClientItems(200);
    const wrapper = mount(DataTable, {
      props: {
        items: mockItems,
        headers: headersMocked,
        rowsPerPage: 5,
        sortBy: 'height',
        sortType: 'desc',
      },
    });
    const sortableTh = wrapper.find('.sortable');
    await sortableTh.trigger('click');
    expect(sortableTh.classes()).include('none');

    const trArr = wrapper.findAll('tbody tr');
    const firstTr = trArr.at(0);
    expect(firstTr.findAll('td').at(0).text()).toBe(mockItems[0].name);
  });
});

// Searching
describe('Searching', () => {
  it('Searching by specific field', async () => {
    const mockItems = mockClientItems(200);
    const wrapper = mount(DataTable, {
      props: {
        items: mockItems,
        headers: headersMocked,
        rowsPerPage: 5,
        searchField: 'address',
        searchValue: 'address-115',
      },
    });
    const trArr = wrapper.findAll('tbody tr');
    expect(trArr.length).toBe(1);
    expect(wrapper.findAll('tbody td').at(0).text()).toBe(mockItems[114].name);
  });
});

// Server side paginate and sort
describe('Server side paginate and sort', () => {
  it('Click next page button to load from server', async () => {
    const serverOptions = {
      page: 1,
      rowsPerPage: 100,
      sortBy: 'height',
      sortType: 'desc',
    };

    const {
      serverCurrentPageItems,
      serverTotalItemsLength,
    } = await mockServerItems(serverOptions);

    const wrapper = mount(DataTable, {
      props: {
        serverItemsLength: serverTotalItemsLength,
        serverOptions,
        items: serverCurrentPageItems,
        headers: headersMocked,
      },
    });
    expect(wrapper.findAll('tbody td').at(0).text()).toBe(serverCurrentPageItems[0].name);

    const nextPageButton = wrapper.find('.next-page__click-button');
    await nextPageButton.trigger('click');

    const updateServerOptionsEvent = wrapper.emitted('update:serverOptions');
    expect(updateServerOptionsEvent).toHaveLength(1);
    expect(updateServerOptionsEvent[0]).toEqual([{
      page: 2,
      rowsPerPage: 100,
      sortBy: 'height',
      sortType: 'desc',
    }]);
  });
});

describe('Row Tracking', () => {
  it('should select the first item',  async () => {
    // Arrange
    const rowsPerPage = 2
    const mockItems = mockClientItems(rowsPerPage);
    const firstItem = {...mockItems[0], address: 'New ADDRESS !@#!'}
    const wrapper = mount(DataTable, {
      props: {
        itemsSelected: [firstItem],
        items: mockItems,
        headers: headersMocked,
        rowsPerPage,
        itemsKey: 'name'
      },
    });
    
    // Act
    let checkboxes = wrapper.findAll('.easy-checkbox input');

    // Assert
    expect(checkboxes).toHaveLength(rowsPerPage + 1)
    const checkedList = checkboxes.map(checkbox => checkbox.element.checked)
    expect(checkedList).toEqual([false, true, false]);
  })

  it('should expand the first item',  async () => {
    // Arrange
    const rowsPerPage = 2
    const mockItems = mockClientItems(rowsPerPage);
    const firstItem = {...mockItems[0], address: 'New ADDRESS !@#!'}
    const wrapper = mount(DataTable, {
      props: {
        itemsExpanded: [firstItem],
        items: mockItems,
        headers: headersMocked,
        rowsPerPage,
        itemsKey: 'name',
      },
      slots: {
        expand: `<template #expand="item"> Hello expanded row </template>`
      } 
    });

    // Act
    let expandedIcons = wrapper.findAll('.expand-icon.expanding');

    // Assert
    expect(expandedIcons).toHaveLength(1)
  })
})
