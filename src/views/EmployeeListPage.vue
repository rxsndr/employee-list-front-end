<template>
  <div class="employees app-page">
    <div class="page-header hero-panel">
      <div>
        <p class="page-eyebrow">Team</p>
        <h1 class="page-title">Employee List</h1>
        <p class="page-sub">Create, search, update, and remove employee records</p>
      </div>
      <div class="page-actions">
        <v-chip color="primary" variant="tonal" prepend-icon="mdi-account-group-outline">
          {{ employeeTotal }} {{ employeeTotal === 1 ? 'employee' : 'employees' }}
        </v-chip>
        <v-btn color="blue-grey-darken-4" variant="flat" rounded="lg" prepend-icon="mdi-plus" @click="addDialog = true">
          Add Employee
        </v-btn>
      </div>
    </div>

    <v-card rounded="lg" elevation="1" class="table-card">
        <div class="table-toolbar">
          <div>
            <p class="card-heading">Employee List Table</p>
            <p class="card-sub">Search by {{ selectedSearchFilter.label }}</p>
          </div>
          <SearchFilterField
            v-model="searchEmployeeId"
            v-model:selected-filter-value="selectedSearchFilterValue"
            :filters="searchFilters"
          />
        </div>
        <v-divider />

        <div v-if="loadingEmployees" class="table-skeleton">
          <v-skeleton-loader type="table" />
        </div>

        <div v-else-if="employeeTotal === 0" class="empty-state">
          <v-icon icon="mdi-account-search-outline" size="56" color="grey-lighten-1" class="mb-3" />
          <p class="empty-title">No employees yet</p>
          <p class="empty-sub">Click Add Employee to create the first record.</p>
        </div>

        <div v-else-if="filteredEmployees.length === 0" class="empty-state">
          <v-icon icon="mdi-text-search" size="48" color="grey-lighten-1" class="mb-3" />
          <p class="empty-sub">No employee matches "{{ searchEmployeeId }}".</p>
        </div>

        <v-table v-else density="comfortable" fixed-header height="440">
          <thead>
            <tr>
              <th class="table-th">Employee ID</th>
              <th class="table-th">Name</th>
              <th class="table-th">Email</th>
              <th class="table-th">Position</th>
              <th class="table-th">Salary</th>
              <th class="table-th">Date Added</th>
              <th class="table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in filteredEmployees" :key="employee.id" class="table-row">
              <td class="table-td">
                <v-chip size="small" color="primary" variant="tonal">{{ employee.employeeId }}</v-chip>
              </td>
              <td class="table-td">
                <div class="employee-name">
                  <v-avatar color="primary" variant="tonal" size="34">
                    <v-img v-if="employee.avatarUrl" :src="employee.avatarUrl" cover />
                    <span v-else class="avatar-text">{{ initials(employee) }}</span>
                  </v-avatar>
                  <span>{{ employee.firstName }} {{ employee.lastName }}</span>
                </div>
              </td>
              <td class="table-td">{{ employee.email }}</td>
              <td class="table-td">{{ employee.position }}</td>
              <td class="table-td">{{ formatSalary(employee.salary) }}</td>
              <td class="table-td">
                <v-chip size="x-small" variant="tonal">{{ employee.createdAt }}</v-chip>
              </td>
              <td class="table-td actions-cell">
                <v-btn
                  icon="mdi-pencil-outline"
                  size="small"
                  variant="tonal"
                  color="warning"
                  class="mr-1"
                  aria-label="Update employee"
                  @click="openUpdateDialog(employee)"
                />
                <v-btn
                  icon="mdi-trash-can-outline"
                  size="small"
                  variant="tonal"
                  color="error"
                  aria-label="Delete employee"
                  @click="openDeleteDialog(employee)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
    </v-card>

    <v-dialog v-model="updateDialog" max-width="560" persistent>
      <v-card rounded="lg" elevation="0" border>
        <v-card-title class="dialog-header">
          <div class="dialog-title">
            <v-avatar color="warning" variant="tonal" size="40">
              <v-icon icon="mdi-pencil-outline" size="20" />
            </v-avatar>
            <div>
              <p class="dialog-heading">Update Employee Dialog</p>
              <p class="dialog-sub">Edit employee details below</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="closeUpdateDialog" />
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-form ref="updateForm" @submit.prevent="updateEmployee">
            <v-text-field
              v-model="editForm.employeeId"
              label="Employee ID"
              prepend-inner-icon="mdi-badge-account-outline"
              readonly
              variant="filled"
              hide-details="auto"
              class="mb-3"
            />
            <div class="two-column">
              <v-text-field
                v-model="editForm.firstName"
                label="First Name"
                prepend-inner-icon="mdi-account-outline"
                :rules="[rules.required, rules.name]"
                hide-details="auto"
                class="mb-3"
              />
              <v-text-field
                v-model="editForm.lastName"
                label="Last Name"
                prepend-inner-icon="mdi-account-outline"
                :rules="[rules.required, rules.name]"
                hide-details="auto"
                class="mb-3"
              />
            </div>
            <v-text-field
              v-model="editForm.email"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              :rules="[rules.required, rules.email]"
              hide-details="auto"
              class="mb-3"
            />
            <div class="two-column">
              <v-text-field
                v-model="editForm.position"
                label="Position"
                prepend-inner-icon="mdi-briefcase-outline"
                :rules="[rules.required]"
                hide-details="auto"
                class="mb-3"
              />
              <v-text-field
                v-model="editForm.salary"
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
          <v-btn variant="text" rounded="lg" @click="closeUpdateDialog">Cancel</v-btn>
          <v-spacer />
          <v-btn color="warning" variant="flat" rounded="lg" prepend-icon="mdi-content-save-outline" @click="updateEmployee">
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <EmployeeAddDialog
      v-model="addDialog"
      @added="handleEmployeeAdded"
      @error="message => showSnackbar(message, 'error', 'mdi-alert-circle')"
    />

    <EmployeeDeleteConfirmDialog
      v-model="deleteDialog"
      :employee="employeeToDelete"
      :loading="deletingEmployee"
      @confirmed="confirmDeleteEmployee"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2600" rounded="lg" location="top right">
      <v-icon :icon="snackbar.icon" class="mr-2" />
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from '@/axios'
import utils from '@/utils'
import constant from '@/constant'

