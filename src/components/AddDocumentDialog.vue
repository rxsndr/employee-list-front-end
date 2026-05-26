<template>
  <v-dialog v-model="internalOpen" max-width="480" persistent>
    <v-card rounded="xl" elevation="0" border>

      <!-- Header -->
      <v-card-title class="dialog-header">
        <div class="dialog-header__left">
          <v-avatar :color="isEditMode ? 'warning' : 'primary'" variant="tonal" size="40">
            <v-icon :icon="isEditMode ? 'mdi-pencil-outline' : 'mdi-account-plus-outline'" size="20" />
          </v-avatar>
          <div>
            <p class="dialog-header__title">{{ isEditMode ? 'Edit Record' : 'Add New Record' }}</p>
            <p class="dialog-header__sub">{{ isEditMode ? 'Update the details below' : "Fill in the person's details below" }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="handleClose" />
      </v-card-title>

      <v-divider />

      <!-- Form -->
      <v-card-text class="pa-6">
        <v-form ref="form" @submit.prevent="handleSubmit">
          <div class="field-group">
            <label class="field-label">Full Name</label>
            <v-text-field
              v-model="form.name"
              placeholder="e.g. Juan dela Cruz"
              prepend-inner-icon="mdi-account-outline"
              :rules="[rules.required, rules.noNumbers]"
              rounded="lg"
              hide-details="auto"
              class="mb-4"
              @keypress="blockNumbers"
            />
          </div>
          <div class="field-group">
            <label class="field-label">Age</label>
            <v-text-field
              v-model="form.age"
              placeholder="e.g. 25"
              prepend-inner-icon="mdi-calendar-outline"
              :rules="[rules.required, rules.age]"
              type="number"
              min="1"
              max="120"
              rounded="lg"
              hide-details="auto"
              class="mb-4"
            />
          </div>
          <div class="field-group">
            <label class="field-label">Address</label>
            <v-text-field
              v-model="form.address"
              placeholder="e.g. 123 Rizal St., Makati City"
              prepend-inner-icon="mdi-map-marker-outline"
              :rules="[rules.required]"
              rounded="lg"
              hide-details="auto"
            />
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="dialog-actions">
        <v-btn variant="text" rounded="lg" color="default" prepend-icon="mdi-close" @click="handleClose">
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          :color="isEditMode ? 'warning' : 'primary'"
          variant="flat"
          rounded="lg"
          :prepend-icon="isEditMode ? 'mdi-content-save-outline' : 'mdi-check'"
          :loading="submitting"
          @click="handleSubmit"
        >
          {{ isEditMode ? 'Save Changes' : 'Submit' }}
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import { documentStore } from '../plugins/store.js'

export default {
  name: 'AddDocumentDialog',

  props: {
    modelValue:   { type: Boolean, default: false },
    editDocument: { type: Object,  default: null  },
  },

  emits: ['update:modelValue', 'added', 'edited'],

  data() {
    return {
      submitting: false,
      form: { name: '', age: '', address: '' },
      rules: {
        required: v => !!v || 'This field is required.',
        age: v => (v > 0 && v <= 120) || 'Enter a valid age (1–120).',
        noNumbers: v => !/\d/.test(v) || 'Name must not contain numbers.',
      },
    }
  },

  computed: {
    internalOpen: {
      get() { return this.modelValue },
      set(val) { this.$emit('update:modelValue', val) },
    },
    isEditMode() { return !!this.editDocument },
  },

  watch: {
    editDocument(doc) {
      if (doc) {
        this.form = { name: doc.name, age: String(doc.age), address: doc.address }
      } else {
        this.resetForm()
      }
    },
  },

  methods: {
    blockNumbers(e) {
      if (/\d/.test(e.key)) e.preventDefault()
    },

    async handleSubmit() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.submitting = true
      await new Promise(r => setTimeout(r, 400))

      if (this.isEditMode) {
        documentStore.updateDocument(this.editDocument.id, this.form)
        this.$emit('edited')
      } else {
        documentStore.addDocument(this.form)
        this.$emit('added')
      }

      this.submitting = false
      this.resetForm()
      this.internalOpen = false
    },

    handleClose() {
      this.resetForm()
      this.internalOpen = false
    },

    resetForm() {
      this.form = { name: '', age: '', address: '' }
      this.$refs.form?.reset()
    },
  },
}
</script>

<style scoped>
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
}
.dialog-header__left { display: flex; align-items: center; gap: 12px; }
.dialog-header__title {
  font-size: 15px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  margin: 0;
  line-height: 1.3;
}
.dialog-header__sub { font-size: 12px; color: rgba(0,0,0,0.45); margin: 0; }
.field-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0,0,0,0.6);
  margin-bottom: 6px;
  font-family: 'DM Sans', sans-serif;
}
.dialog-actions { padding: 16px 20px; }
</style>