<template>
  <div class="calendar-page app-page">
    <div class="page-header hero-panel">
      <div>
        <p class="page-eyebrow">Tracking</p>
        <h1 class="page-title">Calendar</h1>
        <p class="page-sub">Task deadline overview</p>
      </div>

      <div class="month-nav">
        <v-btn icon="mdi-chevron-left" variant="text" size="small" @click="prevMonth" />
        <span class="month-label">{{ monthLabel }}</span>
        <v-btn icon="mdi-chevron-right" variant="text" size="small" @click="nextMonth" />
      </div>
    </div>

    <v-card v-if="loadingDocuments" rounded="lg" elevation="1" class="calendar-loading">
      <v-skeleton-loader type="table" />
    </v-card>

    <div v-else-if="documents.length === 0" class="empty-state">
      <v-icon icon="mdi-calendar-blank-outline" size="64" color="grey-lighten-1" class="mb-4" />
      <h3 class="empty-state__title">No deadlines to display</h3>
      <p class="empty-state__sub">Add task documents first from the Documents page.</p>
      <v-btn color="primary" variant="flat" rounded="lg" prepend-icon="mdi-arrow-right" class="mt-3" @click="$router.push('/documents')">
        Go to Documents
      </v-btn>
    </div>

    <div v-else class="calendar-card">
      <div class="calendar-grid">
        <div v-for="day in weekdayLabels" :key="day" class="weekday-cell">
          {{ day }}
        </div>

        <div
          v-for="cell in calendarCells"
          :key="cell.key"
          class="day-cell"
          :class="{
            'day-cell--muted': !cell.inMonth,
            'day-cell--today': cell.isToday,
          }"
        >
          <div class="day-cell__header">
            <span>{{ cell.date.getDate() }}</span>
            <v-chip v-if="documentsForDate(cell.date).length" color="primary" size="x-small" variant="tonal">
              {{ documentsForDate(cell.date).length }}
            </v-chip>
          </div>

          <div class="task-list">
            <button
              v-for="doc in documentsForDate(cell.date)"
              :key="doc.id"
              class="task-pill"
              :class="`task-pill--${statusClass(doc.status)}`"
              type="button"
              @click="openTaskDialog(doc)"
            >
              <span>{{ doc.taskName }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <v-dialog v-model="taskDialog" max-width="520">
      <v-card rounded="lg" elevation="0" border>
        <v-card-title class="task-dialog-header">
          <div>
            <p class="task-dialog-title">{{ selectedTask?.taskName }}</p>
            <p class="task-dialog-sub">{{ selectedTask?.deadlineLabel }}</p>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="taskDialog = false" />
        </v-card-title>
        <v-divider />
        <v-card-text v-if="selectedTask" class="task-dialog-body">
          <div class="task-field">
            <span>Status</span>
            <v-chip :color="statusColor(selectedTask.status)" size="small" variant="tonal">
              {{ selectedTask.status }}
            </v-chip>
          </div>
          <div class="task-field">
            <span>Given By</span>
            <strong>{{ selectedTask.givenBy }}</strong>
          </div>
          <div class="task-field">
            <span>Notes</span>
            <p>{{ selectedTask.notes || '-' }}</p>
          </div>
          <div v-if="selectedTask.ownerEmail" class="task-field">
            <span>Employee</span>
            <strong>{{ selectedTask.ownerEmail }}</strong>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

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

export default {
  name: 'CalendarPage',

  data() {
    const now = new Date()

    return {
      documents: [],
      loadingDocuments: false,
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth(),
      selectedTask: null,
      taskDialog: false,
      weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      snackbar: {
        show: false,
        message: '',
        color: 'success',
        icon: 'mdi-check-circle',
      },
    }
  },

  computed: {
    monthLabel() {
      return new Date(this.currentYear, this.currentMonth, 1)
        .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    },

    calendarCells() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1)
      const startDate = new Date(this.currentYear, this.currentMonth, 1 - firstDay.getDay())

      return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + index)

        return {
          key: this.dateKey(date),
          date,
          inMonth: date.getMonth() === this.currentMonth,
          isToday: this.isSameDate(date, new Date()),
        }
      })
    },
  },

  async mounted() {
    await this.fetchDocuments()
  },

  methods: {
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
        console.error('Error fetching calendar documents:', error)
        const message = error.response?.data?.message || 'Unable to load calendar deadlines.'
        this.showSnackbar(message, 'error', 'mdi-alert-circle')
      } finally {
        this.loadingDocuments = false
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
        deadlineLabel: this.formatDate(document.deadline_date),
        givenBy: document.given_by,
      }
    },

    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear--
      } else {
        this.currentMonth--
      }
    },

    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else {
        this.currentMonth++
      }
    },

    documentsForDate(date) {
      const key = this.dateKey(date)
      return this.documents.filter(document => document.deadlineDate === key)
    },

    dateKey(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    formatDate(value) {
      if (!value) return ''
      const [year, month, day] = value.split('-').map(Number)
      return new Date(year, month - 1, day).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    isSameDate(first, second) {
      return (
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
      )
    },

    openTaskDialog(task) {
      this.selectedTask = task
      this.taskDialog = true
    },

    statusColor(status) {
      if (status === 'completed') return 'success'
      if (status === 'in progress') return 'warning'
      return 'grey'
    },

    statusClass(status) {
      return String(status || '').replace(/\s+/g, '-')
    },

    showSnackbar(message, color, icon) {
      this.snackbar = { show: true, message, color, icon }
    },
  },
}
</script>

