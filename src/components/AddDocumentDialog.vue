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
            <p class="dialog-header__title">{{ isEditMode ? 'Edit Task' : 'Add New Task' }}</p>
            <p class="dialog-header__sub">{{ isEditMode ? 'Update task details below' : 'Fill in the task details below' }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="handleClose" />
      </v-card-title>

      <v-divider />

      <!-- Form -->
      <v-card-text class="pa-6">
        <v-form ref="form" @submit.prevent="handleSubmit">
          <div class="field-group">
            <label class="field-label">Task Name</label>
            <v-text-field
              v-model="form.taskName"
              placeholder="e.g. Submit weekly report"
              prepend-inner-icon="mdi-clipboard-text-outline"
              :rules="[rules.required]"
              rounded="lg"
              hide-details="auto"
              class="mb-4"
            />
          </div>

          <div class="field-group">
            <label class="field-label">Status</label>
            <v-select
              v-model="form.status"
              :items="statusOptions"
              placeholder="Select status"
              prepend-inner-icon="mdi-progress-check"
              :rules="[rules.required]"
              rounded="lg"
              hide-details="auto"
              class="mb-4"
            />
          </div>

          <div class="field-group">
            <label class="field-label">Notes</label>
            <v-textarea
              v-model="form.notes"
              placeholder="Write notes or instructions..."
              prepend-inner-icon="mdi-note-text-outline"
              rows="3"
              rounded="lg"
              hide-details="auto"
              class="mb-4"
            />
          </div>

          <div class="field-group">
            <label class="field-label">Deadline Date</label>
            <v-text-field
              v-model="form.deadlineDate"
              type="date"
              prepend-inner-icon="mdi-calendar-outline"
              :rules="[rules.required]"
              rounded="lg"
              hide-details="auto"
              class="mb-4"
            />
          </div>

          <div class="field-group">
            <label class="field-label">Given By</label>
            <v-text-field
              v-model="form.givenBy"
              placeholder="Supervisor name"
              prepend-inner-icon="mdi-account-tie-outline"
              :rules="[rules.required]"
              rounded="lg"
              hide-details="auto"
              class="mb-4"
            />
          </div>

          <div class="signature-box">
            <label class="field-label">Supervisor Signature</label>

            <canvas
              ref="signatureCanvas"
              class="signature-canvas"
              width="420"
              height="160"
              @mousedown="startDrawing"
              @mousemove="drawSignature"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart.prevent="startDrawing"
              @touchmove.prevent="drawSignature"
              @touchend.prevent="stopDrawing"
            ></canvas>

            <v-btn
              variant="tonal"
              color="error"
              size="small"
              prepend-icon="mdi-eraser"
              class="mt-2"
              @click="clearSignature"
            >
              Clear Signature
            </v-btn>
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
import axios from '@/axios'
import constant from '@/constant'
import utils from '@/utils'

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
      drawing: false,
      statusOptions: ['completed', 'in progress', 'pending'],
      form: {
        taskName: '',
        status: 'pending',
        notes: '',
        deadlineDate: '',
        givenBy: '',
        signature: '',
      },
      rules: {
        required: v => !!String(v || '').trim() || 'This field is required.',
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
        this.form = {
          taskName: doc.taskName,
          status: doc.status,
          notes: doc.notes,
          deadlineDate: doc.deadlineDate,
          givenBy: doc.givenBy,
          signature: doc.signature || '',
        }
      } else {
        this.resetForm()
      }
    },
  },

  methods: {
    getCanvasPoint(event) {
      const canvas = this.$refs.signatureCanvas
      const rect = canvas.getBoundingClientRect()
      const source = event.touches ? event.touches[0] : event

      return {
        x: source.clientX - rect.left,
        y: source.clientY - rect.top,
      }
    },

    startDrawing(event) {
      this.drawing = true

      const canvas = this.$refs.signatureCanvas
      const ctx = canvas.getContext('2d')
      const point = this.getCanvasPoint(event)

      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
    },

    drawSignature(event) {
      if (!this.drawing) return

      const canvas = this.$refs.signatureCanvas
      const ctx = canvas.getContext('2d')
      const point = this.getCanvasPoint(event)

      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#0a303c'
      ctx.lineTo(point.x, point.y)
      ctx.stroke()

      this.form.signature = canvas.toDataURL('image/png')
    },

    stopDrawing() {
      this.drawing = false
    },

    clearSignature() {
      const canvas = this.$refs.signatureCanvas
      const ctx = canvas.getContext('2d')

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.form.signature = ''
    },

    async handleSubmit() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      this.submitting = true

      try {
        const payload = {
          task_name:     this.form.taskName.trim(),
          status:        this.form.status,
          notes:         this.form.notes.trim(),
          deadline_date: this.form.deadlineDate,
          given_by:      this.form.givenBy.trim(),
          signature:     this.form.signature,
        }

        if (this.isEditMode) {
          const response = await axios.post(
            utils._api(constant.update_document),
            {
              id: this.editDocument.id,
              ...payload,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )

          this.$emit('edited', response.data.data)
        } else {
          const response = await axios.post(
            utils._api(constant.add_document),
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization:  `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )

          this.$emit('added', response.data.data)
        }

        this.resetForm()
        this.internalOpen = false
      } catch (error) {
        console.error('Error saving document:', error)
      } finally {
        this.submitting = false
      }
    },

    handleClose() {
      this.resetForm()
      this.internalOpen = false
    },

    resetForm() {
      this.form = {
        taskName: '',
        status: 'pending',
        notes: '',
        deadlineDate: '',
        givenBy: '',
        signature: '',
      }

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
.dialog-header__sub { 
  font-size: 12px; 
  color: rgba(0,0,0,0.45); 
  margin: 0;
}
.field-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0,0,0,0.6);
  margin-bottom: 6px;
  font-family: 'DM Sans', sans-serif;
}
.dialog-actions { 
  padding: 16px 20px; 
}
.signature-box {
  margin-top: 8px;
}
.signature-canvas {
  display: block;
  width: 100%;
  max-width: 420px;
  height: 160px;
  border: 1px solid rgba(10, 48, 60, 0.18);
  border-radius: 8px;
  background: #ffffff;
  touch-action: none;
}
</style>
