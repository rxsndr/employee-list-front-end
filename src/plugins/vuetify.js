import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
  defaults: {
    VBtn: { style: 'font-family: DM Sans, sans-serif; text-transform: none; letter-spacing: 0;' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
  },
})