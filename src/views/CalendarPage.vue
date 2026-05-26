<template>
  <div class="calendar-page app-page">

    <!-- Page Header -->
    <div class="page-header hero-panel">
      <div>
        <p class="page-eyebrow">Tracking</p>
        <h1 class="page-title">Calendar</h1>
        <p class="page-sub">Monthly record tracking overview</p>
      </div>

      <!-- Month Navigator -->
      <div class="month-nav">
        <v-btn icon="mdi-chevron-left" variant="text" size="small" @click="prevMonth" />
        <span class="month-label">{{ monthLabel }}</span>
        <v-btn icon="mdi-chevron-right" variant="text" size="small" @click="nextMonth" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="store.documents.length === 0" class="empty-state">
      <v-icon icon="mdi-calendar-blank-outline" size="64" color="grey-lighten-1" class="mb-4" />
      <h3 class="empty-state__title">No records to display</h3>
      <p class="empty-state__sub">Add documents first from the Documents page.</p>
      <v-btn color="primary" variant="flat" rounded="lg" prepend-icon="mdi-arrow-right" class="mt-3" @click="$router.push('/documents')">
        Go to Documents
      </v-btn>
    </div>

    <!-- MAR Table -->
    <div v-else class="mar-wrapper">
      <div class="mar-scroll-container" ref="scrollContainer">
        <table class="mar-table">
          <thead>
            <tr>
              <!-- Frozen columns headers -->
              <th class="th frozen frozen-1 th-num">#</th>
              <th class="th frozen frozen-2 th-name">Name</th>
              <th class="th frozen frozen-3 th-address">Address</th>
              <!-- Day headers -->
              <th
                v-for="day in daysInMonth"
                :key="day"
                class="th th-day"
                :class="{ 'th-day--today': isToday(day), 'th-day--weekend': isWeekend(day) }"
              >
                <div class="day-header">
                  <span class="day-num">{{ day }}</span>
                  <span class="day-name">{{ getDayName(day) }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(doc, index) in store.documents"
              :key="doc.id"
              class="mar-row"
              :class="{ 'mar-row--even': index % 2 === 0 }"
            >
              <!-- Frozen: # -->
              <td class="td frozen frozen-1 td-num">{{ index + 1 }}</td>

              <!-- Frozen: Name + Age -->
              <td class="td frozen frozen-2 td-name">
                <div class="name-cell">
                  <v-avatar color="primary" variant="tonal" size="30">
                    <span style="font-size:11px; font-weight:700;">{{ initials(doc.name) }}</span>
                  </v-avatar>
                  <div class="name-cell__info">
                    <span class="name-cell__name">{{ doc.name }}</span>
                    <span class="name-cell__age">Age {{ doc.age }}</span>
                  </div>
                </div>
              </td>

              <!-- Frozen: Address -->
              <td class="td frozen frozen-3 td-address">
                <span class="address-text">{{ doc.address }}</span>
              </td>

              <!-- Day cells -->
              <td
                v-for="day in daysInMonth"
                :key="day"
                class="td td-cell"
                :class="{
                  'td-cell--today': isToday(day),
                  'td-cell--weekend': isWeekend(day),
                  'td-cell--marked': isMarked(doc.id, day),
                  'td-cell--future': isFuture(day),
                }"
                @click="!isFuture(day) && toggleMark(doc.id, day)"
              >
                <div class="cell-inner">
                  <!-- Marked -->
                  <v-icon
                    v-if="isMarked(doc.id, day)"
                    icon="mdi-check-circle"
                    size="18"
                    color="success"
                  />
                  <!-- Today unmarked -->
                  <v-icon
                    v-else-if="isToday(day)"
                    icon="mdi-plus-circle"
                    size="18"
                    color="primary"
                  />
                  <!-- Past unmarked -->
                  <v-icon
                    v-else-if="isPast(day)"
                    icon="mdi-close-circle-outline"
                    size="16"
                    color="error"
                    style="opacity:0.35"
                  />
                  <!-- Future -->
                  <v-icon
                    v-else
                    icon="mdi-plus-circle-outline"
                    size="16"
                    color="grey"
                    style="opacity:0.3"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div class="legend-item">
          <v-icon icon="mdi-check-circle" size="16" color="success" />
          <span>Marked</span>
        </div>
        <div class="legend-item">
          <v-icon icon="mdi-close-circle-outline" size="16" color="error" />
          <span>Missed</span>
        </div>
        <div class="legend-item">
          <v-icon icon="mdi-plus-circle" size="16" color="primary" />
          <span>Today</span>
        </div>
        <div class="legend-item">
          <div class="legend-swatch weekend-swatch"></div>
          <span>Weekend</span>
        </div>
        <div class="legend-item">
          <div class="legend-swatch today-swatch"></div>
          <span>Today</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { documentStore } from '../plugins/store.js'

