<template>
  <v-text-field
    :model-value="modelValue"
    :placeholder="`Search ${selectedFilter.label}...`"
    prepend-inner-icon="mdi-magnify"
    clearable
    hide-details
    density="compact"
    rounded="lg"
    class="search-filter-field"
    @update:model-value="$emit('update:modelValue', $event || '')"
  >
    <template #append-inner>
      <v-menu location="bottom end">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            size="small"
            density="compact"
            append-icon="mdi-chevron-down"
            class="filter-button"
          >
            {{ selectedFilter.label }}
          </v-btn>
        </template>
        <v-list density="compact" nav class="filter-menu">
          <v-list-item
            v-for="filter in filters"
            :key="filter.value"
            :active="filter.value === selectedFilterValue"
            color="primary"
            rounded="lg"
            @click="$emit('update:selectedFilterValue', filter.value)"
          >
            <template #prepend>
              <v-icon :icon="filter.icon" size="18" />
            </template>
            <v-list-item-title>{{ filter.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'SearchFilterField',

  props: {
    modelValue: { type: String, default: '' },
    selectedFilterValue: { type: String, required: true },
    filters: { type: Array, required: true },
  },

  emits: ['update:modelValue', 'update:selectedFilterValue'],

  computed: {
    selectedFilter() {
      return this.filters.find(filter => filter.value === this.selectedFilterValue) || this.filters[0]
    },
  },
}
</script>

<style scoped>
.search-filter-field {
  max-width: 360px;
}
.filter-button {
  min-width: 108px;
  text-transform: none;
  letter-spacing: 0;
}
.filter-menu {
  min-width: 180px;
}
@media (max-width: 980px) {
  .search-filter-field {
    max-width: none;
    width: 100%;
  }
}
</style>
