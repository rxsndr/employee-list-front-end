<template>
  <v-app :theme="theme">
    <div class="login-page">
      <header class="login-header">
        <div class="brand-mark">
          <v-icon icon="mdi-home-heart" size="28" />
        </div>
        <div>
          <p class="brand-eyebrow">Pesbuk</p>
          <h1 class="brand-name">Log in/Sign Up</h1>
        </div>

        <v-btn
          class="theme-toggle"
          :icon="theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
          variant="text"
          @click="toggleTheme"
        />
      </header>

      <v-main class="login-main">
        <section class="hero-panel">
          <div class="hero-content">
            <h2>PESBUK from Circuit Solutions Incorporated</h2>
            <p>
              Sign in to review residents, documents, care activity, and monthly records from one
              focused workspace.
            </p>
          </div>
        </section>

        <section class="login-panel">
          <div class="panel-heading">
            <p>Welcome back</p>
            <h2>Sign in to continue</h2>
          </div>

          <v-form class="login-form" @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Email address"
              placeholder="admin@email.com"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              density="comfortable"
              type="email"
              clearable
              :error-messages="emailError"
            />

            <v-text-field
              v-model="password"
              label="Password"
              placeholder="password123"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              :error-messages="passwordError"
              @click:append-inner="showPassword = !showPassword"
            />

            <div class="form-options">
              <v-checkbox
                v-model="rememberMe"
                label="Remember this device"
                color="primary"
                density="compact"
                hide-details
              />
              <v-btn
                class="help-link"
                to="/help-center"
                variant="text"
                color="primary"
                size="small"
                prepend-icon="mdi-lifebuoy"
              >
                Help Center
              </v-btn>
            </div>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :disabled="!email || !password"
              :loading="loading"
              prepend-icon="mdi-login"
            >
              Sign in
            </v-btn>

            <v-btn
              class="privacy-link"
              to="/privacy-policy"
              variant="outlined"
              color="primary"
              size="large"
              block
              prepend-icon="mdi-shield-lock-outline"
            >
              Privacy Policy
            </v-btn>
          </v-form>

          <div class="support-strip">
            <v-icon icon="mdi-lifebuoy" size="20" />
            <span>Support available for facility administrators and care teams.</span>
          </div>
        </section>
      </v-main>

      <v-snackbar
        v-model="snackbar"
        :color="loginSuccess ? 'success' : 'error'"
        rounded="lg"
        timeout="3000"
        location="top right"
      >
        <v-icon class="mr-2">{{ loginSuccess ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
        {{ snackbarMessage }}
      </v-snackbar>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'LoginPage',

  data() {
    return {
      email: '',
      password: '',
      rememberMe: true,
      showPassword: false,
      loading: false,
      loginSuccess: false,
      theme: 'light',
      snackbar: false,
      snackbarMessage: '',
      emailError: '',
      passwordError: '',
      highlights: [
        {
          icon: 'mdi-account-group-outline',
          title: 'Resident records',
          text: 'Keep care details easy to scan.',
        },
        {
          icon: 'mdi-file-document-check-outline',
          title: 'Document tracking',
          text: 'Manage forms and monthly updates.',
        },
        {
          icon: 'mdi-calendar-check-outline',
          title: 'Daily oversight',
          text: 'Monitor attendance and completion.',
        },
      ],
      previewTasks: [
        { label: 'Medication review', value: '9:00 AM', status: 'success' },
        { label: 'Monthly record', value: 'Ready', status: 'primary' },
        { label: 'Care note', value: 'Pending', status: 'warning' },
      ],
    }
  },

  methods: {
    async handleLogin() {
      this.emailError = ''
      this.passwordError = ''

      if (!this.email.includes('@')) {
        this.emailError = 'Please enter a valid email address.'
        return
      }

      if (this.password.length < 6) {
        this.passwordError = 'Password must be at least 6 characters.'
        return
      }

      this.loading = true
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.loading = false

      if (this.email === 'admin@email.com' && this.password === 'password123') {
        this.loginSuccess = true
        this.snackbarMessage = `Welcome back, ${this.email}!`
        this.snackbar = true

        await new Promise(resolve => setTimeout(resolve, 1000))
        this.$router.push('/dashboard')
      } else {
        this.loginSuccess = false
        this.snackbarMessage = 'Invalid email or password. Please try again.'
      }

      this.snackbar = true
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
  },
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  color: #172033;
  background:
    radial-gradient(circle at top left, rgba(31, 116, 112, 0.18), transparent 32rem),
    linear-gradient(135deg, #f7fbfa 0%, #eef6f3 48%, #f8fafc 100%);
}

.login-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 28px clamp(20px, 5vw, 64px);
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  color: #ffffff;
  background: #1f7470;
  box-shadow: 0 16px 30px rgba(31, 116, 112, 0.22);
}

.brand-eyebrow {
  margin: 0 0 2px;
  color: #4b6967;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.brand-name {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.theme-toggle {
  margin-left: auto;
}

.login-main {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(360px, 440px);
  align-items: center;
  gap: clamp(24px, 5vw, 64px);
  width: min(1180px, calc(100% - 40px));
  min-height: calc(100vh - 172px);
  margin: 0 auto;
  padding: 28px 0 56px;
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(270px, 340px);
  align-items: center;
  gap: 28px;
}

.hero-content h2 {
  max-width: 680px;
  margin: 0;
  font-size: clamp(38px, 5vw, 68px);
  font-weight: 800;
  line-height: 1.02;
}

.hero-content p {
  max-width: 620px;
  margin: 22px 0 0;
  color: #506765;
  font-size: 17px;
  line-height: 1.7;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 34px;
}

.feature-tile {
  min-height: 132px;
  padding: 18px;
  border: 1px solid rgba(31, 116, 112, 0.14);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
}

.feature-tile .v-icon {
  color: #1f7470;
}

.feature-tile strong,
.feature-tile span {
  display: block;
}

.feature-tile strong {
  margin: 14px 0 7px;
  font-size: 14px;
}

.feature-tile span {
  color: #667c79;
  font-size: 13px;
  line-height: 1.45;
}

.dashboard-preview,
.login-panel {
  border: 1px solid rgba(23, 32, 51, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 60px rgba(22, 42, 57, 0.12);
}

.dashboard-preview {
  padding: 18px;
}

.preview-toolbar {
  display: flex;
  gap: 6px;
  padding-bottom: 18px;
}

.preview-toolbar span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #d7e4e1;
}

.resident-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  color: #ffffff;
  background: #172033;
}

.resident-avatar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: #172033;
  background: #e8c872;
  font-size: 13px;
  font-weight: 800;
}

