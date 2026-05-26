<template>
  <v-dialog v-model="internalOpen" max-width="420" persistent>
    <v-card rounded="xl" elevation="0" border>

      <!-- Header -->
      <v-card-text class="pa-6 text-center">
        <v-avatar color="error" variant="tonal" size="56" class="mb-4">
          <v-icon icon="mdi-trash-can-outline" size="28" />
        </v-avatar>
        <h3 class="confirm-title">Delete Record?</h3>
        <p class="confirm-sub">
          You are about to delete
          <strong>{{ document ? document.name : '' }}</strong>.
          This action cannot be undone.
        </p>
      </v-card-text>

      <v-divider />

      <v-card-actions class="dialog-actions">
        <v-btn
          variant="text"
          rounded="lg"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          color="error"
          variant="flat"
          rounded="lg"
          prepend-icon="mdi-trash-can-outline"
          :loading="deleting"
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
  name: 'DeleteConfirmDialog',

  props: {
    modelValue: { type: Boolean, default: false },
    document:   { type: Object,  default: null  },
  },

  emits: ['update:modelValue', 'confirmed'],

  data() {
    return { deleting: false }
  },

  computed: {
    internalOpen: {
      get() { return this.modelValue },
      set(val) { this.$emit('update:modelValue', val) },
    },
  },

  methods: {
    async handleConfirm() {
      this.deleting = true
      await new Promise(r => setTimeout(r, 400))
      this.$emit('confirmed', this.document)
      this.deleting = false
      this.internalOpen = false
    },

    handleCancel() {
      this.internalOpen = false
    },
  },
}
</script>

<style scoped>
.confirm-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 8px;
  font-family: 'DM Sans', sans-serif;
}
.confirm-sub {
  font-size: 14px;
  color: rgba(0,0,0,0.5);
  margin: 0;
  line-height: 1.6;
}
.dialog-actions { padding: 16px 20px; }
</style>