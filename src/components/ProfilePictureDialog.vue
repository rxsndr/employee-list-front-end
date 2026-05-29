<template>
  <v-dialog v-model="internalOpen" max-width="520">
    <v-card rounded="lg" elevation="0" border>
      <v-card-title class="dialog-header">
        <div>
          <p class="dialog-title">Profile Picture</p>
          <p class="dialog-sub">
            {{ profilePicture ? 'Upload a new profile picture' : 'Upload a profile picture' }}
          </p>
        </div>

        <v-btn icon="mdi-close" variant="text" size="small" @click="handleClose" />
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div v-if="previewUrl" class="picture-preview">
          <v-img
            :src="previewUrl"
            height="220"
            cover
          />
        </div>

        <div v-else class="picture-empty">
          <v-icon icon="mdi-account-circle-outline" size="54" color="grey-lighten-1" />
          <p>No profile picture uploaded yet.</p>
        </div>

        <input
          ref="fileInput"
          class="file-input"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          @change="handleFileChange"
        />

        <div class="file-actions">
          <v-btn
            color="primary"
            variant="tonal"
            rounded="lg"
            prepend-icon="mdi-camera-outline"
            @click="openFilePicker"
          >
            Choose Image
          </v-btn>

          <span v-if="selectedFile" class="selected-file">{{ selectedFile.name }}</span>
        </div>

        <p v-if="pictureError" class="picture-error">{{ pictureError }}</p>
      </v-card-text>

      <v-divider />

      <v-card-actions class="dialog-actions">
        <v-btn variant="text" rounded="lg" @click="handleClose">
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          prepend-icon="mdi-upload"
          :loading="uploadingPicture"
          :disabled="!selectedFile"
          @click="uploadProfilePicture"
        >
          {{ profilePicture ? 'Upload New Picture' : 'Upload Picture' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from '@/axios'
import constant from '@/constant'
import utils from '@/utils'

export default {
  name: 'ProfilePictureDialog',

  props: {
    modelValue: { type: Boolean, default: false },
    profilePicture: { type: Object, default: null },
  },

  emits: ['update:modelValue', 'uploaded'],

  data() {
    return {
      selectedFile: null,
      localPreviewUrl: '',
      uploadingPicture: false,
      pictureError: '',
    }
  },

  computed: {
    internalOpen: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },

    previewUrl() {
      return this.localPreviewUrl || this.profilePicture?.url || ''
    },
  },

  methods: {
    openFilePicker() {
      this.$refs.fileInput?.click()
    },

    handleFileChange(event) {
      const [file] = event.target.files || []
      this.selectedFile = file || null
      this.pictureError = ''

      if (this.localPreviewUrl) {
        URL.revokeObjectURL(this.localPreviewUrl)
      }

      this.localPreviewUrl = file ? URL.createObjectURL(file) : ''
    },

    async uploadProfilePicture() {
      this.pictureError = ''

      if (!this.selectedFile) {
        this.pictureError = 'Please choose an image first.'
        return
      }

      const file = Array.isArray(this.selectedFile)
        ? this.selectedFile[0]
        : this.selectedFile

      const formData = new FormData()
      formData.append('profile_picture', file)

      this.uploadingPicture = true

      try {
        const response = await axios.post(
          utils._api(constant.upload_profile_picture),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        this.$emit('uploaded', response.data.data)
        this.clearSelectedFile()
        this.internalOpen = false
      } catch (error) {
        console.error('Error uploading profile picture:', error)
        this.pictureError = error.response?.data?.message || 'Unable to upload profile picture.'
      } finally {
        this.uploadingPicture = false
      }
    },

    handleClose() {
      this.pictureError = ''
      this.clearSelectedFile()
      this.internalOpen = false
    },

    clearSelectedFile() {
      if (this.localPreviewUrl) {
        URL.revokeObjectURL(this.localPreviewUrl)
      }

      this.selectedFile = null
      this.localPreviewUrl = ''
      if (this.$refs.fileInput) this.$refs.fileInput.value = ''
    },
  },
}
</script>

<style scoped>
.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
}
.dialog-title {
  color: #0a303c;
  font-size: 17px;
  font-weight: 800;
  margin: 0 0 4px;
}
.dialog-sub {
  color: rgba(0, 0, 0, 0.52);
  font-size: 13px;
  margin: 0;
}
.picture-preview,
.picture-empty {
  overflow: hidden;
  border: 1px solid rgba(10, 48, 60, 0.08);
  border-radius: 8px;
}
.picture-empty {
  display: grid;
  place-items: center;
  min-height: 220px;
  color: rgba(0, 0, 0, 0.52);
  gap: 8px;
  text-align: center;
}
.picture-empty p {
  margin: 0;
}
.file-input {
  display: none;
}
.file-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}
.selected-file {
  color: rgba(0, 0, 0, 0.62);
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.picture-error {
  color: #b42318;
  font-size: 13px;
  margin: 10px 0 0;
}
.dialog-actions {
  padding: 16px 20px;
}
</style>
