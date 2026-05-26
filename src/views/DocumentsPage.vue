<template>
  <div class="documents app-page">

    <!-- Header -->
    <div class="page-header hero-panel">
      <div>
        <p class="page-eyebrow">Records</p>
        <h1 class="page-title">Documents</h1>
        <p class="page-sub">Manage all your records here</p>
      </div>
      <v-btn color="blue-grey-darken-4" variant="flat" rounded="lg" size="large" prepend-icon="mdi-plus" @click="openAddDialog">
        Add File
      </v-btn>
    </div>

    <!-- Summary Bar + Search -->
    <div class="toolbar-bar">
      <v-chip color="primary" variant="tonal" size="small" prepend-icon="mdi-file-multiple-outline">
        {{ store.total }} {{ store.total === 1 ? 'document' : 'documents' }} total
      </v-chip>

      <v-text-field
        v-model="search"
        placeholder="Search by name, age or address..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        rounded="lg"
        hide-details
        clearable
        style="max-width: 300px;"
        @update:modelValue="currentPage = 1"
      />
    </div>

    <!-- Empty State (no docs at all) -->
    <div v-if="store.total === 0" class="empty-state">
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
        <v-table density="comfortable" fixed-header height="420">
          <thead>
            <tr>
              <th class="table-th">#</th>
              <th class="table-th">Name</th>
              <th class="table-th">Age</th>
              <th class="table-th">Address</th>
              <th class="table-th">Date Added</th>
              <th class="table-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(doc, index) in pagedDocs" :key="doc.id" class="table-row">
              <td class="table-td table-td--muted">{{ (currentPage - 1) * perPage + index + 1 }}</td>
              <td class="table-td">
                <div class="name-cell">
                  <v-avatar color="primary" variant="tonal" size="34">
                    <span style="font-size:12px; font-weight:700;">{{ initials(doc.name) }}</span>
                  </v-avatar>
                  <span class="name-cell__text">{{ doc.name }}</span>
                </div>
              </td>
              <td class="table-td">{{ doc.age }}</td>
              <td class="table-td">{{ doc.address }}</td>
              <td class="table-td">
                <v-chip size="x-small" variant="tonal" color="default">{{ doc.createdAt }}</v-chip>
              </td>
              <td class="table-td table-td--actions">
                <v-btn
                  icon="mdi-pencil-outline"
                  size="small"
                  variant="tonal"
                  color="warning"
                  class="mr-1"
                  @click="openEditDialog(doc)"
                />
                <v-btn
                  icon="mdi-trash-can-outline"
                  size="small"
                  variant="tonal"
                  color="error"
                  @click="openDeleteDialog(doc)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- Pagination -->
        <div class="pagination-bar">
          <span class="pagination-info">
            Showing {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredDocs.length) }} of {{ filteredDocs.length }}
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
import { documentStore } from '../plugins/store.js'
import AddDocumentDialog from '../components/AddDocumentDialog.vue'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog.vue'

export default {
  name: 'DocumentsPage',

  components: { AddDocumentDialog, DeleteConfirmDialog },

  data() {
    return {
      store: documentStore,
      dialogOpen: false,
      selectedDocument: null,
      deleteDialogOpen: false,
      docToDelete: null,
      search: '',
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
    filteredDocs() {
      if (!this.search) return this.store.documents
      const q = this.search.toLowerCase()
      return this.store.documents.filter(d =>
        d.name.toLowerCase().includes(q) ||
        String(d.age).includes(q) ||
        d.address.toLowerCase().includes(q)
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

  watch: {
    'store.total'(val) {
      const maxPage = Math.ceil(val / this.perPage) || 1
      if (this.currentPage > maxPage) this.currentPage = maxPage
    },
  },

  methods: {
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

    onAdded() {
      this.showSnackbar('Record added successfully!', 'success', 'mdi-check-circle')
    },

    onEdited() {
      this.showSnackbar('Record updated successfully!', 'info', 'mdi-pencil-circle')
    },

    onDeleteConfirmed(doc) {
      documentStore.deleteDocument(doc.id)
      this.showSnackbar(`"${doc.name}" has been deleted.`, 'error', 'mdi-trash-can')
    },

    showSnackbar(message, color, icon) {
      this.snackbar = { show: true, message, color, icon }
    },

    initials(name) {
      return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
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
.table-th {
  font-size: 12px !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #344a53 !important;
  padding: 12px 16px !important;
}
.table-td { color: rgba(0,0,0,0.72); font-size: 14px; padding: 12px 16px !important; }
.table-td--muted { color: rgba(0,0,0,0.4); font-size: 13px; }
.table-td--actions { width: 100px; white-space: nowrap; }
.table-row:hover td { background: rgba(89,131,146,0.08); }
.name-cell { display: flex; align-items: center; gap: 10px; }
.name-cell__text { font-weight: 500; }
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
@media (max-width: 720px) {
  .documents { padding: 20px; }
  .hero-panel { padding: 22px; }
  .page-title { font-size: 28px; }
}
</style>