.resident-card strong,
.resident-card span {
  display: block;
}

.resident-card span {
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
}

.preview-list {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.preview-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 13px 12px;
  border-radius: 8px;
  background: #f6f9f8;
  font-size: 13px;
}

.preview-row strong {
  font-size: 12px;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.status-dot.success {
  background: #1f9d67;
}

.status-dot.primary {
  background: #1f7470;
}

.status-dot.warning {
  background: #d99a21;
}

.login-panel {
  padding: clamp(24px, 4vw, 38px);
}

.panel-heading p {
  margin: 0 0 8px;
  color: #1f7470;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.panel-heading h2 {
  margin: 0 0 28px;
  font-size: 30px;
  font-weight: 800;
}

.login-form {
  display: grid;
  gap: 12px;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: -6px 0 10px;
}

.support-strip {
  display: flex;
  gap: 10px;
  margin-top: 22px;
  padding: 14px;
  border-radius: 8px;
  color: #506765;
  background: #f4f8f7;
  font-size: 13px;
  line-height: 1.45;
}

:deep(.v-field) {
  border-radius: 8px;
}

:deep(.v-btn) {
  border-radius: 8px;
  text-transform: none;
  letter-spacing: 0;
}

.help-link {
  flex: 0 0 auto;
}

.privacy-link {
  margin-top: 2px;
}

.v-theme--dark .login-page {
  color: #edf5f3;
  background:
    radial-gradient(circle at top left, rgba(58, 158, 150, 0.18), transparent 32rem),
    linear-gradient(135deg, #111827 0%, #172033 58%, #0f172a 100%);
}

.v-theme--dark .brand-eyebrow,
.v-theme--dark .hero-content p,
.v-theme--dark .feature-tile span,
.v-theme--dark .support-strip,
.v-theme--dark .login-footer {
  color: rgba(237, 245, 243, 0.68);
}

.v-theme--dark .feature-tile,
.v-theme--dark .dashboard-preview,
.v-theme--dark .login-panel {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(17, 24, 39, 0.78);
}

.v-theme--dark .preview-row,
.v-theme--dark .support-strip {
  background: rgba(255, 255, 255, 0.06);
}

@media (max-width: 1080px) {
  .login-main {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .hero-panel {
    grid-template-columns: 1fr;
  }

  .dashboard-preview {
    max-width: 520px;
  }
}

@media (max-width: 720px) {
  .login-header {
    padding: 20px;
  }

  .brand-name {
    font-size: 17px;
  }

  .login-main {
    width: min(100% - 28px, 560px);
    padding-top: 12px;
  }

  .hero-content h2 {
    font-size: 36px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .login-panel {
    padding: 22px;
  }

  .login-footer {
    flex-direction: column;
    align-items: flex-start;
    width: min(100% - 28px, 560px);
    padding-bottom: 22px;
  }
}
</style>