export default {
  name: 'CalendarPage',

  data() {
    const now = new Date()
    return {
      store: documentStore,
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth(), // 0-indexed
      // marks: { 'docId-day': true }
      marks: {},
    }
  },

  computed: {
    monthLabel() {
      return new Date(this.currentYear, this.currentMonth, 1)
        .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    },

    daysInMonth() {
      const count = new Date(this.currentYear, this.currentMonth + 1, 0).getDate()
      return Array.from({ length: count }, (_, i) => i + 1)
    },

    todayDay() {
      const now = new Date()
      if (now.getFullYear() === this.currentYear && now.getMonth() === this.currentMonth) {
        return now.getDate()
      }
      return null
    },

    missedCount() {
      return this.store.documents.filter(doc => {
        return this.daysInMonth
          .filter(d => this.isPast(d))
          .every(d => !this.isMarked(doc.id, d))
      }).length
    },
  },

  methods: {
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

    isToday(day) {
      return this.todayDay === day
    },

    isPast(day) {
      const today = new Date()
      const cell = new Date(this.currentYear, this.currentMonth, day)
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      return cell < todayMidnight
    },

    isFuture(day) {
      const today = new Date()
      const cell = new Date(this.currentYear, this.currentMonth, day)
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      return cell > todayMidnight
    },

    isWeekend(day) {
      const d = new Date(this.currentYear, this.currentMonth, day).getDay()
      return d === 0 || d === 6
    },

    getDayName(day) {
      return new Date(this.currentYear, this.currentMonth, day)
        .toLocaleDateString('en-US', { weekday: 'short' })
        .charAt(0)
    },

    markKey(docId, day) {
      return `${docId}-${this.currentYear}-${this.currentMonth}-${day}`
    },

    isMarked(docId, day) {
      return !!this.marks[this.markKey(docId, day)]
    },

    toggleMark(docId, day) {
      const key = this.markKey(docId, day)
      if (this.marks[key]) {
        delete this.marks[key]
      } else {
        this.marks[key] = true
      }
    },

    initials(name) {
      return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
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
  height: 100%;
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
.page-eyebrow {
  color: #598392;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.6px;
  margin: 0 0 8px;
  text-transform: uppercase;
}

/* Header */
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
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
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

/* Empty state */
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

/* MAR Table Wrapper */
.mar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.mar-scroll-container {
  flex: 1;
  overflow: auto;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(10,48,60,0.08);
  box-shadow: 0 14px 34px rgba(10,48,60,0.07);
  /* Key: relative positioning context for sticky */
  position: relative;
}

/* The actual table */
.mar-table {
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  min-width: 100%;
}

/* ─── Sticky header row ─── */
.th {
  position: sticky;
  top: 0;
  background: #0a303c;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 12px;
  white-space: nowrap;
  z-index: 20;
  border-bottom: 2px solid rgba(255,255,255,0.1);
}

/* ─── Frozen columns (left) ─── */
.frozen { position: sticky; }

/* Column widths & left offsets */
.frozen-1 { left: 0;     min-width: 42px;  max-width: 42px; }
.frozen-2 { left: 42px;  min-width: 180px; max-width: 180px; }
.frozen-3 { left: 222px; min-width: 200px; max-width: 200px; }

/* Header frozen cells get higher z so they sit above body frozen cells */
.th.frozen { z-index: 30; background: #0a303c; }

/* Right border on last frozen col */
.frozen-3 {
  border-right: 2px solid rgba(0,0,0,0.1);
  box-shadow: 2px 0 6px rgba(0,0,0,0.08);
}
.th.frozen-3 {
  border-right: 2px solid rgba(255,255,255,0.15);
  box-shadow: 2px 0 8px rgba(0,0,0,0.2);
}

/* Day header */
.th-day {
  min-width: 48px;
  text-align: center;
  padding: 6px 4px;
}
.th-day--today { background: #598392 !important; }
.th-day--weekend { background: #344a53 !important; }

.day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}
.day-num { font-size: 13px; font-weight: 700; line-height: 1; }
.day-name { font-size: 9px; opacity: 0.6; font-weight: 400; }

/* ─── Body cells ─── */
.td {
  background: #fff;
  font-size: 13px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  vertical-align: middle;
}
.mar-row--even .td { background: #f8fafc; }
.mar-row:hover .td { background: rgba(89,131,146,0.1) !important; }

/* Frozen body cells need explicit background to cover scrolled content */
.mar-row .frozen { background: #fff; }
.mar-row--even .frozen { background: #f8fafc; }
.mar-row:hover .frozen { background: rgba(89,131,146,0.1) !important; }

.td-num { text-align: center; color: rgba(0,0,0,0.35); font-size: 12px; }
.td-name { white-space: nowrap; }
.td-address { white-space: nowrap; }

.name-cell { display: flex; align-items: center; gap: 8px; }
.name-cell__info { display: flex; flex-direction: column; }
.name-cell__name { font-size: 13px; font-weight: 600; line-height: 1.2; }
.name-cell__age { font-size: 11px; color: rgba(0,0,0,0.4); }
.address-text { font-size: 12px; color: rgba(0,0,0,0.55); }

/* Day body cells */
.td-cell {
  text-align: center;
  padding: 6px 4px;
  cursor: pointer;
  transition: background 0.1s;
  min-width: 48px;
}
.td-cell:hover:not(.td-cell--future) { background: rgba(89,131,146,0.12) !important; }
.td-cell--today { background: rgba(89,131,146,0.1) !important; }
.td-cell--today.mar-row--even { background: rgba(89,131,146,0.14) !important; }
.td-cell--weekend { background: rgba(0,0,0,0.018) !important; }
.td-cell--marked { background: rgba(16,185,129,0.06) !important; }
.td-cell--future { cursor: default; }

.cell-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
}

/* Legend */
.legend {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 0 4px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: rgba(0,0,0,0.5);
}
.legend-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}
.weekend-swatch { background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1); }
.today-swatch { background: rgba(89,131,146,0.16); border: 1px solid rgba(89,131,146,0.3); }
@media (max-width: 720px) {
  .calendar-page { padding: 20px; }
  .hero-panel { padding: 22px; }
  .page-title { font-size: 28px; }
}
</style>
