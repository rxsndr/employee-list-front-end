<template>
  <div class="text-center pa-4">
    <v-dialog v-model="dialog" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar color="#0A303C">
          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="close()" size="25" class="mr-5">mdi-close</v-icon>
        </v-toolbar>
        <div class="text-center pa-2">
          <v-row class="d-flex justify-center">
            <v-col cols="12" sm="6" md="6">
                <div class="pa-5">
                    <p class="res-styles">Policies and Procedure</p>
                    <v-divider :thickness="2" class="pb-4"></v-divider>
                    <v-row class="rows-styles">
                        <v-col cols="12">
                            <div>
                                <p class="policy-text">
                                    <b>POLICY TOPIC : ELOPEMENT</b> <br><br>
                                    <b>RESPONSIBLE PERSON : ALL PERSONNEL</b> <br><br>
                                    <b>POLICY STATEMENT :</b> <br><br>
                                    Follow established standard procedures on resident elopements and why the staff should be concerned. Resident elopements
                                    happen so infrequently, that it is not uncommon for a facility not to have a written elopement plan and program – this
                                    is a mistake that can lead to litigation and disciplinary action. Many elopements occur in the late afternoon and evening
                                     hours (due to sundowners syndrome) when staff members are not around.
                                    <br><br>
                                    PROCEDURES
                                    <br><br>
                                    1. A Risk Assessment method should be developed to identify residents who are at risk for elopement, such as known wanderers.
                                    A risk assessment should be completed upon resident admit and quarterly thereafter, as indicated. Some diagnoses pertinent to the risk of elopement include: <br>
                                    • Delusions, hallucinations<br>
                                    • Alzheimer's Disease, other dementia. <br>
                                    • Anxiety disorder, manic depression, schizophrenia <br>
                                    • History of wandering<br>
 
                                    2. Appropriate interventions should be implemented once a resident has been identified as being high-risk. These should include:<br>
                                    • Behavior logs – document wandering tendencies. Once these behaviors have been exhibited, the potential for elopement increases.<br>
                                    • Supervision and periodic checks as possible. A secured Alzheimer's Unit is best.<br>
                                    • Ongoing activity programs to minimize aimless wandering tendencies. <br>
                                    • Identification bracelets and/or alarms worn by residents, as indicated. Consider using an ankle/wrist band system with residents who display wandering protocol.<br>
                                    • Exit doors with alarms or keypads that are tested daily/weekly according to manufacturer recommendations and documented. The interior stairwell doors
                                    should be equipped with alarms reporting to the main hallway that will also detect <br>
                                </p>
                            </div>
                        </v-col>
                    </v-row>
 
                    <!-- Completed: show View only -->
                      <v-row class="d-flex justify-center mt-10" v-if="isCompleted">
                        <v-col cols="8" sm="4">
                          <viewForm type="elopement" />
                        </v-col>
                      </v-row>
 
                    <!-- Not completed: Generate & Preview + Save -->
                    <v-row class="d-flex justify-center pt-10" v-else>
                        <v-col cols="8" sm="4">
                          <v-btn
                            color="#0A303C"
                            variant="flat"
                            rounded="lg"
                            block
                            @click="handleGenerate(false)"
                          >
                            Save
                          </v-btn>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
          </v-row>
        </div>
      </v-card>
 
      <LoadingOverlay v-model="isOverlay" text="Saving Form. Please Wait..." />
      <LoadingOverlay v-model="initialLoading" text="Please Wait..." />
    </v-dialog>
  </div>
 
  <!-- print_elopement: renders hidden template → generates blob → emits pdf_ready -->
  <printElopement
    v-if="showPrintElopement"
    :residentId="residentId"
    :formNumber="formNumber"
    :residentName="residentName"
    :birthdate="birthdate"
    :elopementData="elopementData"
    :preview="previewMode"  
    @pdf_ready="onPdfReady"
    @close_dialog="showPrintElopement = false"
    @form_submitted="onPrintFormSubmitted"
  />
</template>
 
 
<script>
import axios from '@/axios'
import utils from '@/utils'
import constant from '@/constant'
 
