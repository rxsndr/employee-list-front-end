import { reactive } from 'vue'

// Shared reactive store — works with Options API via this.$store or import
export const documentStore = reactive({
  documents: [],

  addDocument(doc) {
    this.documents.push({
      id: Date.now(),
      name: doc.name,
      age: Number(doc.age),
      address: doc.address,
      createdAt: new Date().toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    })
  },
  updateDocument(id, doc) {
    const index = this.documents.findIndex(d => d.id === id)
    if (index !== -1) {
      this.documents[index] = {
        ...this.documents[index],
        name: doc.name,
        age: Number(doc.age),
        address: doc.address,
      }
    }
  },
  deleteDocument(id) {
    const index = this.documents.findIndex(d => d.id === id)
    if (index !== -1) this.documents.splice(index, 1)
  },

  get total() {
    return this.documents.length
  },
})