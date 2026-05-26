<template>
  <div class="dashboard app-page">

    <!-- Page Header -->
    <div class="page-header hero-panel">
      <div>
        <p class="page-eyebrow">Overview</p>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">Welcome back — here's your overview</p>
      </div>
      <v-btn color="blue-grey-darken-4" variant="flat" rounded="lg" prepend-icon="mdi-file-plus-outline" @click="$router.push('/documents')">
        Add Document
      </v-btn>
    </div>

    <!-- Stats Row -->
    <div class="stats-grid">

      <!-- Total Documents -->
      <v-card rounded="lg" elevation="1" class="stat-card stat-card--primary">
        <v-card-text class="stat-card__body">
          <div class="stat-card__icon-wrap" style="background: rgba(24,119,242,0.1);">
            <v-icon icon="mdi-file-document-multiple-outline" color="#1877f2" size="28" />
          </div>
          <div class="stat-card__info">
            <p class="stat-card__label">Total Documents</p>
            <p class="stat-card__value">{{ store.total }}</p>
          </div>
          <v-chip
            :color="store.total > 0 ? 'primary' : 'default'"
            variant="tonal"
            size="small"
            class="stat-card__chip"
          >
            {{ store.total === 0 ? 'Empty' : store.total === 1 ? '1 record' : `${store.total} records` }}
          </v-chip>
        </v-card-text>
      </v-card>

      <!-- Last Added -->
      <v-card rounded="lg" elevation="1" class="stat-card">
        <v-card-text class="stat-card__body">
          <div class="stat-card__icon-wrap" style="background: rgba(16,185,129,0.1);">
            <v-icon icon="mdi-clock-check-outline" color="#10b981" size="28" />
          </div>
          <div class="stat-card__info">
            <p class="stat-card__label">Last Added</p>
            <p class="stat-card__value-sm">
              {{ lastAdded }}
            </p>
          </div>
        </v-card-text>
      </v-card>

      <!-- Quick Navigate -->
      <v-card
        rounded="lg"
        elevation="1"
        class="stat-card stat-card--action"
        style="cursor: pointer;"
        @click="$router.push('/documents')"
      >
        <v-card-text class="stat-card__body">
          <div class="stat-card__icon-wrap" style="background: rgba(245,158,11,0.1);">
            <v-icon icon="mdi-plus-circle-outline" color="#f59e0b" size="28" />
          </div>
          <div class="stat-card__info">
            <p class="stat-card__label">Add Document</p>
            <p class="stat-card__value-sm">Go to Documents →</p>
          </div>
        </v-card-text>
      </v-card>

    </div>

    <!-- Recent Table -->
    <v-card rounded="lg" elevation="1" class="recent-card mt-6">
      <v-card-title class="recent-card__header">
        <v-icon icon="mdi-history" size="18" class="mr-2" />
        Recent Records
      </v-card-title>
      <v-divider />

      <!-- Empty State -->
      <div v-if="store.total === 0" class="empty-state">
        <v-icon icon="mdi-file-document-outline" size="48" color="grey-lighten-1" class="mb-3" />
        <p class="empty-state__text">No documents yet. Add one from the Documents page.</p>
        <v-btn
          color="primary"
          variant="tonal"
          rounded="lg"
          prepend-icon="mdi-arrow-right"
          @click="$router.push('/documents')"
          class="mt-2"
        >
          Go to Documents
        </v-btn>
      </div>

      <!-- Table -->
      <v-table v-else density="comfortable">
        <thead>
          <tr>
            <th class="table-th">#</th>
            <th class="table-th">Name</th>
            <th class="table-th">Age</th>
            <th class="table-th">Address</th>
            <th class="table-th">Date Added</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(doc, index) in recentDocs"
            :key="doc.id"
            class="table-row"
          >
            <td class="table-td table-td--muted">{{ index + 1 }}</td>
            <td class="table-td">
              <div class="name-cell">
                <v-avatar color="primary" variant="tonal" size="32">
                  <span style="font-size:12px; font-weight:600;">{{ initials(doc.name) }}</span>
                </v-avatar>
                {{ doc.name }}
              </div>
            </td>
            <td class="table-td">{{ doc.age }}</td>
            <td class="table-td">{{ doc.address }}</td>
            <td class="table-td table-td--muted">{{ doc.createdAt }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

  </div>
</template>

<script>
import { documentStore } from '../plugins/store.js'

export default {
  name: 'DashboardPage',

  data() {
    return {
      store: documentStore,
    }
  },

  computed: {
    lastAdded() {
      if (this.store.documents.length === 0) return '—'
      return this.store.documents[this.store.documents.length - 1].createdAt
    },
    recentDocs() {
      return [...this.store.documents].reverse().slice(0, 10)
    },
  },

  methods: {
    initials(name) {
      return name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    },
  },
}
</script>

<style scoped>
.dashboard {
  padding: 30px;
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
}
.app-page {
  color: #0a303c;
}
.hero-panel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 28px;
  margin-bottom: 24px;
  background: #ffffff;
  border: 1px solid rgba(10, 48, 60, 0.08);
  border-radius: 12px;
  box-shadow: 0 14px 34px rgba(10, 48, 60, 0.07);
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
.page-sub {
  color: rgba(0,0,0,0.6);
  font-size: 15px;
  margin: 0;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.stat-card {
  border: 1px solid rgba(10, 48, 60, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.stat-card:hover {
  box-shadow: 0 16px 30px rgba(10, 48, 60, 0.12) !important;
  transform: translateY(-4px);
}
.stat-card__body {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px !important;
  flex-wrap: wrap;
}
.stat-card__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  flex-shrink: 0;
}
.stat-card__info {
  flex: 1;
}
.stat-card__label {
  color: #598392;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.8px;
  margin: 0 0 6px;
  text-transform: uppercase;
}
.stat-card__value {
  color: #0a303c;
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
  margin: 0;
}
.stat-card__value-sm {
  color: #0a303c;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}
.stat-card--action {
  cursor: pointer;
}
.recent-card {
  border: 1px solid rgba(10, 48, 60, 0.08);
  overflow: hidden;
}
.recent-card__header {
  display: flex;
  align-items: center;
  color: #0a303c;
  font-size: 15px;
  font-weight: 700;
  padding: 18px 20px;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  text-align: center;
}
.empty-state__text {
  color: rgba(0,0,0,0.58);
  font-size: 14px;
  margin: 0;
}
.table-th {
  color: #344a53 !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.8px;
  padding: 13px 16px !important;
  text-transform: uppercase;
}
.table-td {
  color: rgba(0,0,0,0.72);
  font-size: 14px;
  padding: 13px 16px !important;
}
.table-td--muted {
  color: rgba(0,0,0,0.45);
  font-size: 13px;
}
.table-row:hover td {
  background: rgba(89, 131, 146, 0.08);
}
.name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}
@media (max-width: 720px) {
  .dashboard {
    padding: 20px;
  }
  .hero-panel {
    flex-direction: column;
  }
  .page-title {
    font-size: 28px;
  }
}
</style>
