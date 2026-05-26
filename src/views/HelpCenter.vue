<template>
  <v-app class="help-center-page">
    <v-app-bar app fixed color="white" elevation="2" height="70" class="sticky-bar">
      <v-container class="page-container">
        <div class="nav-shell">
          <RouterLink to="/" class="brand-link">
            <v-img
              :src="logo"
              width="70"
              height="70"
              class="mr-2"
              contain
              alt="ALSS - Assisted Living Solution Software Logo"
            />
            <div>
              <div class="brand-title">ALss</div>
              <div class="brand-subtitle">Assisted Living Solution Software</div>
            </div>
          </RouterLink>

          <div class="desktop-nav">
            <a
              v-for="item in navItems"
              :key="item.label"
              :href="item.href"
              class="app-bar-link primary--text"
            >
              {{ item.label }}
            </a>
            <v-btn
              href="/"
              color="blue-grey-darken-4"
              variant="flat"
              rounded="lg"
              class="ml-2"
            >
              Get Started
            </v-btn>
          </div>

          <v-app-bar-nav-icon
            class="mobile-nav-button"
            color="blue-grey-darken-4"
            @click="drawer = !drawer"
          />
        </div>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
      width="280"
      class="mobile-drawer"
    >
      <v-list class="pt-4">
        <v-list-item
          v-for="item in navItems"
          :key="item.label"
          :href="item.href"
          class="drawer-item"
          rounded="lg"
          :active="false"
          :ripple="false"
          base-color="transparent"
          @click="drawer = false"
        >
          <v-list-item-title class="font-weight-medium">
            {{ item.label }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item class="px-3 mt-4">
          <v-btn
            href="https://portal.alsolutionsoftware.com"
            target="_blank"
            color="blue-grey-darken-4"
            variant="flat"
            rounded="lg"
            block
          >
            Sign In
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="pt-0 mt-0">
      <section id="categories" class="help-content-section">
        <v-container class="page-container">
          <v-row align="start">
            <v-col cols="12" md="4" lg="3" class="help-sidebar-col">
              <aside class="help-nav">
                <div class="text-overline primary--text mb-3">Help Topics</div>
                <a
                  v-for="category in helpCategories"
                  :key="category.id"
                  :href="`#${category.id}`"
                  class="help-nav-link"
                >
                  <v-icon :icon="category.icon" size="18" />
                  <span>{{ category.title }}</span>
                </a>
              </aside>
            </v-col>

            <v-col cols="12" md="8" lg="9">
              <div class="content-heading mb-7">
                <div class="text-overline primary--text mb-2">Browse Help</div>
                <h2 class="section-title font-weight-bold mb-3 primary--text">
                  Help Center Articles
                </h2>
                <p class="section-subtitle text-medium-emphasis">
                  Explore setup steps, daily workflows, troubleshooting articles, and support
                  options for your facility team.
                </p>
              </div>

              <article
                v-for="category in filteredCategories"
                :id="category.id"
                :key="category.id"
                class="help-category"
              >
                <div class="category-heading">
                  <v-icon :icon="category.icon" color="#598392" size="28" />
                  <div>
                    <h3>{{ category.title }}</h3>
                    <p>{{ category.description }}</p>
                  </div>
                </div>

                <v-row>
                  <v-col v-for="article in category.articles" :key="article.title" cols="12" md="6">
                    <v-card class="article-card pa-5" elevation="1" rounded="lg">
                      <div class="article-meta">
                        <v-icon :icon="article.icon" color="#598392" size="20" />
                        <span>{{ article.type }}</span>
                      </div>
                      <h4>{{ article.title }}</h4>
                      <p>{{ article.description }}</p>
                    </v-card>
                  </v-col>
                </v-row>
              </article>

              <v-card v-if="hasNoResults" class="empty-card pa-8 text-center" elevation="1" rounded="lg">
                <v-icon icon="mdi-file-search-outline" color="#598392" size="42" />
                <h3 class="primary--text mt-4 mb-2">No results found</h3>
                <p class="text-medium-emphasis mb-0">
                  Try a different keyword or contact support for direct assistance.
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </v-main>

    <v-footer class="text-center d-flex flex-column" color="white">
      <div class="footer-text text-body-2 font-weight-regular opacity-60">
        Assisted Living Solution Software LLC 2025. All rights reserved.
      </div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'MainLayout',

  data() {
    return {
      drawer: false,
      logo: 'https://alsolutionsoftware.com/logo-c.png',
      searchQuery: '',
      navItems: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
      ],
      previewItems: [
        {
          icon: 'mdi-monitor-dashboard',
          title: 'Admin Web App',
          text: 'Facility setup, users, records, and reports.',
        },
        {
          icon: 'mdi-clipboard-text-outline',
          title: 'Onboarding',
          text: 'Resident intake forms, documents, and approvals.',
        },
        {
          icon: 'mdi-heart-pulse',
          title: 'Caregiver',
          text: 'Daily tasks, care notes, and medication tracking.',
        },
      ],
      productModules: [
        {
          icon: 'mdi-monitor-dashboard',
          title: 'Admin Web App',
          description: 'Manage facilities, users, residents, schedules, documents, and reports.',
          color: '#009688',
        },
        {
          icon: 'mdi-clipboard-text',
          title: 'Intake',
          description: 'Complete resident onboarding, digital forms, and document signing.',
          color: '#1E88E5',
        },
        {
          icon: 'mdi-heart-pulse',
          title: 'Caregiver',
          description: 'Track daily care, medications, activities, and resident notes.',
          color: '#FF5252',
        },
        {
          icon: 'mdi-account-check',
          title: 'Visitor Login',
          description: 'Support visitor check-in, access logs, and facility entry records.',
          color: '#37474F',
        },
      ],
      helpCategories: [
        {
          id: 'getting-started',
          icon: 'mdi-rocket-launch-outline',
          title: 'Getting Started',
          description: 'Learn the basics of setting up and using ALss App.',
          articles: [
            {
              icon: 'mdi-map-outline',
              type: 'Guide',
              title: 'Start using ALss App',
              description: 'Overview of the main areas, account access, and first steps.',
            },
            {
              icon: 'mdi-domain',
              type: 'Setup',
              title: 'Set up your facility profile',
              description: 'Add facility details, contact information, and operational settings.',
            },
            {
              icon: 'mdi-account-multiple-plus',
              type: 'Guide',
              title: 'Invite staff members',
              description: 'Create users and assign the right permissions for each role.',
            },
          ],
        },
        {
          id: 'account-access',
          icon: 'mdi-account-lock-outline',
          title: 'Account and Access',
          description: 'Get help with signing in, roles, permissions, and account security.',
          articles: [
            {
              icon: 'mdi-login',
              type: 'Account',
              title: 'Sign in to the portal',
              description: 'Access your ALss account and recover login details when needed.',
            },
            {
              icon: 'mdi-shield-account-outline',
              type: 'Security',
              title: 'Understand user roles',
              description: 'Review administrator, caregiver, intake, and visitor access levels.',
            },
            {
              icon: 'mdi-lock-reset',
              type: 'Troubleshooting',
              title: 'Reset a password',
              description: 'Steps to recover access or help a staff member reset credentials.',
            },
          ],
        },
        {
          id: 'resident-onboarding',
          icon: 'mdi-file-document-edit-outline',
          title: 'Resident Onboarding',
          description: 'Support resident intake, form completion, signatures, and records.',
          articles: [
            {
              icon: 'mdi-file-plus-outline',
              type: 'Guide',
              title: 'Create a resident packet',
              description: 'Start an intake packet and collect the required resident information.',
            },
            {
              icon: 'mdi-draw',
              type: 'Guide',
              title: 'Complete digital signatures',
              description: 'Send forms, review signing status, and finalize signed documents.',
            },
            {
              icon: 'mdi-folder-upload-outline',
              type: 'Records',
              title: 'Upload resident documents',
              description: 'Attach images, files, and supporting records to a resident profile.',
            },
          ],
        },
        {
          id: 'caregiver-tasks',
          icon: 'mdi-heart-pulse',
          title: 'Caregiver Tasks',
          description: 'Daily care workflows for assigned staff and caregivers.',
          articles: [
            {
              icon: 'mdi-calendar-check-outline',
              type: 'Workflow',
              title: 'View assigned tasks',
              description: 'See daily assignments, schedules, and resident care tasks.',
            },
            {
              icon: 'mdi-pill',
              type: 'Care',
              title: 'Track medication activity',
              description: 'Document medication-related care items and completion notes.',
            },
            {
              icon: 'mdi-note-edit-outline',
              type: 'Care',
              title: 'Submit care notes',
              description: 'Record observations, updates, and daily care details.',
            },
          ],
        },
        {
          id: 'visitor-login',
          icon: 'mdi-account-check-outline',
          title: 'Visitor Login',
          description: 'Help with visitor sign-in, sign-out, and access logs.',
          articles: [
            {
              icon: 'mdi-account-arrow-right-outline',
              type: 'Workflow',
              title: 'Check in a visitor',
              description: 'Record visitor details and arrival information at the facility.',
            },
            {
              icon: 'mdi-account-arrow-left-outline',
              type: 'Workflow',
              title: 'Check out a visitor',
              description: 'Complete visitor sign-out and keep access logs current.',
            },
            {
              icon: 'mdi-clipboard-list-outline',
              type: 'Reports',
              title: 'Review visitor history',
              description: 'Find visitor activity and access records for operational review.',
            },
          ],
        },
        {
          id: 'troubleshooting',
          icon: 'mdi-tools',
          title: 'Troubleshooting',
          description: 'Resolve common issues with login, performance, files, and workflows.',
          articles: [
            {
              icon: 'mdi-wifi-alert',
              type: 'Troubleshooting',
              title: 'App is loading slowly',
              description: 'Check browser, network, and device steps before contacting support.',
            },
            {
              icon: 'mdi-file-alert-outline',
              type: 'Troubleshooting',
              title: 'Document upload failed',
              description: 'Review file size, type, connection, and retry guidance.',
            },
            {
              icon: 'mdi-alert-circle-outline',
              type: 'Troubleshooting',
              title: 'Report a technical issue',
              description: 'Gather details support needs to diagnose app or workflow problems.',
            },
          ],
        },
      ],
      popularArticles: [
        {
          icon: 'mdi-account-multiple-plus-outline',
          title: 'Invite new users',
          description: 'Add staff members and assign permissions based on their facility role.',
        },
        {
          icon: 'mdi-file-document-check-outline',
          title: 'Complete resident intake',
          description: 'Prepare documents, collect signatures, and finalize onboarding records.',
        },
        {
          icon: 'mdi-lock-reset',
          title: 'Reset account access',
          description: 'Recover login access and keep accounts protected.',
        },
      ],
      contactItems: [
        {
          icon: 'mdi-map-marker',
          label: '6321 E Evans Drive, Scottsdale AZ 85254',
        },
        {
          icon: 'mdi-phone',
          label: '480.578.1939',
          href: 'tel:+14805781939',
        },
        {
          icon: 'mdi-fax',
          label: '480.687.4134',
        },
        {
          icon: 'mdi-email',
          label: 'assistedlivingsolutionsoftware@gmail.com',
          href: 'mailto:assistedlivingsolutionsoftware@gmail.com',
        },
      ],
    }
  },

  computed: {
    normalizedSearch() {
      return this.searchQuery.trim().toLowerCase()
    },

    filteredModules() {
      if (!this.normalizedSearch) return this.productModules

      return this.productModules.filter(module => this.matchesSearch(module))
    },

    filteredCategories() {
      if (!this.normalizedSearch) return this.helpCategories

      return this.helpCategories
        .map(category => {
          const categoryMatches = this.matchesSearch(category)
          const articles = category.articles.filter(article => this.matchesSearch(article))

          return {
            ...category,
            articles: categoryMatches ? category.articles : articles,
          }
        })
        .filter(category => category.articles.length)
    },

    filteredPopularArticles() {
      if (!this.normalizedSearch) return this.popularArticles

      return this.popularArticles.filter(article => this.matchesSearch(article))
    },

    hasNoResults() {
      return (
        this.normalizedSearch &&
        !this.filteredModules.length &&
        !this.filteredCategories.length &&
        !this.filteredPopularArticles.length
      )
    },
  },

  methods: {
    matchesSearch(item) {
      return Object.values(item)
        .filter(value => typeof value === 'string')
        .some(value => value.toLowerCase().includes(this.normalizedSearch))
    },

    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId)

      if (section) {
        const y = section.getBoundingClientRect().top + window.pageYOffset - 70
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    },

    adjustColor(color, amount) {
      const clamp = value => Math.min(Math.max(value, 0), 255)
      const hex = parseInt(color.replace('#', ''), 16)
      const red = clamp((hex >> 16) + amount)
      const green = clamp(((hex >> 8) & 255) + amount)
      const blue = clamp((hex & 255) + amount)

      return `#${((red << 16) | (green << 8) | blue).toString(16).padStart(6, '0')}`
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

:global(html) {
  scroll-behavior: smooth;
}

.help-center-page,
.help-center-page * {
  font-family: 'Poppins', sans-serif !important;
}

.page-container {
  max-width: 1366px !important;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}

.sticky-bar {
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
}

.nav-shell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.brand-link {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}

.brand-title,
.brand-subtitle {
  color: #0a303c;
  line-height: 1.2;
}

.brand-title {
  font-weight: 700;
}

.brand-subtitle {
  line-height: 1;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.mobile-nav-button {
  display: none;
}

.app-bar-link {
  position: relative;
  padding: 8px 4px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.app-bar-link::after {
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 2px;
  content: '';
  background: #598392;
  transition: all 0.3s ease;
  transform: translate(-50%);
}

.app-bar-link:hover {
  color: #598392 !important;
}

.app-bar-link:hover::after {
  width: 100%;
}

.mobile-drawer {
  max-width: 280px !important;
}

.drawer-item {
  margin: 0 12px 8px;
  transition: all 0.3s ease;
}

.drawer-item:hover {
  background-color: rgba(89, 131, 146, 0.1);
  transform: translate(-4px);
}

.drawer-item .v-list-item-title {
  color: #0a303c;
}

.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 90vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa, #e8ecf1);
}

.hero-container,
.hero-content,
.content-wrapper,
.hero-image-col {
  position: relative;
  z-index: 10;
}

.hero-eyebrow {
  font-weight: 600;
  letter-spacing: 2px;
}

.hero-title {
  font-size: 3rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
}

.help-search {
  max-width: 640px;
  box-shadow: 0 18px 36px rgba(10, 48, 60, 0.12);
}

.help-preview-card {
  position: relative;
  width: min(100%, 570px);
  margin: 0 auto;
  overflow: hidden;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 26px 60px rgba(10, 48, 60, 0.18);
  transform: rotate(1deg);
  transition: transform 0.4s ease;
}

.help-preview-card:hover {
  transform: rotate(0) translateY(-6px);
}

.preview-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 24px;
  background: #f5f7fa;
  border-bottom: 1px solid rgba(10, 48, 60, 0.08);
}

.preview-toolbar span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d4dde2;
}

