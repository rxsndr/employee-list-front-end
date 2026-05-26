import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'

import LoginPage from '@/views/LoginPage.vue'
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
      },
      {
        path: 'calendar',
        component: CalendarPage,
      }
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
