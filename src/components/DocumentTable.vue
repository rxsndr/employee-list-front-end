<template>
  <v-table density="comfortable" fixed-header :height="height">
    <thead>
      <tr>
        <th class="table-th">#</th>
        <th class="table-th">Date Added</th>
        <th class="table-th">Task Name</th>
        <th class="table-th">Status</th>
        <th class="table-th">Notes</th>
        <th class="table-th">Deadline</th>
        <th class="table-th">Given By</th>
        <th class="table-th">Signature</th>
        <th v-if="showActions" class="table-th">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(doc, index) in documents" :key="doc.id" class="table-row">
        <td class="table-td table-td--muted">{{ startIndex + index + 1 }}</td>
        <td class="table-td">
          <v-chip size="x-small" variant="tonal">{{ doc.createdAt }}</v-chip>
        </td>
        <td class="table-td">{{ doc.taskName }}</td>
        <td class="table-td">
          <v-chip size="small" :color="statusColor(doc.status)" variant="tonal">
            {{ doc.status }}
          </v-chip>
        </td>
        <td class="table-td">{{ doc.notes }}</td>
        <td class="table-td">{{ doc.deadlineDate }}</td>
        <td class="table-td">{{ doc.givenBy }}</td>
        <td class="table-td">
          <img
            v-if="doc.signature"
            :src="doc.signature"
            alt="Supervisor signature"
            class="signature-preview"
          />
          <span v-else>-</span>
        </td>
        <td v-if="showActions" class="table-td table-td--actions">
          <v-btn
            icon="mdi-pencil-outline"
            size="small"
            variant="tonal"
            color="warning"
            class="mr-1"
            @click="$emit('edit', doc)"
          />
          <v-btn
            icon="mdi-trash-can-outline"
            size="small"
            variant="tonal"
            color="error"
            @click="$emit('delete', doc)"
          />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  name: 'DocumentTable',

  props: {
    documents: { type: Array, required: true },
    showActions: { type: Boolean, default: false },
    startIndex: { type: Number, default: 0 },
    height: { type: [Number, String], default: 420 },
  },

  emits: ['edit', 'delete'],

  methods: {
    statusColor(status) {
      if (status === 'completed') return 'success'
      if (status === 'in progress') return 'warning'
      return 'grey'
    },
  },
}
</script>

<style scoped>
.table-th {
  color: #344a53 !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  padding: 12px 16px !important;
  text-transform: uppercase;
}
.table-td {
  color: rgba(0,0,0,0.72);
  font-size: 14px;
  padding: 12px 16px !important;
}
.table-td--muted {
  color: rgba(0,0,0,0.4);
  font-size: 13px;
}
.table-td--actions {
  width: 100px;
  white-space: nowrap;
}
.table-row:hover td {
  background: rgba(89,131,146,0.08);
}
.signature-preview {
  width: 90px;
  height: 42px;
  object-fit: contain;
}
</style>
