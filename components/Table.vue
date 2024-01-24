<script setup>
import { ref } from "vue";

const props = defineProps({
  data: Array,
  columns: Array,
});

import {
  useVueTable,
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/vue-table";
const sorting = ref([]);
const filter = ref("");

const table = useVueTable({
  get data() {
    return props.data;
  },
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  state: {
    get sorting() {
      return sorting.value;
    },
    get globalFilter() {
      return filter.value;
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting.value)
        : updaterOrValue;
  },
});
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
              >
                <th
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  :class="{
                    'cursor-pointer select-none': header.column.getCanSort(),
                  }"
                  @click="header.column.getToggleSortingHandler()?.($event)"
                >
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  {{ { asc: " ↑", desc: "↓" }[header.column.getIsSorted()] }}
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-for="row in table.getRowModel().rows" :key="row.id">
                <td
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-8">
        Página {{ table.getState().pagination.pageIndex + 1 }} de
        {{ table.getPageCount() }} -
        {{ table.getFilteredRowModel().rows.length }} resultados
      </div>

      <!-- Pagination -->

      <div class="mt-8 flex items-center space-x-4">
        <!-- Page Size Dropdown -->
        <select
          class="border border-gray-300 rounded px-2 py-2"
          @change="table.setPageSize($event.target.value)"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>

        <!-- Pagination Icons -->
        <button
          class="border border-gray-300 rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="table.setPageIndex(0)"
          :disabled="!table.getCanPreviousPage()"
        >
          ⮄
        </button>
        <button
          class="border border-gray-300 rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="table.previousPage()"
          :disabled="!table.getCanPreviousPage()"
        >
          ⮜
        </button>
        <button
          class="border border-gray-300 rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="table.nextPage()"
          :disabled="!table.getCanNextPage()"
        >
          ➤
        </button>
        <button
          class="border border-gray-300 rounded p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="table.setPageIndex(table.getPageCount() - 1)"
          :disabled="!table.getCanNextPage()"
        >
          ⮆
        </button>
      </div>
    </div>
  </div>
</template>
