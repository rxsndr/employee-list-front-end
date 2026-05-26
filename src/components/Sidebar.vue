<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar--expanded': hovered }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <!-- Logo -->
    <div class="sidebar__logo">
      <div class="sidebar__logo-icon">
        <v-img
          src="https://alsolutionsoftware.com/logo-c.png"
          width="34"
          height="34"
          contain
          alt="ALSS logo"
        />
      </div>
      <Transition name="label-fade">
        <span v-if="hovered" class="sidebar__logo-text">ALss</span>
      </Transition>
    </div>

    <!-- Nav Items -->
    <nav class="sidebar__nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar__item"
        :class="{ 'sidebar__item--active': $route.path === item.to }"
      >
        <div class="sidebar__item-icon">
          <v-icon :icon="item.icon" size="20" />
        </div>
        <Transition name="label-fade">
          <span v-if="hovered" class="sidebar__item-label">{{ item.label }}</span>
        </Transition>
      </RouterLink>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'SideBar',

  emits: ['hover-change'],

  data() {
    return {
      hovered: false,
      navItems: [
        { to: '/dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard-outline' },
        { to: '/documents', label: 'Documents',  icon: 'mdi-file-document-outline'  },
        { to: '/calendar',  label: 'Calendar',   icon: 'mdi-calendar-month-outline'  },
        { to: '/employees', label: 'Employees', icon: 'mdi-account-group-outline' },
      ],
    }
  },

  methods: {
    onEnter() {
      this.hovered = true
      this.$emit('hover-change', true)
    },
    onLeave() {
      this.hovered = false
      this.$emit('hover-change', false)
    },
  },
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 72px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  z-index: 300;
  transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border-right: 1px solid rgba(10, 48, 60, 0.08);
  box-shadow: 8px 0 28px rgba(10, 48, 60, 0.08);
}
.sidebar--expanded { width: 232px; }
.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(10, 48, 60, 0.08);
  min-height: 70px;
  overflow: hidden;
  white-space: nowrap;
  flex-shrink: 0;
}
.sidebar__logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sidebar__logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #0a303c;
}
.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 12px;
  flex: 1;
}
.sidebar__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 10px;
  border-radius: 12px;
  text-decoration: none;
  color: #344a53;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  overflow: hidden;
  white-space: nowrap;
}
.sidebar__item:hover {
  background: rgba(89, 131, 146, 0.1);
  color: #0a303c;
  transform: translateX(3px);
}
.sidebar__item--active {
  background: #f5f7fa;
  color: #598392;
  box-shadow: inset 3px 0 0 #598392;
}
.sidebar__item-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sidebar__item-label {
  font-size: 14px;
  font-weight: 600;
}
.label-fade-enter-active, .label-fade-leave-active { transition: opacity 0.15s; }
.label-fade-enter-from, .label-fade-leave-to { opacity: 0; }
</style>
