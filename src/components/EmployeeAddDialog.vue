<template>
  <v-dialog v-model="internalOpen" max-width="560" persistent>
    <v-card rounded="lg" elevation="0" border>
      <v-card-title class="dialog-header">
        <div class="dialog-title">
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon icon="mdi-account-plus-outline" size="20" />
          </v-avatar>
          <div>
            <p class="dialog-heading">Add Employee</p>
            <p class="dialog-sub">Create a new employee record</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="handleClose" />
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form ref="addForm" @submit.prevent="addEmployee">
          <div class="two-column">
            <v-text-field
              v-model="form.firstName"
              label="First Name"
              prepend-inner-icon="mdi-account-outline"
              :rules="[rules.required, rules.name]"
              hide-details="auto"
              class="mb-3"
            />
            <v-text-field
              v-model="form.lastName"
              label="Last Name"
              prepend-inner-icon="mdi-account-outline"
              :rules="[rules.required, rules.name]"
              hide-details="auto"
              class="mb-3"
            />
          </div>
          <v-text-field
            v-model="form.email"
            label="Email"
            placeholder="employee@email.com"
            prepend-inner-icon="mdi-email-outline"
            :rules="[rules.required, rules.email]"
            hide-details="auto"
            class="mb-3"
          />
          <div class="two-column">
            <v-text-field
              v-model="form.position"
              label="Position"
              prepend-inner-icon="mdi-briefcase-outline"
              :rules="[rules.required]"
              hide-details="auto"
              class="mb-3"
            />
            <v-text-field
              v-model="form.salary"
              label="Salary"
              prepend-inner-icon="mdi-cash"
              :rules="[rules.required, rules.salary]"
              type="number"
              min="0"
              hide-details="auto"
              class="mb-3"
            />
          </div>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-actions class="dialog-actions">
        <v-btn variant="text" rounded="lg" prepend-icon="mdi-refresh" @click="resetForm">
          Clear
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          :loading="submitting"
          @click="addEmployee"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from '@/axios'
import constant from '@/constant'

const emptyEmployee = () => ({
  firstName: '',
  lastName:  '',
  email:     '',
  position:  '',
  salary:    '',
})

export default {
  name: 'EmployeeAddDialog',

  props: {
    modelValue: { type: Boolean, default: false },
  },

  emits: ['update:modelValue', 'added', 'error'],

  data() {
    return {
      submitting: false,
      form:       emptyEmployee(),
      rules: {
        required: v => !!String(v || '').trim() || 'This field is required.',
        name:     v => /^[A-Za-z\s'-]+$/.test(String(v || '')) || 'Use letters only.',
        email:    v => /.+@.+\..+/.test(String(v || '')) || 'Enter a valid email address.',
        salary:   v => Number(v) >= 0 || 'Salary must be 0 or higher.',
      },
    }
  },

  computed: {
    internalOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },

  methods: {
    async addEmployee() {
      const { valid } = await this.$refs.addForm.validate()
      if (!valid) return

      this.submitting = true

      try {
        const payload = {
          first_name: this.form.firstName.trim(),
          last_name:  this.form.lastName.trim(),
          email:      this.form.email.trim(),
          position:   this.form.position.trim(),
          salary:     Number(this.form.salary),
        }

        const response = await axios.post(
          constant.add_employee,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept:         'application/json',
              Authorization:  `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        this.$emit('added', response.data.data)
        this.resetForm()
        this.internalOpen = false
      } catch (error) {
        console.error('Error adding employee:', error)
        const message = error.response?.data?.message || 'Unable to add employee.'
        this.$emit('error', message)
      } finally {
        this.submitting = false
      }
    },

    handleClose() {
      this.resetForm()
      this.internalOpen = false
    },

    resetForm() {
      this.form = emptyEmployee()
      this.$refs.addForm?.reset()
    },
  },
}
</script>

<style scoped>
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
}
.dialog-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dialog-heading {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 3px;
}
.dialog-sub {
  color: rgba(0,0,0,0.48);
  font-size: 14px;
  margin: 0;
}
.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.dialog-actions {
  padding: 16px 20px;
}
@media (max-width: 640px) {
  .two-column {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
