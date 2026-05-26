<template>
  <v-dialog v-model="internalOpen" max-width="400" persistent>
    <v-card rounded="xl" elevation="0" border>

      <v-card-text class="pa-6 text-center">
        <v-avatar color="warning" variant="tonal" size="56" class="mb-4">
          <v-icon icon="mdi-logout" size="28" />
        </v-avatar>
        <h3 class="confirm-title">Sign Out?</h3>
        <p class="confirm-sub">
          Are you sure you want to log out of your account?
        </p>
      </v-card-text>

      <v-divider />

      <v-card-actions class="dialog-actions">
        <v-btn variant="text" rounded="lg" @click="internalOpen = false">
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          color="warning"
          variant="flat"
          rounded="lg"
          prepend-icon="mdi-logout"
          :loading="loading"
          @click="handleLogout"
        >
          Yes, Log Out
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LogoutConfirmDialog',

  props: {
    modelValue: { type: Boolean, default: false },
  },

  emits: ['update:modelValue', 'confirmed'],

  data() {
    return { loading: false }
  },

  computed: {
    internalOpen: {
      get() { return this.modelValue },
      set(val) { this.$emit('update:modelValue', val) },
    },
  },

  methods: {
    async handleLogout() {
      this.loading = true
      await new Promise(r => setTimeout(r, 600))
      this.loading = false
      this.internalOpen = false
      this.$emit('confirmed')
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