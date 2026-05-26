<template>
  <v-dialog v-model="internalOpen" max-width="420" persistent>
    <v-card rounded="lg" elevation="0" border>
      <v-card-text class="delete-dialog-body">
        <v-avatar color="error" variant="tonal" size="56" class="mb-4">
          <v-icon icon="mdi-trash-can-outline" size="28" />
        </v-avatar>
        <h3 class="delete-title">Delete Employee?</h3>
        <p class="delete-sub">
          You are about to delete
          <strong>{{ employeeName }}</strong>.
          This action cannot be undone.
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions class="dialog-actions">
        <v-btn variant="text" rounded="lg" @click="handleCancel">Cancel</v-btn>
        <v-spacer />
        <v-btn
          color="error"
          variant="flat"
          rounded="lg"
          prepend-icon="mdi-trash-can-outline"
          :loading="loading"
          @click="handleConfirm"
        >
          Yes, Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'EmployeeDeleteConfirmDialog',

  props: {
    modelValue: { type: Boolean, default: false },
    employee: { type: Object, default: null },
    loading: { type: Boolean, default: false },
  },

  emits: ['update:modelValue', 'confirmed'],

  computed: {
    internalOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },

    employeeName() {
      if (!this.employee) return ''
      return `${this.employee.firstName || ''} ${this.employee.lastName || ''}`.trim()
    },
  },

  methods: {
    handleCancel() {
      this.internalOpen = false
    },

    handleConfirm() {
      this.$emit('confirmed')
    },
  },
}
</script>

<style scoped>
.delete-dialog-body {
  padding: 28px 24px;
  text-align: center;
}
.delete-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 8px;
}
.delete-sub {
  color: rgba(0,0,0,0.52);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}
.dialog-actions {
  padding: 16px 20px;
}
</style>