import EmployeeAddDialog from '@/components/EmployeeAddDialog.vue'
import EmployeeDeleteConfirmDialog from '@/components/EmployeeDeleteConfirmDialog.vue'
import SearchFilterField from '@/components/SearchFilterField.vue'

const emptyEmployee = () => ({
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  position: '',
  salary: '',
})

export default {
  name: 'EmployeeListPage',

  components: {
    EmployeeAddDialog,
    EmployeeDeleteConfirmDialog,
    SearchFilterField,
  },

  data() {
    return {
      employees: [],
      profilePictures: {},
      loadingEmployees: true,
      editForm: emptyEmployee(),
      selectedEmployee: null,
      addDialog: false,
      searchEmployeeId: '',
      selectedSearchFilterValue: 'name',
      employeeToDelete: null,
      deleteDialog: false,
      deletingEmployee: false,
      searchFilters: [
        { label: 'Name', value: 'name', icon: 'mdi-account-outline' },
        { label: 'Email', value: 'email', icon: 'mdi-email-outline' },
        { label: 'Position', value: 'position', icon: 'mdi-briefcase-outline' },
        { label: 'Employee ID', value: 'employeeId', icon: 'mdi-badge-account-outline' },
      ],
      updateDialog: false,
      snackbar: {
        show: false,
        message: '',
        color: 'success',
        icon: 'mdi-check-circle',
      },
      rules: {
        required: v => !!String(v || '').trim() || 'This field is required.',
        name: v => /^[A-Za-z\s'-]+$/.test(String(v || '')) || 'Use letters only.',
        email: v => /.+@.+\..+/.test(String(v || '')) || 'Enter a valid email address.',
        salary: v => Number(v) >= 0 || 'Salary must be 0 or higher.',
      },
    }
  },

  computed: {
    employeeTotal() {
      return this.employees.length
    },

    selectedSearchFilter() {
      return this.searchFilters.find(filter => filter.value === this.selectedSearchFilterValue) || this.searchFilters[0]
    },

    filteredEmployees() {
      const q = String(this.searchEmployeeId || '').trim().toLowerCase()
      const field = this.selectedSearchFilterValue
      const employees = q
        ? this.employees.filter(employee =>
            this.searchValue(employee, field).toLowerCase().includes(q)
          )
        : [...this.employees]

      return employees.sort((a, b) =>
        this.searchValue(a, field).localeCompare(this.searchValue(b, field), undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      )
    },
  },

  async mounted() {
    await this.fetchProfilePictures()
    await this.fetchEmployees()
  },

  methods: {
    async fetchProfilePictures() {
      try {
        const response = await axios.get(
          utils._api(constant.get_profile_pictures),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        const pictures = response.data?.data || []
        this.profilePictures = pictures.reduce((lookup, picture) => {
          lookup[this.emailKey(picture.user_email)] = picture.url
          return lookup
        }, {})
      } catch (error) {
        console.error('Error fetching profile pictures:', error)
      }
    },

    async fetchEmployees() {
      this.loadingEmployees = true

      try {
        const response = await axios.post(
          utils._api(constant.get_employees),
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              Accept:         'application/json',
              Authorization:  `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        const employees = response.data?.data || response.data
        this.employees = employees.map(employee => this.mapApiEmployee(employee))
      } catch (error) {
        console.error('Error fetching employees:', error)
        const message = error.response?.data?.message || 'Unable to load employees.'
        this.showSnackbar(message, 'error', 'mdi-alert-circle')
      } finally {
        this.loadingEmployees = false
      }
    },

    searchValue(employee, field) {
      if (field === 'name') {
        return `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
      }
      return String(employee[field] || '')
    },

    handleEmployeeAdded(apiEmployee) {
      const employee = this.mapApiEmployee(apiEmployee)
      this.employees.push(employee)
      this.showSnackbar(`Employee added with ID ${employee.employeeId}.`, 'success', 'mdi-check-circle')
    },

    openUpdateDialog(employee) {
      this.selectedEmployee = employee
      this.editForm = {
        employeeId: employee.employeeId,
        firstName:  employee.firstName,
        lastName:   employee.lastName,
        email:      employee.email,
        avatarUrl:  this.profilePictures[employee.email] || '',
        position:   employee.position,
        salary:     String(employee.salary),
      }
      this.updateDialog = true
    },

    async updateEmployee() {
      const { valid } = await this.$refs.updateForm.validate()
      if (!valid || !this.selectedEmployee) return

      try {
        const payload = {
          id:          this.selectedEmployee.id,
          employee_id: this.selectedEmployee.employeeId,
          first_name:  this.editForm.firstName.trim(),
          last_name:   this.editForm.lastName.trim(),
          email:       this.editForm.email.trim(),
          position:    this.editForm.position.trim(),
          salary:      Number(this.editForm.salary),
        }

        const response = await axios.post(
          utils._api(constant.update_employee),
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        const updatedEmployee = response.data.data
          ? this.mapApiEmployee(response.data.data)
          : {
              ...this.selectedEmployee,
              firstName: this.editForm.firstName.trim(),
              lastName:  this.editForm.lastName.trim(),
              email:     this.editForm.email.trim(),
              position:  this.editForm.position.trim(),
              salary:    Number(this.editForm.salary),
            }

        const index = this.employees.findIndex(employee => employee.id === this.selectedEmployee.id)
        if (index !== -1) this.employees[index] = updatedEmployee

        this.showSnackbar(
          response.data.message || 'Employee updated successfully.',
          'success',
          'mdi-check-circle'
        )
        this.closeUpdateDialog()
      } catch (error) {
        console.error('Error updating employee:', error)
        const message = error.response?.data?.message || 'Unable to update employee.'
        this.showSnackbar(message, 'error', 'mdi-alert-circle')
      }
    },

    async deleteEmployee(employee) {
      try {
        const response = await axios.post(
          utils._api(constant.delete_employee),
          { employeeId: employee.employeeId },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization:  `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        const index = this.employees.findIndex(item => item.id === employee.id)
        if (index !== -1) this.employees.splice(index, 1)

        this.showSnackbar(
          response.data.message || `${employee.employeeId} deleted.`,
          'success',
          'mdi-check-circle'
        )
      } catch (error) {
        console.error('Error deleting employee:', error)
        const message = error.response?.data?.message || 'Unable to delete employee.'
        this.showSnackbar(message, 'error', 'mdi-alert-circle')
      }
    },

    openDeleteDialog(employee) {
      this.employeeToDelete = employee
      this.deleteDialog = true
    },

    closeDeleteDialog() {
      this.deleteDialog = false
      this.employeeToDelete = null
      this.deletingEmployee = false
    },

    async confirmDeleteEmployee() {
      if (!this.employeeToDelete) return
      this.deletingEmployee = true
      await this.deleteEmployee(this.employeeToDelete)
      this.closeDeleteDialog()
    },

    closeUpdateDialog() {
      this.updateDialog = false
      this.selectedEmployee = null
      this.editForm = emptyEmployee()
      this.$refs.updateForm?.resetValidation()
    },

    initials(employee) {
      return `${employee.firstName[0] || ''}${employee.lastName[0] || ''}`.toUpperCase()
    },

    formatSalary(value) {
      return Number(value).toLocaleString('en-PH', {
        style:    'currency',
        currency: 'PHP',
      })
    },

    mapApiEmployee(employee) {
      return {
        id:         employee.id,
        employeeId: employee.employee_id,
        firstName:  employee.first_name,
        lastName:   employee.last_name,
        email:      employee.email,
        avatarUrl:  this.profilePictures[this.emailKey(employee.email)] || '',
        position:   employee.position,
        salary:     Number(employee.salary),
        createdAt:  new Date(employee.created_at).toLocaleDateString('en-PH', {
          year:  'numeric',
          month: 'short',
          day:   'numeric',
        }),
      }
    },

    emailKey(email) {
      return String(email || '').trim().toLowerCase()
    },

    showSnackbar(message, color, icon) {
      this.snackbar = { show: true, message, color, icon }
    },
  },
}
</script>

<style scoped>
.employees {
  padding: 30px;
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  color: #0a303c;
}
.hero-panel {
  padding: 28px;
  background: #ffffff;
  border: 1px solid rgba(10,48,60,0.08);
  border-radius: 12px;
  box-shadow: 0 14px 34px rgba(10,48,60,0.07);
}
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.page-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.page-title {
  color: #0a303c;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 8px;
}
.page-eyebrow {
  color: #598392;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.6px;
  margin: 0 0 8px;
  text-transform: uppercase;
}
.page-sub,
.card-sub,
.dialog-sub,
.empty-sub {
  font-size: 15px;
  color: rgba(0,0,0,0.6);
  margin: 0;
}
.table-card {
  overflow: hidden;
  border: 1px solid rgba(10,48,60,0.08);
}
.table-toolbar,
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.two-column {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.table-toolbar {
  padding: 18px 20px;
  flex-wrap: wrap;
}
.card-heading,
.dialog-heading,
.empty-title {
  color: #0a303c;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 3px;
}
.table-th {
  font-size: 12px !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  color: #344a53 !important;
  padding: 12px 16px !important;
  white-space: nowrap;
}
.table-td {
  color: rgba(0,0,0,0.72);
  font-size: 14px;
  padding: 12px 16px !important;
  white-space: nowrap;
}
.table-row:hover td {
  background: rgba(89,131,146,0.08);
}
.employee-name,
.dialog-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar-text {
  font-size: 12px;
  font-weight: 700;
}
.actions-cell {
  width: 108px;
}
.empty-state {
  background: #ffffff;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 36px 24px;
}
.dialog-header {
  padding: 18px 20px;
}
.dialog-actions {
  padding: 16px 20px;
}
.table-skeleton {
  padding: 16px;
}
@media (max-width: 640px) {
  .employees {
    padding: 20px;
  }
  .hero-panel { padding: 22px; }
  .page-title { font-size: 28px; }
  .page-header,
  .page-actions {
    align-items: stretch;
    flex-direction: column;
  }
  .two-column {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