.preview-toolbar .v-icon {
  margin-left: auto;
}

.preview-content {
  padding: clamp(28px, 5vw, 48px);
}

.preview-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 24px;
  color: #598392;
  font-size: 0.84rem;
  font-weight: 600;
  background: rgba(89, 131, 146, 0.1);
  border-radius: 999px;
}

.preview-content h2 {
  margin: 0 0 10px;
  color: #0a303c;
  font-size: clamp(2.1rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.05;
}

.preview-content p {
  margin: 0 0 24px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

.preview-list {
  display: grid;
  gap: 12px;
}

.preview-row {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
  padding: 14px;
  background: #f5f7fa;
  border-radius: 8px;
}

.preview-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  color: #ffffff;
  background: #598392;
  border-radius: 10px;
}

.preview-row strong,
.preview-row span {
  display: block;
}

.preview-row strong {
  color: #0a303c;
  font-size: 0.95rem;
}

.preview-row span {
  margin-top: 3px;
  color: rgba(0, 0, 0, 0.56);
  font-size: 0.82rem;
}

.section-padding {
  padding: 80px 0;
}

.section-title {
  font-size: 2.5rem;
  line-height: 1.2;
}

.section-subtitle {
  max-width: 700px;
  font-size: 1.125rem;
}

.feature-card-title {
  font-size: 1.25rem;
}

.feature-card,
.article-card,
.popular-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-icon-container {
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon-container {
  transform: scale(1.1) rotate(5deg);
}

.help-content-section {
  padding: 25px;
  background: #ffffff;
}

.help-sidebar-col {
  position: sticky;
  top: 96px;
  align-self: flex-start;
  z-index: 2;
  height: fit-content;
}

.help-nav {
  padding: 24px;
  background: #f5f7fa;
  border-radius: 12px;
}

.help-nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  color: #344a53;
  font-size: 0.92rem;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid rgba(10, 48, 60, 0.08);
  transition: color 0.2s ease, transform 0.2s ease;
}

.help-category {
  padding: 28px 0;
  border-top: 1px solid rgba(10, 48, 60, 0.1);
  scroll-margin-top: 90px;
}

.help-category:first-of-type {
  border-top: 0;
}

.category-heading {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.category-heading h3 {
  margin: 0;
  color: #0a303c;
  font-size: 1.35rem;
  font-weight: 700;
}

.category-heading p,
.article-card p,
.popular-card p {
  color: rgba(0, 0, 0, 0.68);
  line-height: 1.7;
}

.category-heading p {
  margin: 4px 0 0;
}

.article-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  color: #598392;
  font-size: 0.82rem;
  font-weight: 700;
}

.article-card h4,
.popular-card h3,
.empty-card h3 {
  font-weight: 700;
}

.article-card h4 {
  margin: 0 0 10px;
  color: #0a303c;
  font-size: 1.08rem;
}

.article-card p,
.popular-card p {
  margin: 0;
}

.popular-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  color: #598392;
  font-weight: 700;
}

