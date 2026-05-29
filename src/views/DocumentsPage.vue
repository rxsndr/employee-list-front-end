<template>
  <div class="documents app-page">

    <!-- Header -->
    <div class="page-header hero-panel">
      <div>
        <p class="page-eyebrow">Records</p>
        <h1 class="page-title">Documents</h1>
        <p class="page-sub">Manage all your records here</p>
      </div>
      <v-btn
        v-if="!isAdmin"
        color="blue-grey-darken-4"
        variant="flat"
        rounded="lg"
        size="large"
        prepend-icon="mdi-plus"
        @click="openAddDialog"
      >
        Add File
      </v-btn>
    </div>

    <!-- Summary Bar + Search -->
    <div class="toolbar-bar">
      <v-chip color="primary" variant="tonal" size="small" prepend-icon="mdi-file-multiple-outline">
        <template v-if="isAdmin">
          {{ employeeTotal }} {{ employeeTotal === 1 ? 'employee' : 'employees' }}
        </template>
        <template v-else>
          {{ documentTotal }} {{ documentTotal === 1 ? 'document' : 'documents' }} total
        </template>
      </v-chip>

      <SearchFilterField
        v-model="search"
        v-model:selected-filter-value="selectedSearchFilterValue"
        :filters="activeSearchFilters"
        @update:modelValue="currentPage = 1"
      />
    </div>

    <!-- Loading Skeleton -->
    <v-card v-if="loadingDocuments || (isAdmin && loadingEmployees)" rounded="lg" elevation="1" class="table-card table-skeleton-card">
      <div class="skeleton-header">
        <v-skeleton-loader type="chip" />
        <v-skeleton-loader type="button" />
      </div>

      <v-skeleton-loader
        type="table"
        class="document-table-skeleton"
      />
    </v-card>

    <!-- Admin employee cards -->
    <div v-else-if="isAdmin" class="employee-document-grid">
      <div v-if="filteredEmployeeCards.length === 0" class="empty-state">
        <v-icon icon="mdi-account-search-outline" size="56" color="grey-lighten-1" class="mb-3" />
        <h3 class="empty-state__title">No employees found</h3>
        <p class="empty-state__sub">Try another employee name, email, or position.</p>
      </div>

      <template v-else>
        <v-card
          v-for="employee in filteredEmployeeCards"
          :key="employee.id"
          rounded="lg"
          elevation="1"
          class="employee-document-card"
          @click="openEmployeeDocuments(employee)"
        >
          <v-card-text class="employee-document-card__body">
            <v-avatar color="primary" variant="tonal" size="46">
              <v-img v-if="employee.avatarUrl" :src="employee.avatarUrl" cover />
              <span v-else class="employee-document-card__initials">{{ employeeInitials(employee) }}</span>
            </v-avatar>
            <div class="employee-document-card__main">
              <p class="employee-document-card__name">{{ employee.firstName }} {{ employee.lastName }}</p>
              <p class="employee-document-card__meta">{{ employee.email }}</p>
              <p class="employee-document-card__meta">{{ employee.position }}</p>
            </div>
            <v-chip color="primary" variant="tonal" size="small">
              {{ documentCountForEmployee(employee) }}
            </v-chip>
          </v-card-text>
        </v-card>
      </template>
    </div>

    <!-- Empty State (no docs at all) -->
    <div v-else-if="documentTotal === 0" class="empty-state">
      <v-icon icon="mdi-folder-open-outline" size="64" color="grey-lighten-1" class="mb-4" />
      <h3 class="empty-state__title">No documents yet</h3>
      <p class="empty-state__sub">Click "Add File" to create your first record.</p>
      <v-btn color="primary" variant="flat" rounded="lg" prepend-icon="mdi-plus" class="mt-4" @click="openAddDialog">
        Add File
      </v-btn>
    </div>

    <!-- Table -->
    <v-card v-else rounded="lg" elevation="1" class="table-card">

      <!-- No search results -->
      <div v-if="filteredDocs.length === 0" class="empty-state" style="padding: 48px 24px;">
        <v-icon icon="mdi-text-search" size="48" color="grey-lighten-1" class="mb-3" />
        <p class="empty-state__sub">No records match "<strong>{{ search }}</strong>".</p>
      </div>

      <template v-else>
        <DocumentTable
          :documents="pagedDocs"
          :start-index="(currentPage - 1) * perPage"
          show-actions
          @edit="openEditDialog"
          @delete="openDeleteDialog"
        />

        <!-- Pagination -->
        <div class="pagination-bar">
          <span class="pagination-info">
            Showing {{ (currentPage - 1) * perPage + 1 }}-{{ Math.min(currentPage * perPage, filteredDocs.length) }} of {{ filteredDocs.length }}
          </span>
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            density="compact"
            rounded="lg"
            size="small"
          />
        </div>
      </template>
    </v-card>

    <!-- Add / Edit Dialog -->
    <AddDocumentDialog
      v-model="dialogOpen"
      :edit-document="selectedDocument"
      @added="onAdded"
      @edited="onEdited"
    />

    <!-- Delete Confirm Dialog -->
    <DeleteConfirmDialog
      v-model="deleteDialogOpen"
      :document="docToDelete"
      @confirmed="onDeleteConfirmed"
    />

    <v-dialog v-model="employeeDocumentsDialog" max-width="1100">
      <v-card rounded="lg" elevation="0" border>
        <v-card-title class="employee-dialog-header">
          <div class="employee-dialog-title">
            <v-avatar color="primary" variant="tonal" size="44">
              <v-img v-if="selectedEmployee?.avatarUrl" :src="selectedEmployee.avatarUrl" cover />
              <span v-else class="employee-document-card__initials">{{ selectedEmployee ? employeeInitials(selectedEmployee) : '' }}</span>
            </v-avatar>
            <div>
              <p class="employee-dialog-heading">{{ selectedEmployeeName }}</p>
              <p class="employee-dialog-sub">{{ selectedEmployee?.email }}</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="closeEmployeeDocuments" />
        </v-card-title>
        <v-divider />

        <div v-if="selectedEmployeeDocuments.length === 0" class="empty-state employee-dialog-empty">
          <v-icon icon="mdi-file-document-outline" size="48" color="grey-lighten-1" class="mb-3" />
          <p class="empty-state__sub">No documents stored for this employee.</p>
        </div>

        <DocumentTable v-else :documents="selectedEmployeeDocuments" />
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      rounded="lg"
      timeout="3000"
      location="top right"
    >
      <v-icon :icon="snackbar.icon" class="mr-2" />
      {{ snackbar.message }}
    </v-snackbar>

  </div>
