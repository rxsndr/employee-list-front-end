import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'

import LoginPage from '@/views/LoginPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import DocumentsPage from '@/views/DocumentsPage.vue'
import EmployeeListPage from '@/views/EmployeeListPage.vue'
import CalendarPage from '@/views/CalendarPage.vue'
import HelpCenter from '@/views/HelpCenter.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'

const routes = [
  {
    path: '/',
    component: LoginPage,
  },
  {
    path: '/help-center',
    component: HelpCenter,
  },
  {
    path: '/privacy-policy',
    component: PrivacyPolicy,
  },

  {
    path: '/',
    component: MainLayout,

    children: [
      {
        path: 'profile',
        component: ProfilePage,
      },
      {
        path: 'dashboard',
        component: DashboardPage,
      },

      {
        path: 'documents',
        component: DocumentsPage,
      },
            {
        path: 'employees',
        component: EmployeeListPage,
        meta: { adminOnly: true }
      },
      {
        path: 'calendar',
        component: CalendarPage,
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(to => {
  const role = localStorage.getItem('role')

  if (to.meta.adminOnly && role !== 'admin') {
    return '/profile'
  }
})

export default router