import viewForm from '@/components/Forms/DNRForm/view_pap.vue'
import LoadingOverlay from '@/components/App/loading_overlay.vue'
import { useFacilityStore } from '@/store/facilityStore'
import printElopement from '@/components/Forms/PoliciesAndProcedureForm/print_elopement.vue'
 
export default {
  name: 'Policies and Procedure Form Page',
 
  props: {
    residentId:    [String, Number],
    formNumber:    [String, Number],
    residentName:  String,
    birthdate:     String,
    elopementData: {
      type: Object,
      default: null,
    },
    previewMode: true,
  },
 
  data() {
    return {
      isOverlay:          false,
      initialLoading:     false,
      dialog:             true,
      showPrintElopement: false,
      previewMode:        true,
      user: JSON.parse(localStorage.getItem('user')),
      pendingSave: false,
    }
  },
 
  components: {
    viewForm,
    LoadingOverlay,
    printElopement,
  },
 
  computed: {
    facility() {
      return useFacilityStore().selectedFacility
    },
    isCompleted() {
      return this.elopementData?.status === 'completed'
    },
  },
 
  methods: {
    handleGenerate(shouldPreview) {
      this.previewMode = shouldPreview;
      this.showPrintElopement = true;
    },
    // ── Called when print_elopement emits the generated blob ──────────────
    async onPdfReady(blob) {
      if (!this.facility?.id) {
        this.$toast.error('Facility not found', { duration: 3000 })
        return
      }
 
      this.isOverlay = true
 
      try {
        const formData = new FormData()
        formData.append('facility_id', this.facility.id)
        formData.append(
          'file',
          blob,
          `Elopement_Policy_${this.residentName || 'form'}.pdf`
        )
 
        const response = await axios.post(
          utils._api(constant.save_facility_elopement),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
 
        if (response.data) {
          this.$toast.success(response.data.message, {
            duration:    3000,
            position:    'top-right',
            dismissible: true,
          })
          this.dialog = false
          this.$emit('form_submitted', 'success')
        }
      } catch (error) {
        console.error('Error uploading elopement PDF:', error)
        const message = error.response?.data?.message || 'Service Error'
        this.$toast.error(message, { duration: 3000 })
      } finally {
        this.isOverlay = false
      }
    },
 
    onPrintFormSubmitted(result) {
      this.showPrintElopement = false
      this.$emit('form_submitted', result)
    },
 
    // ── Save without generating PDF (status only) ─────────────────────────
    async saveElopement() {
      if (!this.facility?.id) {
        this.$toast.error('Facility not found', { duration: 3000 })
        return
      }
 
      this.isOverlay = true
 
      try {
        const response = await axios.post(
          utils._api(constant.save_facility_elopement),
          { facility_id: this.facility.id },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
 
        if (response.data) {
          this.$toast.success(response.data.message, {
            duration:    3000,
            position:    'top-right',
            dismissible: true,
          })
          this.dialog = false
          this.$emit('form_submitted', 'success')
        }
      } catch (error) {
        console.error('Error saving elopement:', error)
        const message = error.response?.data?.message || 'Service Error'
        this.$toast.error(message, { duration: 3000 })
      } finally {
        this.isOverlay = false
      }
    },
 
    async getElopement() {
      if (!this.facility?.id) return
      try {
        const response = await axios.post(
          utils._api(constant.get_facility_elopement),
          { facility_id: this.facility.id },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept:         'application/json',
              Authorization:  `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        const resData = response.data?.data?.elopement
        if (resData) console.log('Elopement fetched:', resData)
      } catch (error) {
        console.error('Error fetching elopement:', error)
      }
    },
 
    close() {
      this.dialog = false
      this.$emit('close_dialog')
    },
  },
 
  async mounted() {
    this.dialog = true
    if (this.elopementData) {
      this.initialLoading = true
      await this.getElopement()
      this.initialLoading = false
    }
  },
}
</script>
 
<style>
.res-styles {
    font-weight: bold;
    font-size: 19px;
    text-align: center;
    margin-bottom: 30px;
}
.rows-styles {
    margin-bottom: -45px;
}
.policy-text {
    text-align: justify;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    font-size: 16px;
}
</style>
 