<style scoped>
.calendar-page {
  padding: 30px;
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
  color: #0a303c;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
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
.month-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f7fa;
  border: 1px solid rgba(10,48,60,0.08);
  border-radius: 12px;
  padding: 4px 8px;
}
.month-label {
  font-size: 14px;
  font-weight: 600;
  min-width: 160px;
  text-align: center;
}
.calendar-loading,
.calendar-card,
.empty-state {
  background: #ffffff;
  border: 1px solid rgba(10,48,60,0.08);
  border-radius: 12px;
  box-shadow: 0 14px 34px rgba(10,48,60,0.07);
}
.calendar-loading {
  padding: 16px;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}
.empty-state__title {
  color: #0a303c;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 6px;
}
.empty-state__sub {
  color: rgba(0,0,0,0.58);
  font-size: 14px;
  margin: 0;
}
.calendar-card {
  overflow: hidden;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.weekday-cell {
  background: #0a303c;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 12px;
  text-align: center;
}
.day-cell {
  min-height: 128px;
  padding: 10px;
  border-right: 1px solid rgba(10,48,60,0.08);
  border-bottom: 1px solid rgba(10,48,60,0.08);
  background: #ffffff;
}
.day-cell--muted {
  background: #f8fafc;
  color: rgba(0,0,0,0.36);
}
.day-cell--today {
  box-shadow: inset 0 0 0 2px rgba(89,131,146,0.35);
}
.day-cell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  font-size: 13px;
  font-weight: 800;
}
.task-list {
  display: grid;
  gap: 6px;
  margin-top: 8px;
}
.task-pill {
  width: 100%;
  min-height: 28px;
  padding: 5px 7px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: #eef2f5;
  color: #0a303c;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  text-align: left;
}
.task-pill span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.task-pill--completed {
  background: rgba(16,185,129,0.12);
  border-color: rgba(16,185,129,0.24);
  color: #087a50;
}
.task-pill--in-progress {
  background: rgba(245,158,11,0.14);
  border-color: rgba(245,158,11,0.26);
  color: #925f06;
}
.task-pill--pending {
  background: rgba(100,116,139,0.12);
  border-color: rgba(100,116,139,0.22);
  color: #475569;
}
.task-dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
}
.task-dialog-title {
  color: #0a303c;
  font-size: 17px;
  font-weight: 800;
  margin: 0 0 4px;
}
.task-dialog-sub {
  color: rgba(0,0,0,0.52);
  font-size: 13px;
  margin: 0;
}
.task-dialog-body {
  display: grid;
  gap: 14px;
}
.task-field {
  display: grid;
  gap: 5px;
}
.task-field span {
  color: #598392;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}
.task-field p,
.task-field strong {
  color: #0a303c;
  font-size: 14px;
  margin: 0;
}
@media (max-width: 720px) {
  .calendar-page {
    padding: 20px;
  }
  .hero-panel {
    padding: 22px;
  }
  .page-title {
    font-size: 28px;
  }
  .calendar-grid {
    min-width: 760px;
  }
  .calendar-card {
    overflow-x: auto;
  }
}
</style>
