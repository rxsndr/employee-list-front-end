<template>
  <v-app class="privacy-policy">
    <v-app-bar
      app
      fixed
      color="white"
      elevation="2"
      height="70"
      class="sticky-bar"
    >
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
            Sign in
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="pt-0 mt-0">
      <section id="policy" class="policy-section">
        <v-container class="page-container">
          <v-row align="start">
            <v-col cols="12" md="4" lg="3" class="policy-sidebar-col">
              <aside class="policy-nav">
                <div class="text-overline primary--text mb-3">Policy Sections</div>
                <a
                  v-for="section in policySections"
                  :key="section.id"
                  :href="`#${section.id}`"
                  class="policy-nav-link"
                >
                  <span>{{ section.title }}</span>
                </a>
              </aside>
            </v-col>

            <v-col cols="12" md="8" lg="9">
              <v-card class="policy-card pa-6 pa-md-8" elevation="1" rounded="lg">
                <div class="mb-8">
                  <h2 class="section-title font-weight-bold mb-4 mt-1 primary--text">
                    Privacy Policy
                  </h2>
                  <p class="section-subtitle text-medium-emphasis">
                    Welcome to ALss App , a product operated by ALS Solution Software.
                  </p>

                  <p class="section-subtitle text-medium-emphasis">
                    We are committed to protecting your privacy and ensuring that your personal
                    information is handled in a safe and responsible manner. This Privacy Policy
                    explains how we collect, use, store, and protect your information when you use
                    our website, mobile application, caregiving system, onboarding tools, and
                    related services.
                  </p>

                  <p class="section-subtitle text-medium-emphasis">
                    By using ALss App, you agree to the collection and use of information in
                    accordance with this Privacy Policy.
                  </p>
                </div>

                <article
                  v-for="section in policySections"
                  :id="section.id"
                  :key="section.id"
                  class="policy-block"
                >
                  <div class="policy-block-heading">
                    <h3>{{ section.title }}</h3>
                  </div>
                  <p v-for="paragraph in section.paragraphs" :key="paragraph">
                    {{ paragraph }}
                  </p>
                  <div v-for="group in section.groups || []" :key="group.title" class="policy-list-group">
                    <h4>{{ group.title }}</h4>
                    <ul>
                      <li v-for="item in group.items" :key="item">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                  <ul v-if="section.items && section.items.length">
                    <li v-for="item in section.items" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                  <p v-for="paragraph in section.afterParagraphs || []" :key="paragraph" class="mt-4">
                    {{ paragraph }}
                  </p>
                </article>
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
      navItems: [
        { label: 'Help Center', href: '/help-center' }
      ],
      policySections: [
        {
          id: 'information-we-collect',
          icon: 'mdi-database-outline',
          title: '1. Information We Collect',
          paragraphs: [
            'We collect different types of information depending on how you use the system.',
          ],
          groups: [
            {
              title: 'Personal Information',
              items: [
                'Full name',
                'Email address',
                'Phone number',
                'Company or facility name',
                'Employee or caregiver information',
                'Resident-related information (as authorized by your organization)',
                'Login credentials',
              ],
            },
            {
              title: 'Operational Data',
              items: [
                'Caregiver schedules and assignments',
                'Resident admission and care records',
                'Onboarding forms and documentation',
                'Activity logs and reports',
                'Uploaded files (images, documents, records)',
              ],
            },
            {
              title: 'Technical Information',
              items: [
                'Device information (model, OS)',
                'IP address',
                'Browser type',
                'App usage data',
                'Crash reports and diagnostics',
                'Access timestamps',
              ],
            },
          ],
          items: [],
        },
        {
          id: 'how-we-use-information',
          icon: 'mdi-clipboard-check-outline',
          title: '2. How We Use Information',
          paragraphs: [
            'We use the information we collect to:',
          ],
          items: [
            'Provide and operate the ALSS App services',
            'Manage caregiving, onboarding, and resident workflows',
            'Maintain and secure user accounts',
            'Improve system performance and reliability',
            'Send important notifications and updates',
            'Provide customer and technical support',
            'Monitor system usage and prevent fraud or unauthorized access',
            'Comply with legal and regulatory requirements',
          ],
        },
        {
          id: 'sharing-information',
          icon: 'mdi-share-variant-outline',
          title: '3. Sharing of Information',
          paragraphs: [
            'We do not sell or rent personal information.',
            'We may share information only in the following cases:',
          ],
          items: [
            'With authorized administrators within your organization',
            'With caregivers, staff, or personnel assigned to your facility',
            'With trusted third-party service providers (e.g., cloud hosting, analytics, authentication)',
            'When required by law, regulation, or legal process',
            'To protect system security, users, or organizational integrity',
          ],
        },
        {
          id: 'security',
          icon: 'mdi-security',
          title: '4. Data Security',
          paragraphs: [
            'We take data security seriously and implement appropriate safeguards to protect your information, including:',
          ],
          items: [
            'Encrypted data transmission',
            'Secure authentication systems',
            'Role-based access control',
            'System monitoring and logging',
            'Secure cloud infrastructure',
          ],
          afterParagraphs: [
            'While we use strong security measures, no system can guarantee 100% security of data transmitted or stored electronically.',
          ],
        },
        {
          id: 'retention',
          icon: 'mdi-timer-sand',
          title: '5. Data Retention',
          paragraphs: [
            'We retain personal and operational data only as long as necessary to:',
          ],
          items: [
            'Provide services effectively',
            'Maintain operational records',
            'Support administrative and caregiving needs',
            'Comply with legal obligations',
            'Resolve disputes and enforce agreements',
          ],
          afterParagraphs: [
            'When data is no longer required, it is securely deleted or anonymized.',
          ],
        },
        {
          id: 'rights',
          icon: 'mdi-account-lock-outline',
          title: '6. User Rights',
          paragraphs: [
            'Depending on your role and organization, you may request to:',
          ],
          items: [
            'Access your personal data',
            'Correct inaccurate or outdated information',
            'Request deletion of certain data',
            'Restrict or object to processing',
            'Withdraw access permissions (where applicable)',
          ],
          afterParagraphs: [
            'Requests can be submitted through your system administrator or support channel.',
          ],
        },
        {
          id: 'cookies',
          icon: 'mdi-cookie-outline',
          title: '7. Cookies and Tracking Technologies',
          paragraphs: [
            'We may use cookies and similar technologies to:',
          ],
          items: [
            'Improve user experience',
            'Maintain session login',
            'Analyze system performance',
            'Understand usage patterns',
          ],
          afterParagraphs: [
            'You may disable cookies through your browser settings, but some features may not function properly.',
          ],
        },
        {
          id: 'third-party-services',
          icon: 'mdi-cloud-lock-outline',
          title: '8. Third-Party Services',
          paragraphs: [
            'ALSS App may use third-party services to support system functionality, including:',
          ],
          items: [
            'Cloud hosting services',
            'Analytics tools',
            'Authentication providers',
            'Notification and messaging services',
            'Database and storage providers',
          ],
          afterParagraphs: [
            'These services operate under their own privacy policies.',
          ],
        },
        {
          id: 'children',
          icon: 'mdi-account-child-outline',
          title: "9. Children's Privacy",
          paragraphs: [
            'Our services are not intended for direct use by children under 13 without proper authorization from a parent, guardian, or supervising organization.',
            'We do not knowingly collect personal data from children without appropriate consent.',
          ],
          items: [],
        },
        {
          id: 'changes',
          icon: 'mdi-file-document-refresh-outline',
          title: '10. Changes to This Privacy Policy',
          paragraphs: [
            'We may update this Privacy Policy from time to time to reflect system updates, legal requirements, or operational changes.',
            'Any changes will be posted within the application or website. Continued use of the service means you accept the updated policy.',
          ],
          items: [],
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

  methods: {
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

.privacy-policy,
.privacy-policy * {
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

.hero-privacy-card {
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

.hero-privacy-card:hover {
  transform: rotate(0) translateY(-6px);
}

.policy-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: #f5f7fa;
  border-bottom: 1px solid rgba(10, 48, 60, 0.08);
}

.policy-preview-header div {
  display: flex;
  gap: 8px;
}

.policy-preview-header span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d4dde2;
}

.policy-preview-body {
  padding: clamp(28px, 5vw, 56px);
}

.preview-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 28px;
  color: #598392;
  font-size: 0.84rem;
  font-weight: 600;
  background: rgba(89, 131, 146, 0.1);
  border-radius: 999px;
}

.policy-preview-body h2 {
  margin: 0 0 10px;
  color: #0a303c;
  font-size: clamp(2.1rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.05;
}

.policy-preview-body p {
  margin: 0 0 30px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

.preview-lines {
  display: grid;
  gap: 14px;
}

.preview-lines span {
  display: block;
  height: 12px;
  background: linear-gradient(90deg, #dbe4e8, #f5f7fa);
  border-radius: 999px;
}

.section-padding {
  padding: 50px 0;
}

.section-title {
  font-size: 2.5rem;
  line-height: 1.2;
}

.section-subtitle {
  max-width: 900px;
  font-size: 1.125rem;
}

.feature-card-title {
  font-size: 1.25rem;
}

.feature-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-8px);
}

.feature-icon-container {
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon-container {
  transform: scale(1.1) rotate(5deg);
}

.policy-section {
  padding: 25px;
  background: #ffffff;
}

.policy-sidebar-col {
  position: sticky;
  top: 96px;
  align-self: flex-start;
  z-index: 2;
  height: fit-content;
}

.policy-nav {
  padding: 24px;
  background: #f5f7fa;
  border-radius: 12px;
}

.policy-nav-link {
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

.policy-card {
  overflow: hidden;
}

.policy-block {
  padding: 28px 0;
  border-top: 1px solid rgba(10, 48, 60, 0.1);
  scroll-margin-top: 90px;
}

.policy-block:first-of-type {
  border-top: 0;
}

.policy-block-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.policy-block h3 {
  margin: 0;
  color: #0a303c;
  font-size: 1.35rem;
  font-weight: 700;
}

.policy-block p,
.policy-block li {
  color: rgba(0, 0, 0, 0.68);
  font-size: 1rem;
  line-height: 1.8;
}

.policy-block p {
  margin: 0 0 14px;
}

.policy-list-group {
  margin-top: 18px;
}

.policy-list-group h4 {
  margin: 0 0 10px;
  color: #344a53;
  font-size: 1.05rem;
  font-weight: 700;
}

.policy-block ul {
  display: grid;
  gap: 10px;
  padding-left: 22px;
  margin: 14px 0 0;
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

.footer-text {
  padding: 45px;
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

  .hero-privacy-card {
    margin-top: 32px;
  }

  .section-padding,
  .policy-section {
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

  .policy-sidebar-col {
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

  .policy-preview-body h2 {
    font-size: 2rem;
  }

  .policy-block h3 {
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
