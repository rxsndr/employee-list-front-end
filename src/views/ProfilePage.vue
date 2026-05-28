<template>
  <div class="profile-page">
    <v-card class="profile-card" rounded="lg" elevation="1">
      <v-card-title class="profile-header">
        <v-avatar color="primary" size="52">
          <span class="avatar-text">{{ userInitials }}</span>
        </v-avatar>

        <div>
          <h2>{{ fullName }}</h2>
          <p>{{ user.email }}</p>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div class="info-grid">
          <div class="info-item">
            <p>Employee ID</p>
            <strong>{{ user.employee_id }}</strong>
          </div>

          <div class="info-item">
            <p>Name</p>
            <strong>{{ fullName }}</strong>
          </div>

          <div class="info-item">
            <p>Email</p>
            <strong>{{ user.email }}</strong>
          </div>

          <div class="info-item">
            <p>Position</p>
            <strong>{{ user.position }}</strong>
          </div>

          <div class="info-item">
            <p>Salary</p>
            <strong>{{ formattedSalary }}</strong>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',

  data() {
    return {
      user: JSON.parse(localStorage.getItem('user') || '{}'),
    }
  },

  computed: {
    fullName() {
      return `${this.user.first_name || ''} ${this.user.last_name || ''}`.trim()
    },

    userInitials() {
      const first = this.user.first_name?.charAt(0) || ''
      const last = this.user.last_name?.charAt(0) || ''
      return `${first}${last}`.toUpperCase() || 'U'
    },

    formattedSalary() {
      return Number(this.user.salary || 0).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
      })
    },
  },
}
</script>

<style scoped>
.profile-page {
  padding: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.profile-card {
  border: 1px solid rgba(10, 48, 60, 0.08);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.profile-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
}

.profile-header p {
  margin: 4px 0 0;
  color: rgba(0, 0, 0, 0.55);
}

.avatar-text {
  font-size: 16px;
  font-weight: 700;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.info-item {
  padding: 16px;
  border-radius: 8px;
  background: #f5f7fa;
}

.info-item p {
  margin: 0 0 6px;
  color: #598392;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.info-item strong {
  color: #0a303c;
  font-size: 15px;
}

@media (max-width: 720px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>