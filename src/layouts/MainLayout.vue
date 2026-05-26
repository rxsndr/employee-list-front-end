<template>
  <v-app class="main-shell">
    <Sidebar @hover-change="sidebarExpanded = $event" />

    <v-app-bar flat color="white" border="b" height="70" class="main-app-bar">
      <v-app-bar-title>
        <span class="appbar-title">{{ currentPageTitle }}</span>
      </v-app-bar-title>
      <template v-slot:append>
        <v-menu v-model="profileMenu" :close-on-content-click="false" location="bottom end" offset="8">
          <template v-slot:activator="{ props }">
            <v-avatar v-bind="props" color="primary" size="36" class="mr-3" style="cursor:pointer;">
              <span style="font-size:13px; font-weight:700;">RS</span>
            </v-avatar>
          </template>
          <v-card rounded="xl" elevation="4" min-width="220" border>
            <v-list-item class="pt-4 pb-2 px-4">
              <template v-slot:prepend>
                <v-avatar color="primary" size="40">
                  <span style="font-size:14px; font-weight:700;">RS</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold" style="font-size:14px;">Rexsander</v-list-item-title>
              <v-list-item-subtitle style="font-size:12px;">rexsander@email.com</v-list-item-subtitle>
            </v-list-item>
            <v-divider class="my-1" />
            <v-list density="compact" nav class="pb-2">
              <v-list-item prepend-icon="mdi-account-outline" title="My Profile" rounded="lg" @click="profileMenu = false" />
              <v-list-item prepend-icon="mdi-cog-outline" title="Settings" rounded="lg" @click="profileMenu = false" />
            </v-list>
            <v-divider />
            <v-list density="compact" nav class="py-2">
              <v-list-item prepend-icon="mdi-logout" title="Log Out" rounded="lg" base-color="error" @click="onLogoutClick" />
            </v-list>
          </v-card>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- ✅ This single div handles ALL the left offset for every page -->
    <v-main>
      <div
        class="page-wrapper"
        :style="{
          paddingLeft: sidebarExpanded ? '232px' : '72px',
          transition: 'padding-left 0.22s cubic-bezier(0.4,0,0.2,1)'
        }"
      >
        <RouterView />
      </div>
    </v-main>

    <LogoutConfirmDialog v-model="logoutDialog" @confirmed="handleLogoutConfirmed" />
  </v-app>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import LogoutConfirmDialog from '@/components/LogoutConfirmDialog.vue'

export default {
  name: 'MainLayout',
  components: { Sidebar, LogoutConfirmDialog },
  data() {
    return {
      sidebarExpanded: false,
      profileMenu: false,
      logoutDialog: false,
    }
  },
  computed: {
    currentPageTitle() {
      const map = {
        '/dashboard': 'Dashboard',
        '/documents': 'Documents',
        '/employees': 'Employees',
        '/calendar': 'Calendar',
      }
      return map[this.$route.path] || 'Pesbuk'
    },
  },
  methods: {
    onLogoutClick() {
      this.profileMenu = false
      this.logoutDialog = true
    },
    handleLogoutConfirmed() {
      this.$router.push('/')
    },
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
body {
  background: #f5f7fa;
}
.main-shell {
  background: #f5f7fa !important;
}
.main-app-bar {
  box-shadow: 0 2px 14px rgba(10, 48, 60, 0.06) !important;
}
.appbar-title {
  color: #0a303c;
  font-size: 16px;
  font-weight: 700;
}
.page-wrapper {
  min-height: 100%;
  background: #f5f7fa;
}
</style>