.support-card {
  border-top: 4px solid #598392;
}

.contact-wrap {
  overflow: visible;
  text-overflow: unset;
  white-space: normal;
}

.footer-text {
  transform: translateY(-6px);
}

.gradient-text {
  background: linear-gradient(135deg, #598392, #7fa9b8);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}

.backgroundGrey {
  background-color: #f5f7fa;
}

.primary--text {
  color: #0a303c !important;
}

.lightP--text {
  color: #598392 !important;
}

.btn-hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.btn-hover:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.blob {
  position: absolute;
  z-index: 1;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
}

.blob-3 {
  top: 50%;
  right: 10%;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #7fa9b8, #598392);
  animation-delay: -10s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0) scale(1);
  }

  33% {
    transform: translate(30px, -30px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@media (min-width: 961px) and (max-width: 1440px) {
  .page-container {
    padding-left: 60px;
    padding-right: 60px;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1.05rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .feature-card-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 960px) {
  .page-container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .desktop-nav {
    display: none;
  }

  .mobile-nav-button {
    display: inline-flex;
  }

  .hero-section {
    min-height: auto;
    padding: 48px 0 64px;
  }

  .help-preview-card {
    margin-top: 32px;
  }

  .section-padding,
  .help-content-section {
    padding: 60px 0;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .help-sidebar-col {
    top: 82px;
  }
}

@media (max-width: 600px) {
  .page-container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .brand-subtitle {
    max-width: 160px;
    font-size: 0.8rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-subtitle {
    font-size: 0.9375rem;
  }

  .feature-card-title {
    font-size: 1.125rem;
  }

  .preview-content h2 {
    font-size: 2rem;
  }

  .category-heading {
    flex-direction: column;
  }

  .category-heading h3 {
    font-size: 1.15rem;
  }

  .blob-3 {
    width: 200px;
    height: 200px;
    opacity: 0.2;
    filter: blur(60px);
  }
}
</style>