</template>

<script>
import axios from '@/axios'
import constant from '@/constant'
import utils from '@/utils'

import AddDocumentDialog from '../components/AddDocumentDialog.vue'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.vue'
import DocumentTable from '../components/DocumentTable.vue'
import SearchFilterField from '../components/SearchFilterField.vue'

export default {
  name: 'DocumentsPage',

  components: { AddDocumentDialog, DeleteConfirmDialog, DocumentTable, SearchFilterField },

  data() {
    return {
      documents: [],
      employees: [],
      profilePictures: {},
      loadingDocuments: false,
      loadingEmployees: false,
      dialogOpen: false,
      selectedDocument: null,
      selectedEmployee: null,
      employeeDocumentsDialog: false,
      deleteDialogOpen: false,
      docToDelete: null,
      search: '',
      selectedSearchFilterValue: localStorage.getItem('role') === 'admin' ? 'name' : 'taskName',
      documentSearchFilters: [
        { label: 'Task Name', value: 'taskName', icon: 'mdi-clipboard-text-outline' },
        { label: 'Status', value: 'status', icon: 'mdi-progress-check' },
        { label: 'Notes', value: 'notes', icon: 'mdi-note-text-outline' },
        { label: 'Deadline', value: 'deadlineDate', icon: 'mdi-calendar-outline' },
        { label: 'Given By', value: 'givenBy', icon: 'mdi-account-tie-outline' },
      ],
      employeeSearchFilters: [
        { label: 'Name', value: 'name', icon: 'mdi-account-outline' },
        { label: 'Email', value: 'email', icon: 'mdi-email-outline' },
        { label: 'Position', value: 'position', icon: 'mdi-briefcase-outline' },
        { label: 'Employee ID', value: 'employeeId', icon: 'mdi-badge-account-outline' },
      ],
      currentPage: 1,
      perPage: 7,
      snackbar: {
        show: false,
        message: '',
        color: 'success',
        icon: 'mdi-check-circle',
      },
    }
  },

  computed: {
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    },

    documentTotal() {
      return this.documents.length
    },

    employeeTotal() {
      return this.employees.length
    },

    activeSearchFilters() {
      return this.isAdmin ? this.employeeSearchFilters : this.documentSearchFilters
    },

    filteredEmployeeCards() {
      if (!this.search) return this.employees

      const q = this.search.toLowerCase()
      const field = this.selectedSearchFilterValue

      return this.employees.filter(employee =>
        this.employeeSearchValue(employee, field).toLowerCase().includes(q)
      )
    },

    selectedEmployeeDocuments() {
      if (!this.selectedEmployee) return []

      return this.documents.filter(document =>
        document.ownerEmail === this.selectedEmployee.email
      )
    },

    selectedEmployeeName() {
      if (!this.selectedEmployee) return ''
      return `${this.selectedEmployee.firstName} ${this.selectedEmployee.lastName}`.trim()
    },

    filteredDocs() {
      if (!this.search) return this.documents

      const q = this.search.toLowerCase()
      const field = this.selectedSearchFilterValue

      return this.documents.filter(d =>
        String(d[field] || '').toLowerCase().includes(q)
      )
    },

    totalPages() {
      return Math.ceil(this.filteredDocs.length / this.perPage) || 1
    },

    pagedDocs() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredDocs.slice(start, start + this.perPage)
    },
  },

  async mounted() {
    await this.fetchDocuments()
    if (this.isAdmin) {
      await this.fetchProfilePictures()
      await this.fetchEmployees()
    }
  },

  watch: {
    documentTotal(val) {
      const maxPage = Math.ceil(val / this.perPage) || 1
      if (this.currentPage > maxPage) this.currentPage = maxPage
    },
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

    async fetchDocuments() {
      this.loadingDocuments = true

      try {
        const response = await axios.get(
          utils._api(constant.get_documents),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        const documents = response.data?.data || response.data
        this.documents = documents.map(document => this.mapApiDocument(document))
      } catch (error) {
        console.error('Error fetching documents:', error)
        const message = error.response?.data?.message || 'Unable to load documents.'
        this.showSnackbar(message, 'error', 'mdi-alert-circle')
      } finally {
        this.loadingDocuments = false
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

    mapApiDocument(document) {
      return {
        id: document.id,
        ownerEmail: document.owner_email,
        taskName: document.task_name,
        status: document.status,
        notes: document.notes || '',
        deadlineDate: document.deadline_date,
        givenBy: document.given_by,
        signature: document.signature,
        createdAt: new Date(document.created_at).toLocaleDateString('en-PH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      }
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
      }
    },

    employeeSearchValue(employee, field) {
      if (field === 'name') {
        return `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
      }

      return String(employee[field] || '')
    },

    openAddDialog() {
      this.selectedDocument = null
      this.dialogOpen = true
    },

    openEditDialog(doc) {
      this.selectedDocument = doc
      this.dialogOpen = true
    },

    openDeleteDialog(doc) {
      this.docToDelete = doc
      this.deleteDialogOpen = true
    },

    openEmployeeDocuments(employee) {
      this.selectedEmployee = employee
      this.employeeDocumentsDialog = true
    },

    closeEmployeeDocuments() {
      this.employeeDocumentsDialog = false
      this.selectedEmployee = null
    },

    documentCountForEmployee(employee) {
      return this.documents.filter(document => document.ownerEmail === employee.email).length
    },

    employeeInitials(employee) {
      return `${employee.firstName?.[0] || ''}${employee.lastName?.[0] || ''}`.toUpperCase()
    },

    emailKey(email) {
      return String(email || '').trim().toLowerCase()
    },

    onAdded(apiDocument) {
      this.documents.unshift(this.mapApiDocument(apiDocument))
      this.showSnackbar('Record added successfully!', 'success', 'mdi-check-circle')
    },

    onEdited(apiDocument) {
      const updatedDocument = this.mapApiDocument(apiDocument)
      const index = this.documents.findIndex(document => document.id === updatedDocument.id)

      if (index !== -1) {
        this.documents[index] = updatedDocument
      }

      this.showSnackbar('Record updated successfully!', 'info', 'mdi-pencil-circle')
    },

    async onDeleteConfirmed(doc) {
      try {
        await axios.post(
          utils._api(constant.delete_document),
          { id: doc.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        this.documents = this.documents.filter(document => document.id !== doc.id)
        this.showSnackbar(`"${doc.taskName}" has been deleted.`, 'error', 'mdi-trash-can')
      } catch (error) {
        console.error('Error deleting document:', error)
        const message = error.response?.data?.message || 'Unable to delete document.'
        this.showSnackbar(message, 'error', 'mdi-alert-circle')
      }
    },

    showSnackbar(message, color, icon) {
      this.snackbar = { show: true, message, color, icon }
    },
  },
}
</script>

<style scoped>
.documents {
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
.page-eyebrow {
  color: #598392;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.6px;
  margin: 0 0 8px;
  text-transform: uppercase;
}
.page-title {
  color: #0a303c;
  font-size: 34px;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 8px;
}
.page-sub { font-size: 15px; color: rgba(0,0,0,0.6); margin: 0; }
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 12px;
}
.toolbar-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 20px;
  background: #ffffff;
  border: 1px solid rgba(10,48,60,0.08);
  border-radius: 12px;
  gap: 12px;
  flex-wrap: wrap;
}
.empty-state {
  background: #ffffff;
  border: 1px solid rgba(10,48,60,0.08);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}
.empty-state__title { color: #0a303c; font-size: 18px; font-weight: 700; margin: 0 0 6px; }
.empty-state__sub { font-size: 14px; color: rgba(0,0,0,0.58); margin: 0; }
.table-card {
  overflow: hidden;
  border: 1px solid rgba(10,48,60,0.08);
}
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid rgba(0,0,0,0.06);
  flex-wrap: wrap;
  gap: 8px;
}
.pagination-info { font-size: 12px; color: rgba(0,0,0,0.4); }
.employee-document-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.employee-document-card {
  border: 1px solid rgba(10,48,60,0.08);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.employee-document-card:hover {
  box-shadow: 0 14px 28px rgba(10,48,60,0.12) !important;
  transform: translateY(-3px);
}
.employee-document-card__body {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 112px;
}
.employee-document-card__initials {
  font-size: 13px;
  font-weight: 800;
}
.employee-document-card__main {
  flex: 1;
  min-width: 0;
}
.employee-document-card__name {
  color: #0a303c;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px;
}
.employee-document-card__meta {
  color: rgba(0,0,0,0.52);
  font-size: 12px;
  margin: 0 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.employee-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 20px;
}
.employee-dialog-title {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.employee-dialog-heading {
  color: #0a303c;
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 3px;
}
.employee-dialog-sub {
  color: rgba(0,0,0,0.52);
  font-size: 13px;
  margin: 0;
}
.employee-dialog-empty {
  border: 0;
  border-radius: 0;
  padding: 54px 24px;
}
@media (max-width: 720px) {
  .documents { padding: 20px; }
  .hero-panel { padding: 22px; }
  .page-title { font-size: 28px; }
  .employee-document-grid {
    grid-template-columns: 1fr;
  }
}
.table-skeleton-card {
  padding: 16px;
}
.skeleton-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}
.skeleton-header :deep(.v-skeleton-loader) {
  max-width: 180px;
}
.document-table-skeleton {
  border-radius: 8px;
  overflow: hidden;
}
</style>
