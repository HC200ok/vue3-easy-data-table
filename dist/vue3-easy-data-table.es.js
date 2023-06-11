var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { defineComponent, useCssVars, unref, computed, inject, openBlock, createElementBlock, withModifiers, createElementVNode, normalizeClass, pushScopeId, popScopeId, ref, watch, onMounted, onBeforeUnmount, toDisplayString, Fragment, renderList, useSlots, renderSlot, createCommentVNode, toRefs, provide, normalizeStyle, createBlock, normalizeProps, mergeProps, guardReactiveProps, createTextVNode, createVNode, isRef, createSlots, withCtx } from "vue";
var MultipleSelectCheckBox_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _withScopeId$5 = (n) => (pushScopeId("data-v-e0a0b7f0"), n = n(), popScopeId(), n);
const _hoisted_1$7 = ["onClick"];
const _hoisted_2$6 = ["checked"];
const _hoisted_3$4 = /* @__PURE__ */ _withScopeId$5(() => /* @__PURE__ */ createElementVNode("label", { for: "checbox" }, null, -1));
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "MultipleSelectCheckBox",
  props: {
    status: { type: String, required: true }
  },
  emits: ["change"],
  setup(__props, { emit: emits }) {
    const props = __props;
    useCssVars((_ctx) => ({
      "51ab8a49": unref(themeColor)
    }));
    const isChecked = computed(() => props.status === "allSelected");
    const toggleChecked = () => {
      emits("change", !isChecked.value);
    };
    const themeColor = inject("themeColor");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "easy-checkbox",
        onClick: withModifiers(toggleChecked, ["stop", "prevent"])
      }, [
        createElementVNode("input", {
          type: "checkbox",
          checked: unref(isChecked),
          class: normalizeClass(__props.status)
        }, null, 10, _hoisted_2$6),
        _hoisted_3$4
      ], 8, _hoisted_1$7);
    };
  }
});
var MultipleSelectCheckBox = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-e0a0b7f0"]]);
var SingleSelectCheckBox_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId$4 = (n) => (pushScopeId("data-v-7e69a276"), n = n(), popScopeId(), n);
const _hoisted_1$6 = ["checked"];
const _hoisted_2$5 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ createElementVNode("label", { for: "checbox" }, null, -1));
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "SingleSelectCheckBox",
  props: {
    checked: { type: Boolean, required: true }
  },
  emits: ["change"],
  setup(__props, { emit: emits }) {
    useCssVars((_ctx) => ({
      "fdaf7e9e": unref(themeColor)
    }));
    const themeColor = inject("themeColor");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "easy-checkbox",
        onClick: _cache[0] || (_cache[0] = withModifiers(($event) => emits("change"), ["stop", "prevent"]))
      }, [
        createElementVNode("input", {
          type: "checkbox",
          checked: __props.checked
        }, null, 8, _hoisted_1$6),
        _hoisted_2$5
      ]);
    };
  }
});
var SingleSelectCheckBox = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-7e69a276"]]);
var RowsSelector_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId$3 = (n) => (pushScopeId("data-v-4ca5de3a"), n = n(), popScopeId(), n);
const _hoisted_1$5 = { class: "easy-data-table__rows-selector" };
const _hoisted_2$4 = { class: "rows-input" };
const _hoisted_3$3 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ createElementVNode("div", { class: "triangle" }, null, -1));
const _hoisted_4$3 = ["onClick"];
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "RowsSelector",
  props: {
    modelValue: { type: Number, required: true },
    rowsItems: { type: Array, required: true }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: emits }) {
    const props = __props;
    useCssVars((_ctx) => ({
      "1b889342": unref(themeColor)
    }));
    const showList = ref(false);
    const showInsideOfTable = ref(false);
    const dataTable = inject("dataTable");
    watch(showList, (val) => {
      if (val && dataTable) {
        const windowHeight = window.innerHeight;
        const dataTableHeight = dataTable.value.getBoundingClientRect().height;
        const dataTableTop = dataTable.value.getBoundingClientRect().top;
        if (windowHeight - (dataTableHeight + dataTableTop) <= 100) {
          showInsideOfTable.value = true;
        } else {
          showInsideOfTable.value = false;
        }
      }
    });
    const rowsComputed = computed({
      get: () => props.modelValue,
      set: (value) => {
        emits("update:modelValue", value);
      }
    });
    const changeSelectedRows = (value) => {
      rowsComputed.value = value;
      showList.value = false;
    };
    const isDescendant = (child, className) => {
      let node = child.parentNode;
      while (node != null) {
        if (node.classList && node.classList.contains(className)) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    };
    const closeRowsSelector = (e) => {
      if (!isDescendant(e.target, "easy-data-table__rows-selector"))
        showList.value = false;
    };
    onMounted(() => {
      document.addEventListener("click", closeRowsSelector);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", closeRowsSelector);
    });
    const themeColor = inject("themeColor");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        createElementVNode("div", {
          class: "rows-input__wrapper",
          onClick: _cache[0] || (_cache[0] = ($event) => showList.value = !showList.value)
        }, [
          createElementVNode("div", _hoisted_2$4, toDisplayString(unref(rowsComputed)), 1),
          _hoisted_3$3
        ]),
        createElementVNode("ul", {
          class: normalizeClass(["select-items", { show: showList.value, inside: showInsideOfTable.value }])
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.rowsItems, (item) => {
            return openBlock(), createElementBlock("li", {
              key: item,
              class: normalizeClass({ selected: item === unref(rowsComputed) }),
              onClick: ($event) => changeSelectedRows(item)
            }, toDisplayString(item), 11, _hoisted_4$3);
          }), 128))
        ], 2)
      ]);
    };
  }
});
var RowsSelector = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-4ca5de3a"]]);
var Loading_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId$2 = (n) => (pushScopeId("data-v-1fa3a520"), n = n(), popScopeId(), n);
const _hoisted_1$4 = { class: "lds-ring" };
const _hoisted_2$3 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createElementVNode("div", null, null, -1));
const _hoisted_3$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createElementVNode("div", null, null, -1));
const _hoisted_4$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createElementVNode("div", null, null, -1));
const _hoisted_5$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createElementVNode("div", null, null, -1));
const _hoisted_6$1 = [
  _hoisted_2$3,
  _hoisted_3$2,
  _hoisted_4$2,
  _hoisted_5$1
];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Loading",
  setup(__props) {
    useCssVars((_ctx) => ({
      "26774109": unref(themeColor)
    }));
    const themeColor = inject("themeColor");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, _hoisted_6$1);
    };
  }
});
var Loading = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-1fa3a520"]]);
var LoadingLine_vue_vue_type_style_index_0_scoped_true_lang = "";
const _hoisted_1$3 = { class: "loader-line" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "LoadingLine",
  setup(__props) {
    useCssVars((_ctx) => ({
      "0d327f57": unref(themeColor)
    }));
    const themeColor = inject("themeColor");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3);
    };
  }
});
var LoadingLine = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-7d281cac"]]);
var ButtonsPagination_vue_vue_type_style_index_0_scoped_true_lang = "";
const _hoisted_1$2 = { class: "buttons-pagination" };
const _hoisted_2$2 = ["onClick"];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ButtonsPagination",
  props: {
    maxPaginationNumber: { type: Number, required: true },
    currentPaginationNumber: { type: Number, required: true }
  },
  emits: ["updatePage"],
  setup(__props, { emit: emits }) {
    const props = __props;
    useCssVars((_ctx) => ({
      "40dd4f07": unref(themeColor)
    }));
    const totalVisible = 7;
    const changePage = (item) => {
      if (item.type === "button" && !item.active)
        emits("updatePage", item.page);
    };
    const paginationItemsForRender = computed(() => {
      const paginationItems = [];
      if (props.maxPaginationNumber <= totalVisible) {
        for (let i = 1; i <= props.maxPaginationNumber; i += 1) {
          paginationItems.push({
            type: "button",
            page: i,
            active: i === props.currentPaginationNumber,
            activePrev: i + 1 === props.currentPaginationNumber
          });
        }
      } else if ([1, 2, props.maxPaginationNumber, props.maxPaginationNumber - 1].includes(props.currentPaginationNumber)) {
        for (let i = 1; i <= totalVisible; i += 1) {
          if (i <= 3) {
            paginationItems.push({
              type: "button",
              page: i,
              active: i === props.currentPaginationNumber,
              activePrev: i + 1 === props.currentPaginationNumber
            });
          } else if (i === 4) {
            paginationItems.push({
              type: "omission"
            });
          } else {
            const page = props.maxPaginationNumber - (totalVisible - i);
            paginationItems.push({
              type: "button",
              page,
              active: page === props.currentPaginationNumber,
              activePrev: page + 1 === props.currentPaginationNumber
            });
          }
        }
      } else if ([3, 4].includes(props.currentPaginationNumber)) {
        for (let i = 1; i <= totalVisible; i += 1) {
          if (i <= 5) {
            paginationItems.push({
              type: "button",
              page: i,
              active: i === props.currentPaginationNumber,
              activePrev: i + 1 === props.currentPaginationNumber
            });
          } else if (i === 6) {
            paginationItems.push({
              type: "omission"
            });
          } else {
            paginationItems.push({
              type: "button",
              page: props.maxPaginationNumber,
              active: props.maxPaginationNumber === props.currentPaginationNumber,
              activePrev: i + 1 === props.currentPaginationNumber
            });
          }
        }
      } else if ([props.maxPaginationNumber - 2, props.maxPaginationNumber - 3].includes(props.currentPaginationNumber)) {
        for (let i = 1; i <= totalVisible; i += 1) {
          if (i === 1) {
            paginationItems.push({
              type: "button",
              page: 1,
              active: props.currentPaginationNumber === 1,
              activePrev: i + 1 === props.currentPaginationNumber
            });
          } else if (i === 2) {
            paginationItems.push({
              type: "omission"
            });
          } else {
            const page = props.maxPaginationNumber - (totalVisible - i);
            paginationItems.push({
              type: "button",
              page,
              active: page === props.currentPaginationNumber,
              activePrev: page + 1 === props.currentPaginationNumber
            });
          }
        }
      } else {
        for (let i = 1; i <= totalVisible; i += 1) {
          if (i === 1) {
            paginationItems.push({
              type: "button",
              page: 1,
              active: props.currentPaginationNumber === 1,
              activePrev: i + 1 === props.currentPaginationNumber
            });
          } else if (i === 2 || i === 6) {
            paginationItems.push({
              type: "omission"
            });
          } else if (i === 7) {
            paginationItems.push({
              type: "button",
              page: props.maxPaginationNumber,
              active: props.maxPaginationNumber === props.currentPaginationNumber,
              activePrev: i + 1 === props.currentPaginationNumber
            });
          } else {
            const diff = 4 - i;
            const page = props.currentPaginationNumber - diff;
            paginationItems.push({
              type: "button",
              page,
              active: page === props.currentPaginationNumber,
              activePrev: page + 1 === props.currentPaginationNumber
            });
          }
        }
      }
      return paginationItems;
    });
    const themeColor = inject("themeColor");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(paginationItemsForRender), (item, i) => {
          return openBlock(), createElementBlock("div", {
            key: i,
            class: normalizeClass(["item", {
              button: item.type === "button",
              active: item.type === "button" && item.active,
              "active-prev": item.type === "button" && item.activePrev,
              omission: item.type === "omission"
            }]),
            onClick: ($event) => changePage(item)
          }, toDisplayString(item.type === "button" ? item.page : "..."), 11, _hoisted_2$2);
        }), 128))
      ]);
    };
  }
});
var ButtonsPagination = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-4c681fa2"]]);
var PaginationArrows_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId$1 = (n) => (pushScopeId("data-v-c9da5286"), n = n(), popScopeId(), n);
const _hoisted_1$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("span", { class: "arrow arrow-right" }, null, -1));
const _hoisted_2$1 = [
  _hoisted_1$1
];
const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createElementVNode("span", { class: "arrow arrow-left" }, null, -1));
const _hoisted_4$1 = [
  _hoisted_3$1
];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PaginationArrows",
  props: {
    isFirstPage: { type: Boolean, required: false },
    isLastPage: { type: Boolean, required: false }
  },
  emits: ["clickPrevPage", "clickNextPage"],
  setup(__props, { emit: emits }) {
    const slots = useSlots();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createElementVNode("div", {
          class: normalizeClass(["previous-page__click-button", { "first-page": __props.isFirstPage }]),
          onClick: _cache[0] || (_cache[0] = ($event) => emits("clickPrevPage"))
        }, _hoisted_2$1, 2),
        unref(slots).buttonsPagination ? renderSlot(_ctx.$slots, "buttonsPagination", { key: 0 }, void 0, true) : createCommentVNode("", true),
        createElementVNode("div", {
          class: normalizeClass(["next-page__click-button", { "last-page": __props.isLastPage }]),
          onClick: _cache[1] || (_cache[1] = ($event) => emits("clickNextPage"))
        }, _hoisted_4$1, 2)
      ], 64);
    };
  }
});
var PaginationArrows = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c9da5286"]]);
function useClickRow(clickEventType, isMultipleSelectable, showIndex, emits) {
  const clickRow = (item, clickType, $event) => {
    if (clickEventType.value !== clickType)
      return;
    const clickRowArgument = __spreadValues({}, item);
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
    emits("clickRow", clickRowArgument, $event);
  };
  return {
    clickRow
  };
}
function useExpandableRow(items, prevPageEndIndex, emits) {
  const expandingItemIndexList = ref([]);
  const updateExpandingItemIndexList = (expandingItemIndex, expandingItem, event) => {
    event.stopPropagation();
    const index = expandingItemIndexList.value.indexOf(expandingItemIndex);
    if (index !== -1) {
      expandingItemIndexList.value.splice(index, 1);
    } else {
      const currentPageExpandIndex = items.value.findIndex((item) => JSON.stringify(item) === JSON.stringify(expandingItem));
      emits("expandRow", prevPageEndIndex.value + currentPageExpandIndex, expandingItem);
      expandingItemIndexList.value.push(prevPageEndIndex.value + currentPageExpandIndex);
    }
  };
  const clearExpandingItemIndexList = () => {
    expandingItemIndexList.value = [];
  };
  return {
    expandingItemIndexList,
    updateExpandingItemIndexList,
    clearExpandingItemIndexList
  };
}
function useFixedColumn(headersForRender) {
  const fixedHeaders = computed(() => headersForRender.value.filter((header) => header.fixed));
  const lastFixedColumn = computed(() => {
    if (!fixedHeaders.value.length)
      return "";
    return fixedHeaders.value[fixedHeaders.value.length - 1].value;
  });
  const fixedColumnsInfos = computed(() => {
    if (!fixedHeaders.value.length)
      return [];
    const fixedHeadersWidthArr = fixedHeaders.value.map((header) => {
      var _a;
      return (_a = header.width) != null ? _a : 100;
    });
    return fixedHeaders.value.map((header, index) => {
      var _a, _b;
      return {
        value: header.value,
        fixed: (_a = header.fixed) != null ? _a : true,
        width: (_b = header.width) != null ? _b : 100,
        distance: index === 0 ? 0 : fixedHeadersWidthArr.reduce((previous, current, i) => {
          let distance = previous;
          if (i < index)
            distance += current;
          return distance;
        })
      };
    });
  });
  return {
    fixedHeaders,
    lastFixedColumn,
    fixedColumnsInfos
  };
}
function useHeaders(showIndexSymbol, checkboxColumnWidth, expandColumnWidth, fixedCheckbox, fixedExpand, fixedIndex, headers, ifHasExpandSlot, indexColumnWidth, isMultipleSelectable, isServerSideMode, mustSort, serverOptionsComputed, showIndex, sortBy, sortType, multiSort, updateServerOptionsSort, emits) {
  const hasFixedColumnsFromUser = computed(() => headers.value.findIndex((header) => header.fixed) !== -1);
  const fixedHeadersFromUser = computed(() => {
    if (hasFixedColumnsFromUser.value)
      return headers.value.filter((header) => header.fixed);
    return [];
  });
  const unFixedHeaders = computed(() => headers.value.filter((header) => !header.fixed));
  const generateClientSortOptions = (sortByValue, sortTypeValue) => {
    if (Array.isArray(sortByValue) && Array.isArray(sortTypeValue)) {
      return {
        sortBy: sortByValue,
        sortDesc: sortTypeValue.map((val) => val === "desc")
      };
    }
    if (sortByValue !== "") {
      return {
        sortBy: sortBy.value,
        sortDesc: sortType.value === "desc"
      };
    }
    return null;
  };
  const clientSortOptions = ref(generateClientSortOptions(sortBy.value, sortType.value));
  const headersForRender = computed(() => {
    var _a;
    const fixedHeaders = [
      ...fixedHeadersFromUser.value,
      ...unFixedHeaders.value
    ];
    const headersSorting = fixedHeaders.map((header) => {
      const headerSorting = Object.assign(header);
      if (headerSorting.sortable)
        headerSorting.sortType = "none";
      if (serverOptionsComputed.value) {
        if (Array.isArray(serverOptionsComputed.value.sortBy) && Array.isArray(serverOptionsComputed.value.sortType) && serverOptionsComputed.value.sortBy.includes(headerSorting.value)) {
          const index = serverOptionsComputed.value.sortBy.indexOf(headerSorting.value);
          headerSorting.sortType = serverOptionsComputed.value.sortType[index];
        } else if (headerSorting.value === serverOptionsComputed.value.sortBy && serverOptionsComputed.value.sortType) {
          headerSorting.sortType = serverOptionsComputed.value.sortType;
        }
      }
      if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy) && Array.isArray(clientSortOptions.value.sortDesc) && clientSortOptions.value.sortBy.includes(headerSorting.value)) {
        const index = clientSortOptions.value.sortBy.indexOf(headerSorting.value);
        headerSorting.sortType = clientSortOptions.value.sortDesc[index] ? "desc" : "asc";
      } else if (clientSortOptions.value && headerSorting.value === clientSortOptions.value.sortBy) {
        headerSorting.sortType = clientSortOptions.value.sortDesc ? "desc" : "asc";
      }
      return headerSorting;
    });
    let headersWithExpand = [];
    if (!ifHasExpandSlot.value) {
      headersWithExpand = headersSorting;
    } else {
      const headerExpand = fixedExpand.value || hasFixedColumnsFromUser.value ? {
        text: "",
        value: "expand",
        fixed: true,
        width: expandColumnWidth.value
      } : { text: "", value: "expand" };
      headersWithExpand = [headerExpand, ...headersSorting];
    }
    let headersWithIndex = [];
    if (!showIndex.value) {
      headersWithIndex = headersWithExpand;
    } else {
      const headerIndex = fixedIndex.value || hasFixedColumnsFromUser.value ? {
        text: showIndexSymbol.value,
        value: "index",
        fixed: true,
        width: indexColumnWidth.value
      } : { text: showIndexSymbol.value, value: "index" };
      headersWithIndex = [headerIndex, ...headersWithExpand];
    }
    let headersWithCheckbox = [];
    if (!isMultipleSelectable.value) {
      headersWithCheckbox = headersWithIndex;
    } else {
      const headerCheckbox = fixedCheckbox.value || hasFixedColumnsFromUser.value ? {
        text: "checkbox",
        value: "checkbox",
        fixed: true,
        width: (_a = checkboxColumnWidth.value) != null ? _a : 36
      } : { text: "checkbox", value: "checkbox" };
      headersWithCheckbox = [headerCheckbox, ...headersWithIndex];
    }
    return headersWithCheckbox;
  });
  const headerColumns = computed(() => headersForRender.value.map((header) => header.value));
  const updateSortField = (newSortBy, oldSortType) => {
    let newSortType = null;
    if (oldSortType === "none") {
      newSortType = "asc";
    } else if (oldSortType === "asc") {
      newSortType = "desc";
    } else {
      newSortType = mustSort.value ? "asc" : null;
    }
    if (isServerSideMode.value) {
      updateServerOptionsSort(newSortBy, newSortType);
    }
    if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy) && Array.isArray(clientSortOptions.value.sortDesc)) {
      const index = clientSortOptions.value.sortBy.indexOf(newSortBy);
      if (index === -1) {
        if (newSortType !== null) {
          clientSortOptions.value.sortBy.push(newSortBy);
          clientSortOptions.value.sortDesc.push(newSortType === "desc");
        }
      } else if (newSortType === null) {
        clientSortOptions.value.sortDesc.splice(index, 1);
        clientSortOptions.value.sortBy.splice(index, 1);
      } else {
        clientSortOptions.value.sortDesc[index] = newSortType === "desc";
      }
    } else if (newSortType === null) {
      clientSortOptions.value = null;
    } else {
      clientSortOptions.value = {
        sortBy: newSortBy,
        sortDesc: newSortType === "desc"
      };
    }
    emits("updateSort", {
      sortType: newSortType,
      sortBy: newSortBy
    });
  };
  const isMultiSorting = (headerText) => {
    if (serverOptionsComputed.value) {
      if (Array.isArray(serverOptionsComputed.value.sortBy))
        return serverOptionsComputed.value.sortBy.includes(headerText);
    }
    if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy)) {
      return clientSortOptions.value.sortBy.includes(headerText);
    }
    return false;
  };
  const getMultiSortNumber = (headerText) => {
    if (serverOptionsComputed.value) {
      if (Array.isArray(serverOptionsComputed.value.sortBy))
        return serverOptionsComputed.value.sortBy.indexOf(headerText) + 1;
    }
    if (clientSortOptions.value && Array.isArray(clientSortOptions.value.sortBy)) {
      return clientSortOptions.value.sortBy.indexOf(headerText) + 1;
    }
    return false;
  };
  return {
    clientSortOptions,
    headerColumns,
    headersForRender,
    updateSortField,
    isMultiSorting,
    getMultiSortNumber
  };
}
function usePageItems(currentPaginationNumber, isMultipleSelectable, isServerSideMode, items, rowsPerPageRef, selectItemsComputed, showIndex, totalItems, totalItemsLength) {
  const currentPageFirstIndex = computed(() => (currentPaginationNumber.value - 1) * rowsPerPageRef.value + 1);
  const currentPageLastIndex = computed(() => {
    if (isServerSideMode.value) {
      return Math.min(totalItemsLength.value, currentPaginationNumber.value * rowsPerPageRef.value);
    }
    return Math.min(totalItems.value.length, currentPaginationNumber.value * rowsPerPageRef.value);
  });
  const itemsInPage = computed(() => {
    if (isServerSideMode.value)
      return items.value;
    return totalItems.value.slice(currentPageFirstIndex.value - 1, currentPageLastIndex.value);
  });
  const itemsWithIndex = computed(() => {
    if (showIndex.value) {
      return itemsInPage.value.map((item, index) => __spreadValues({ index: currentPageFirstIndex.value + index }, item));
    }
    return itemsInPage.value;
  });
  const multipleSelectStatus = computed(() => {
    if (selectItemsComputed.value.length === 0) {
      return "noneSelected";
    }
    const isNoneSelected = selectItemsComputed.value.every((itemSelected) => {
      if (totalItems.value.findIndex((item) => JSON.stringify(itemSelected) === JSON.stringify(item)) !== -1) {
        return false;
      }
      return true;
    });
    if (isNoneSelected)
      return "noneSelected";
    if (selectItemsComputed.value.length === totalItems.value.length) {
      const isAllSelected = selectItemsComputed.value.every((itemSelected) => {
        if (totalItems.value.findIndex((item) => JSON.stringify(itemSelected) === JSON.stringify(item)) === -1) {
          return false;
        }
        return true;
      });
      return isAllSelected ? "allSelected" : "partSelected";
    }
    return "partSelected";
  });
  const pageItems = computed(() => {
    if (!isMultipleSelectable.value)
      return itemsWithIndex.value;
    if (multipleSelectStatus.value === "allSelected") {
      return itemsWithIndex.value.map((item) => __spreadValues({ checkbox: true }, item));
    }
    if (multipleSelectStatus.value === "noneSelected") {
      return itemsWithIndex.value.map((item) => __spreadValues({ checkbox: false }, item));
    }
    return itemsWithIndex.value.map((item) => {
      const isSelected = selectItemsComputed.value.findIndex((selectItem) => {
        const itemDeepCloned = __spreadValues({}, item);
        delete itemDeepCloned.index;
        return JSON.stringify(selectItem) === JSON.stringify(itemDeepCloned);
      }) !== -1;
      return __spreadValues({ checkbox: isSelected }, item);
    });
  });
  return {
    currentPageFirstIndex,
    currentPageLastIndex,
    multipleSelectStatus,
    pageItems
  };
}
function usePagination(currentPage, isServerSideMode, loading, totalItemsLength, rowsPerPage, serverOptions, updateServerOptionsPage) {
  const currentPaginationNumber = ref(serverOptions.value ? serverOptions.value.page : currentPage.value);
  const maxPaginationNumber = computed(() => Math.ceil(totalItemsLength.value / rowsPerPage.value));
  const isLastPage = computed(() => maxPaginationNumber.value === 0 || currentPaginationNumber.value === maxPaginationNumber.value);
  const isFirstPage = computed(() => currentPaginationNumber.value === 1);
  const nextPage = () => {
    if (totalItemsLength.value === 0)
      return;
    if (isLastPage.value)
      return;
    if (loading.value)
      return;
    if (isServerSideMode.value) {
      const nextPaginationNumber = currentPaginationNumber.value + 1;
      updateServerOptionsPage(nextPaginationNumber);
    } else {
      currentPaginationNumber.value += 1;
    }
  };
  const prevPage = () => {
    if (totalItemsLength.value === 0)
      return;
    if (isFirstPage.value)
      return;
    if (loading.value)
      return;
    if (isServerSideMode.value) {
      const prevPaginationNumber = currentPaginationNumber.value - 1;
      updateServerOptionsPage(prevPaginationNumber);
    } else {
      currentPaginationNumber.value -= 1;
    }
  };
  const updatePage = (page) => {
    if (loading.value)
      return;
    if (isServerSideMode.value) {
      updateServerOptionsPage(page);
    } else {
      currentPaginationNumber.value = page;
    }
  };
  const updateCurrentPaginationNumber = (page) => {
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
    updateCurrentPaginationNumber
  };
}
function useRows(isServerSideMode, rowsItems, serverOptions, rowsPerPage) {
  const rowsItemsComputed = computed(() => {
    if (!isServerSideMode.value && rowsItems.value.findIndex((item) => item === rowsPerPage.value) === -1) {
      return [rowsPerPage.value, ...rowsItems.value];
    }
    return rowsItems.value;
  });
  const rowsPerPageRef = ref(serverOptions.value ? serverOptions.value.rowsPerPage : rowsPerPage.value);
  const updateRowsPerPage = (option) => {
    rowsPerPageRef.value = option;
  };
  return {
    rowsItemsComputed,
    rowsPerPageRef,
    updateRowsPerPage
  };
}
function useServerOptions(serverOptions, multiSort, emits) {
  const serverOptionsComputed = computed({
    get: () => {
      if (serverOptions.value) {
        const {
          page,
          rowsPerPage,
          sortBy,
          sortType
        } = serverOptions.value;
        return {
          page,
          rowsPerPage,
          sortBy: sortBy != null ? sortBy : null,
          sortType: sortType != null ? sortType : null
        };
      }
      return null;
    },
    set: (value) => {
      emits("update:serverOptions", value);
    }
  });
  const updateServerOptionsPage = (page) => {
    if (serverOptionsComputed.value) {
      serverOptionsComputed.value = __spreadProps(__spreadValues({}, serverOptionsComputed.value), {
        page
      });
    }
  };
  const updateServerOptionsRowsPerPage = (rowsPerPage) => {
    if (serverOptionsComputed.value) {
      serverOptionsComputed.value = __spreadProps(__spreadValues({}, serverOptionsComputed.value), {
        page: 1,
        rowsPerPage
      });
    }
  };
  const updateServerOptionsSort = (newSortBy, newSortType) => {
    if (serverOptionsComputed.value) {
      if (multiSort.value && Array.isArray(serverOptionsComputed.value.sortBy) && Array.isArray(serverOptionsComputed.value.sortType)) {
        const index = serverOptionsComputed.value.sortBy.findIndex((val) => val === newSortBy);
        if (index === -1 && newSortType !== null) {
          serverOptionsComputed.value.sortBy.push(newSortBy);
          serverOptionsComputed.value.sortType.push(newSortType);
        }
        if (newSortType === null) {
          serverOptionsComputed.value.sortBy.splice(index, 1);
          serverOptionsComputed.value.sortType.splice(index, 1);
        } else {
          serverOptionsComputed.value.sortType[index] = newSortType;
        }
      } else {
        serverOptionsComputed.value = __spreadProps(__spreadValues({}, serverOptionsComputed.value), {
          sortBy: newSortType !== null ? newSortBy : null,
          sortType: newSortType
        });
      }
    }
  };
  return {
    serverOptionsComputed,
    updateServerOptionsPage,
    updateServerOptionsSort,
    updateServerOptionsRowsPerPage
  };
}
function getItemValue(column, item) {
  if (column.includes(".")) {
    let content = "";
    const keys = column.split(".");
    const { length } = keys;
    let i = 0;
    while (i < length) {
      content = i === 0 ? item[keys[i]] : content[keys[i]];
      i += 1;
      if (content === void 0)
        break;
    }
    return content;
  }
  return item[column];
}
function generateColumnContent(column, item) {
  const content = getItemValue(column, item);
  return Array.isArray(content) ? content.join(",") : content;
}
function useTotalItems(clientSortOptions, filterOptions, isServerSideMode, items, itemsSelected, searchField, searchValue, serverItemsLength, multiSort, emits) {
  const generateSearchingTarget = (item) => {
    if (typeof searchField.value === "string" && searchField.value !== "")
      return getItemValue(searchField.value, item);
    if (Array.isArray(searchField.value)) {
      let searchString = "";
      searchField.value.forEach((field) => {
        searchString += getItemValue(field, item);
      });
      return searchString;
    }
    return Object.values(item).join(" ");
  };
  const itemsSearching = computed(() => {
    if (!isServerSideMode.value && searchValue.value !== "") {
      const regex = new RegExp(searchValue.value, "i");
      return items.value.filter((item) => regex.test(generateSearchingTarget(item)));
    }
    return items.value;
  });
  const itemsFiltering = computed(() => {
    let itemsFiltered = [...itemsSearching.value];
    if (filterOptions.value) {
      filterOptions.value.forEach((option) => {
        itemsFiltered = itemsFiltered.filter((item) => {
          const { field, comparison, criteria } = option;
          if (typeof comparison === "function") {
            return comparison(getItemValue(field, item), criteria);
          }
          const itemValue = getItemValue(field, item);
          switch (comparison) {
            case "=":
              return itemValue === criteria;
            case "!=":
              return itemValue !== criteria;
            case ">":
              return itemValue > criteria;
            case "<":
              return itemValue < criteria;
            case "<=":
              return itemValue <= criteria;
            case ">=":
              return itemValue >= criteria;
            case "between":
              return itemValue >= Math.min(...criteria) && itemValue <= Math.max(...criteria);
            case "in":
              return criteria.includes(itemValue);
            default:
              return itemValue === criteria;
          }
        });
      });
      return itemsFiltered;
    }
    return itemsSearching.value;
  });
  watch(itemsFiltering, (newVal) => {
    if (filterOptions.value) {
      emits("updateFilter", newVal);
    }
  }, { immediate: true, deep: true });
  function recursionMuiltSort(sortByArr, sortDescArr, itemsToSort, index) {
    const sortBy = sortByArr[index];
    const sortDesc = sortDescArr[index];
    const sorted = (index === 0 ? itemsToSort : recursionMuiltSort(sortByArr, sortDescArr, itemsToSort, index - 1)).sort((a, b) => {
      let isAllSame = true;
      for (let i = 0; i < index; i += 1) {
        if (getItemValue(sortByArr[i], a) !== getItemValue(sortByArr[i], b)) {
          isAllSame = false;
          break;
        }
      }
      if (isAllSame) {
        if (getItemValue(sortBy, a) < getItemValue(sortBy, b))
          return sortDesc ? 1 : -1;
        if (getItemValue(sortBy, a) > getItemValue(sortBy, b))
          return sortDesc ? -1 : 1;
        return 0;
      }
      return 0;
    });
    return sorted;
  }
  const totalItems = computed(() => {
    if (isServerSideMode.value)
      return items.value;
    if (clientSortOptions.value === null)
      return itemsFiltering.value;
    const { sortBy, sortDesc } = clientSortOptions.value;
    const itemsFilteringSorted = [...itemsFiltering.value];
    if (multiSort && Array.isArray(sortBy) && Array.isArray(sortDesc)) {
      if (sortBy.length === 0)
        return itemsFilteringSorted;
      return recursionMuiltSort(sortBy, sortDesc, itemsFilteringSorted, sortBy.length - 1);
    }
    return itemsFilteringSorted.sort((a, b) => {
      if (getItemValue(sortBy, a) < getItemValue(sortBy, b))
        return sortDesc ? 1 : -1;
      if (getItemValue(sortBy, a) > getItemValue(sortBy, b))
        return sortDesc ? -1 : 1;
      return 0;
    });
  });
  const totalItemsLength = computed(() => isServerSideMode.value ? serverItemsLength.value : totalItems.value.length);
  const selectItemsComputed = computed({
    get: () => {
      var _a;
      return (_a = itemsSelected.value) != null ? _a : [];
    },
    set: (value) => {
      emits("update:itemsSelected", value);
    }
  });
  const toggleSelectAll = (isChecked) => {
    selectItemsComputed.value = isChecked ? totalItems.value : [];
  };
  const toggleSelectItem = (item) => {
    const isAlreadyChecked = item.checkbox;
    delete item.checkbox;
    delete item.index;
    if (!isAlreadyChecked) {
      const selectItemsArr = selectItemsComputed.value;
      selectItemsArr.unshift(item);
      selectItemsComputed.value = selectItemsArr;
      emits("selectRow", item);
    } else {
      selectItemsComputed.value = selectItemsComputed.value.filter((selectedItem) => JSON.stringify(selectedItem) !== JSON.stringify(item));
      emits("deselectRow", item);
    }
  };
  return {
    totalItems,
    selectItemsComputed,
    totalItemsLength,
    toggleSelectAll,
    toggleSelectItem
  };
}
var propsWithDefault = {
  alternating: {
    type: Boolean,
    default: false
  },
  buttonsPagination: {
    type: Boolean,
    default: false
  },
  checkboxColumnWidth: {
    type: Number,
    default: null
  },
  currentPage: {
    type: Number,
    default: 1
  },
  emptyMessage: {
    type: String,
    default: "No Available Data"
  },
  expandColumnWidth: {
    type: Number,
    default: 36
  },
  filterOptions: {
    type: Array,
    default: null
  },
  fixedExpand: {
    type: Boolean,
    default: false
  },
  fixedHeader: {
    type: Boolean,
    default: true
  },
  fixedCheckbox: {
    type: Boolean,
    default: false
  },
  fixedIndex: {
    type: Boolean,
    default: false
  },
  headerTextDirection: {
    type: String,
    default: "left"
  },
  bodyTextDirection: {
    type: String,
    default: "left"
  },
  hideFooter: {
    type: Boolean,
    default: false
  },
  hideRowsPerPage: {
    type: Boolean,
    default: false
  },
  hideHeader: {
    type: Boolean,
    default: false
  },
  indexColumnWidth: {
    type: Number,
    default: 60
  },
  itemsSelected: {
    type: Array,
    default: null
  },
  loading: {
    type: Boolean,
    deault: false
  },
  rowsPerPage: {
    type: Number,
    default: 25
  },
  rowsItems: {
    type: Array,
    default: () => [25, 50, 100]
  },
  rowsPerPageMessage: {
    type: String,
    default: "rows per page:"
  },
  searchField: {
    type: [String, Array],
    default: ""
  },
  searchValue: {
    type: String,
    default: ""
  },
  serverOptions: {
    type: Object,
    default: null
  },
  serverItemsLength: {
    type: Number,
    default: 0
  },
  showIndex: {
    type: Boolean,
    default: false
  },
  sortBy: {
    type: [String, Array],
    default: ""
  },
  sortType: {
    type: [String, Array],
    default: "asc"
  },
  multiSort: {
    type: Boolean,
    default: false
  },
  tableMinHeight: {
    type: Number,
    default: 180
  },
  tableHeight: {
    type: Number,
    default: null
  },
  themeColor: {
    type: String,
    default: "#42b883"
  },
  tableClassName: {
    type: String,
    default: ""
  },
  headerClassName: {
    type: String,
    default: ""
  },
  headerItemClassName: {
    type: [Function, String],
    default: ""
  },
  bodyRowClassName: {
    type: [Function, String],
    default: ""
  },
  bodyExpandRowClassName: {
    type: [Function, String],
    default: ""
  },
  bodyItemClassName: {
    type: [Function, String],
    default: ""
  },
  noHover: {
    type: Boolean,
    default: false
  },
  borderCell: {
    type: Boolean,
    default: false
  },
  mustSort: {
    type: Boolean,
    default: false
  },
  rowsOfPageSeparatorMessage: {
    type: String,
    default: "of"
  },
  clickEventType: {
    type: String,
    default: "single"
  },
  clickRowToExpand: {
    type: Boolean,
    default: false
  },
  tableNodeId: {
    type: String,
    default: ""
  },
  showIndexSymbol: {
    type: String,
    default: "#"
  }
};
var DataTable_vue_vue_type_style_index_0_lang = "";
var DataTable_vue_vue_type_style_index_1_scoped_true_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-513716fe"), n = n(), popScopeId(), n);
const _hoisted_1 = ["id"];
const _hoisted_2 = ["onClick"];
const _hoisted_3 = {
  key: 3,
  class: "header-text"
};
const _hoisted_4 = {
  key: 5,
  class: "multi-sort__number"
};
const _hoisted_5 = ["onClick", "onDblclick"];
const _hoisted_6 = ["onClick"];
const _hoisted_7 = ["colspan"];
const _hoisted_8 = {
  key: 0,
  class: "vue3-easy-data-table__loading"
};
const _hoisted_9 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("div", { class: "vue3-easy-data-table__loading-mask" }, null, -1));
const _hoisted_10 = { class: "loading-entity" };
const _hoisted_11 = {
  key: 1,
  class: "vue3-easy-data-table__message"
};
const _hoisted_12 = ["innerHTML"];
const _hoisted_13 = {
  key: 0,
  class: "vue3-easy-data-table__footer"
};
const _hoisted_14 = {
  key: 0,
  class: "pagination__rows-per-page"
};
const _hoisted_15 = { class: "pagination__items-index" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DataTable",
  props: __spreadProps(__spreadValues({}, propsWithDefault), {
    items: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    }
  }),
  emits: [
    "clickRow",
    "selectRow",
    "deselectRow",
    "expandRow",
    "updateSort",
    "updateFilter",
    "update:itemsSelected",
    "update:serverOptions",
    "updatePageItems",
    "updateTotalItems"
  ],
  setup(__props, { expose, emit: emits }) {
    const props = __props;
    useCssVars((_ctx) => ({
      "ed764a26": unref(tableMinHeightPx),
      "787ca023": unref(tableHeightPx)
    }));
    const {
      tableNodeId,
      clickEventType,
      bodyTextDirection,
      checkboxColumnWidth,
      currentPage,
      expandColumnWidth,
      filterOptions,
      fixedCheckbox,
      fixedExpand,
      fixedHeader,
      fixedIndex,
      headers,
      headerTextDirection,
      indexColumnWidth,
      items,
      itemsSelected,
      loading,
      mustSort,
      multiSort,
      rowsItems,
      rowsPerPage,
      searchField,
      searchValue,
      serverItemsLength,
      serverOptions,
      showIndex,
      sortBy,
      sortType,
      tableHeight,
      tableMinHeight,
      themeColor,
      rowsOfPageSeparatorMessage,
      showIndexSymbol
    } = toRefs(props);
    const tableHeightPx = computed(() => tableHeight.value ? `${tableHeight.value}px` : null);
    const tableMinHeightPx = computed(() => `${tableMinHeight.value}px`);
    provide("themeColor", themeColor.value);
    const slots = useSlots();
    const ifHasPaginationSlot = computed(() => !!slots.pagination);
    const ifHasLoadingSlot = computed(() => !!slots.loading);
    const ifHasExpandSlot = computed(() => !!slots.expand);
    const ifHasBodySlot = computed(() => !!slots.body);
    const dataTable = ref();
    const tableBody = ref();
    provide("dataTable", dataTable);
    const showShadow = ref(false);
    onMounted(() => {
      tableBody.value.addEventListener("scroll", () => {
        showShadow.value = tableBody.value.scrollLeft > 0;
      });
    });
    const isMultipleSelectable = computed(() => itemsSelected.value !== null);
    const isServerSideMode = computed(() => serverOptions.value !== null);
    const {
      serverOptionsComputed,
      updateServerOptionsPage,
      updateServerOptionsSort,
      updateServerOptionsRowsPerPage
    } = useServerOptions(serverOptions, multiSort, emits);
    const {
      clientSortOptions,
      headerColumns,
      headersForRender,
      updateSortField,
      isMultiSorting,
      getMultiSortNumber
    } = useHeaders(showIndexSymbol, checkboxColumnWidth, expandColumnWidth, fixedCheckbox, fixedExpand, fixedIndex, headers, ifHasExpandSlot, indexColumnWidth, isMultipleSelectable, isServerSideMode, mustSort, serverOptionsComputed, showIndex, sortBy, sortType, multiSort, updateServerOptionsSort, emits);
    const {
      rowsItemsComputed,
      rowsPerPageRef,
      updateRowsPerPage
    } = useRows(isServerSideMode, rowsItems, serverOptions, rowsPerPage);
    const {
      totalItems,
      selectItemsComputed,
      totalItemsLength,
      toggleSelectAll,
      toggleSelectItem
    } = useTotalItems(clientSortOptions, filterOptions, isServerSideMode, items, itemsSelected, searchField, searchValue, serverItemsLength, multiSort, emits);
    const {
      currentPaginationNumber,
      maxPaginationNumber,
      isLastPage,
      isFirstPage,
      nextPage,
      prevPage,
      updatePage,
      updateCurrentPaginationNumber
    } = usePagination(currentPage, isServerSideMode, loading, totalItemsLength, rowsPerPageRef, serverOptions, updateServerOptionsPage);
    const {
      currentPageFirstIndex,
      currentPageLastIndex,
      multipleSelectStatus,
      pageItems
    } = usePageItems(currentPaginationNumber, isMultipleSelectable, isServerSideMode, items, rowsPerPageRef, selectItemsComputed, showIndex, totalItems, totalItemsLength);
    const prevPageEndIndex = computed(() => {
      if (currentPaginationNumber.value === 0)
        return 0;
      return (currentPaginationNumber.value - 1) * rowsPerPageRef.value;
    });
    const {
      expandingItemIndexList,
      updateExpandingItemIndexList,
      clearExpandingItemIndexList
    } = useExpandableRow(pageItems, prevPageEndIndex, emits);
    const {
      fixedHeaders,
      lastFixedColumn,
      fixedColumnsInfos
    } = useFixedColumn(headersForRender);
    const {
      clickRow
    } = useClickRow(clickEventType, isMultipleSelectable, showIndex, emits);
    const getColStyle = (header) => {
      var _a;
      const width = (_a = header.width) != null ? _a : fixedHeaders.value.length ? 100 : null;
      if (width)
        return `width: ${width}px; min-width: ${width}px;`;
      return void 0;
    };
    const getFixedDistance = (column, type = "th") => {
      if (!fixedHeaders.value.length)
        return void 0;
      const columInfo = fixedColumnsInfos.value.find((info) => info.value === column);
      if (columInfo) {
        return `left: ${columInfo.distance}px;z-index: ${type === "th" ? 3 : 1};position: sticky;`;
      }
      return void 0;
    };
    watch(loading, (newVal, oldVal) => {
      if (serverOptionsComputed.value) {
        if (newVal === false && oldVal === true) {
          updateCurrentPaginationNumber(serverOptionsComputed.value.page);
          clearExpandingItemIndexList();
        }
      }
    });
    watch(rowsPerPageRef, (value) => {
      if (!isServerSideMode.value) {
        updatePage(1);
      } else {
        updateServerOptionsRowsPerPage(value);
      }
    });
    watch([searchValue, filterOptions], () => {
      if (!isServerSideMode.value) {
        updatePage(1);
      }
    });
    watch([currentPaginationNumber, clientSortOptions, searchField, searchValue, filterOptions], () => {
      clearExpandingItemIndexList();
    }, { deep: true });
    watch(pageItems, (value) => {
      emits("updatePageItems", value);
    }, { deep: true });
    watch(totalItems, (value) => {
      emits("updateTotalItems", value);
    }, { deep: true });
    expose({
      currentPageFirstIndex,
      currentPageLastIndex,
      clientItemsLength: totalItemsLength,
      maxPaginationNumber,
      currentPaginationNumber,
      isLastPage,
      isFirstPage,
      nextPage,
      prevPage,
      updatePage,
      rowsPerPageOptions: rowsItemsComputed,
      rowsPerPageActiveOption: rowsPerPageRef,
      updateRowsPerPageActiveOption: updateRowsPerPage
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "dataTable",
        ref: dataTable,
        class: normalizeClass(["vue3-easy-data-table", [_ctx.tableClassName]])
      }, [
        createElementVNode("div", {
          ref_key: "tableBody",
          ref: tableBody,
          class: normalizeClass(["vue3-easy-data-table__main", {
            "fixed-header": unref(fixedHeader),
            "fixed-height": unref(tableHeight),
            "show-shadow": showShadow.value,
            "table-fixed": unref(fixedHeaders).length,
            "hoverable": !_ctx.noHover,
            "border-cell": _ctx.borderCell
          }])
        }, [
          createElementVNode("table", { id: unref(tableNodeId) }, [
            createElementVNode("colgroup", null, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(headersForRender), (header, index) => {
                return openBlock(), createElementBlock("col", {
                  key: index,
                  style: normalizeStyle(getColStyle(header))
                }, null, 4);
              }), 128))
            ]),
            unref(headersForRender).length && !_ctx.hideHeader ? (openBlock(), createElementBlock("thead", {
              key: 0,
              class: normalizeClass(["vue3-easy-data-table__header", [_ctx.headerClassName]])
            }, [
              createElementVNode("tr", null, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(unref(headersForRender), (header, index) => {
                  return openBlock(), createElementBlock("th", {
                    key: index,
                    class: normalizeClass([{
                      sortable: header.sortable,
                      "none": header.sortable && header.sortType === "none",
                      "desc": header.sortable && header.sortType === "desc",
                      "asc": header.sortable && header.sortType === "asc",
                      "shadow": header.value === unref(lastFixedColumn)
                    }, typeof _ctx.headerItemClassName === "string" ? _ctx.headerItemClassName : _ctx.headerItemClassName(header, index + 1)]),
                    style: normalizeStyle(getFixedDistance(header.value)),
                    onClick: withModifiers(($event) => header.sortable && header.sortType ? unref(updateSortField)(header.value, header.sortType) : null, ["stop"])
                  }, [
                    header.text === "checkbox" ? (openBlock(), createBlock(MultipleSelectCheckBox, {
                      key: unref(multipleSelectStatus),
                      status: unref(multipleSelectStatus),
                      onChange: unref(toggleSelectAll)
                    }, null, 8, ["status", "onChange"])) : (openBlock(), createElementBlock("span", {
                      key: 1,
                      class: normalizeClass(["header", `direction-${unref(headerTextDirection)}`])
                    }, [
                      unref(slots)[`header-${header.value}`] ? renderSlot(_ctx.$slots, `header-${header.value}`, normalizeProps(mergeProps({ key: 0 }, header)), void 0, true) : unref(slots)[`header-${header.value.toLowerCase()}`] ? renderSlot(_ctx.$slots, `header-${header.value.toLowerCase()}`, normalizeProps(mergeProps({ key: 1 }, header)), void 0, true) : unref(slots)["header"] ? renderSlot(_ctx.$slots, "header", normalizeProps(mergeProps({ key: 2 }, header)), void 0, true) : (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(header.text), 1)),
                      header.sortable ? (openBlock(), createElementBlock("i", {
                        key: header.sortType ? header.sortType : "none",
                        class: normalizeClass(["sortType-icon", { "desc": header.sortType === "desc" }])
                      }, null, 2)) : createCommentVNode("", true),
                      unref(multiSort) && unref(isMultiSorting)(header.value) ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(unref(getMultiSortNumber)(header.value)), 1)) : createCommentVNode("", true)
                    ], 2))
                  ], 14, _hoisted_2);
                }), 128))
              ])
            ], 2)) : createCommentVNode("", true),
            unref(ifHasBodySlot) ? renderSlot(_ctx.$slots, "body", normalizeProps(mergeProps({ key: 1 }, unref(pageItems))), void 0, true) : unref(headerColumns).length ? (openBlock(), createElementBlock("tbody", {
              key: 2,
              class: normalizeClass(["vue3-easy-data-table__body", { "row-alternation": _ctx.alternating }])
            }, [
              renderSlot(_ctx.$slots, "body-prepend", normalizeProps(guardReactiveProps({
                items: unref(pageItems),
                pagination: {
                  isFirstPage: unref(isFirstPage),
                  isLastPage: unref(isLastPage),
                  currentPaginationNumber: unref(currentPaginationNumber),
                  maxPaginationNumber: unref(maxPaginationNumber),
                  nextPage: unref(nextPage),
                  prevPage: unref(prevPage)
                },
                headers: unref(headersForRender)
              })), void 0, true),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(pageItems), (item, index) => {
                return openBlock(), createElementBlock(Fragment, { key: index }, [
                  createElementVNode("tr", {
                    class: normalizeClass([
                      { "even-row": (index + 1) % 2 === 0 },
                      typeof _ctx.bodyRowClassName === "string" ? _ctx.bodyRowClassName : _ctx.bodyRowClassName(item, index + 1)
                    ]),
                    onClick: ($event) => {
                      unref(clickRow)(item, "single", $event);
                      _ctx.clickRowToExpand && unref(updateExpandingItemIndexList)(index + unref(prevPageEndIndex), item, $event);
                    },
                    onDblclick: ($event) => {
                      unref(clickRow)(item, "double", $event);
                    }
                  }, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(unref(headerColumns), (column, i) => {
                      return openBlock(), createElementBlock("td", {
                        key: i,
                        style: normalizeStyle(getFixedDistance(column, "td")),
                        class: normalizeClass([{
                          "shadow": column === unref(lastFixedColumn),
                          "can-expand": column === "expand"
                        }, typeof _ctx.bodyItemClassName === "string" ? _ctx.bodyItemClassName : _ctx.bodyItemClassName(column, index + 1), `direction-${unref(bodyTextDirection)}`]),
                        onClick: ($event) => column === "expand" ? unref(updateExpandingItemIndexList)(index + unref(prevPageEndIndex), item, $event) : null
                      }, [
                        unref(slots)[`item-${column}`] ? renderSlot(_ctx.$slots, `item-${column}`, normalizeProps(mergeProps({ key: 0 }, item)), void 0, true) : unref(slots)[`item-${column.toLowerCase()}`] ? renderSlot(_ctx.$slots, `item-${column.toLowerCase()}`, normalizeProps(mergeProps({ key: 1 }, item)), void 0, true) : column === "expand" ? (openBlock(), createElementBlock("i", {
                          key: 2,
                          class: normalizeClass(["expand-icon", { "expanding": unref(expandingItemIndexList).includes(unref(prevPageEndIndex) + index) }])
                        }, null, 2)) : column === "checkbox" ? (openBlock(), createBlock(SingleSelectCheckBox, {
                          key: 3,
                          checked: item[column],
                          onChange: ($event) => unref(toggleSelectItem)(item)
                        }, null, 8, ["checked", "onChange"])) : (openBlock(), createElementBlock(Fragment, { key: 4 }, [
                          createTextVNode(toDisplayString(unref(generateColumnContent)(column, item)), 1)
                        ], 64))
                      ], 14, _hoisted_6);
                    }), 128))
                  ], 42, _hoisted_5),
                  unref(ifHasExpandSlot) && unref(expandingItemIndexList).includes(index + unref(prevPageEndIndex)) ? (openBlock(), createElementBlock("tr", {
                    key: 0,
                    class: normalizeClass([
                      { "even-row": (index + 1) % 2 === 0 },
                      typeof _ctx.bodyExpandRowClassName === "string" ? _ctx.bodyExpandRowClassName : _ctx.bodyExpandRowClassName(item, index + 1)
                    ])
                  }, [
                    createElementVNode("td", {
                      colspan: unref(headersForRender).length,
                      class: "expand"
                    }, [
                      item.expandLoading ? (openBlock(), createBlock(LoadingLine, {
                        key: 0,
                        class: "expand-loading"
                      })) : createCommentVNode("", true),
                      renderSlot(_ctx.$slots, "expand", normalizeProps(guardReactiveProps(item)), void 0, true)
                    ], 8, _hoisted_7)
                  ], 2)) : createCommentVNode("", true)
                ], 64);
              }), 128)),
              renderSlot(_ctx.$slots, "body-append", normalizeProps(guardReactiveProps({
                items: unref(pageItems),
                pagination: {
                  isFirstPage: unref(isFirstPage),
                  isLastPage: unref(isLastPage),
                  currentPaginationNumber: unref(currentPaginationNumber),
                  maxPaginationNumber: unref(maxPaginationNumber),
                  nextPage: unref(nextPage),
                  prevPage: unref(prevPage),
                  updatePage: unref(updatePage)
                },
                headers: unref(headersForRender)
              })), void 0, true)
            ], 2)) : createCommentVNode("", true)
          ], 8, _hoisted_1),
          unref(loading) ? (openBlock(), createElementBlock("div", _hoisted_8, [
            _hoisted_9,
            createElementVNode("div", _hoisted_10, [
              unref(ifHasLoadingSlot) ? renderSlot(_ctx.$slots, "loading", { key: 0 }, void 0, true) : (openBlock(), createBlock(Loading, { key: 1 }))
            ])
          ])) : createCommentVNode("", true),
          !unref(pageItems).length && !unref(loading) ? (openBlock(), createElementBlock("div", _hoisted_11, [
            renderSlot(_ctx.$slots, "empty-message", {}, () => [
              createElementVNode("span", { innerHTML: _ctx.emptyMessage }, null, 8, _hoisted_12)
            ], true)
          ])) : createCommentVNode("", true)
        ], 2),
        !_ctx.hideFooter ? (openBlock(), createElementBlock("div", _hoisted_13, [
          !_ctx.hideRowsPerPage ? (openBlock(), createElementBlock("div", _hoisted_14, [
            createTextVNode(toDisplayString(_ctx.rowsPerPageMessage) + " ", 1),
            createVNode(RowsSelector, {
              modelValue: unref(rowsPerPageRef),
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(rowsPerPageRef) ? rowsPerPageRef.value = $event : null),
              "rows-items": unref(rowsItemsComputed)
            }, null, 8, ["modelValue", "rows-items"])
          ])) : createCommentVNode("", true),
          createElementVNode("div", _hoisted_15, toDisplayString(`${unref(currentPageFirstIndex)}\u2013${unref(currentPageLastIndex)}`) + " " + toDisplayString(unref(rowsOfPageSeparatorMessage)) + " " + toDisplayString(unref(totalItemsLength)), 1),
          unref(ifHasPaginationSlot) ? renderSlot(_ctx.$slots, "pagination", normalizeProps(mergeProps({ key: 1 }, {
            isFirstPage: unref(isFirstPage),
            isLastPage: unref(isLastPage),
            currentPaginationNumber: unref(currentPaginationNumber),
            maxPaginationNumber: unref(maxPaginationNumber),
            nextPage: unref(nextPage),
            prevPage: unref(prevPage)
          })), void 0, true) : (openBlock(), createBlock(PaginationArrows, {
            key: 2,
            "is-first-page": unref(isFirstPage),
            "is-last-page": unref(isLastPage),
            onClickNextPage: unref(nextPage),
            onClickPrevPage: unref(prevPage)
          }, createSlots({ _: 2 }, [
            _ctx.buttonsPagination ? {
              name: "buttonsPagination",
              fn: withCtx(() => [
                createVNode(ButtonsPagination, {
                  "current-pagination-number": unref(currentPaginationNumber),
                  "max-pagination-number": unref(maxPaginationNumber),
                  onUpdatePage: unref(updatePage)
                }, null, 8, ["current-pagination-number", "max-pagination-number", "onUpdatePage"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["is-first-page", "is-last-page", "onClickNextPage", "onClickPrevPage"]))
        ])) : createCommentVNode("", true)
      ], 2);
    };
  }
});
var DataTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-513716fe"]]);
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.createApp({}).component("Vue3EasyDataTable", DataTable);
}
export { DataTable as default };
