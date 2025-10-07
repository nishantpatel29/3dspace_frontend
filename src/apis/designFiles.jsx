 import api from './auth'

 const designFilesAPI = {
   list: async () => {
     const res = await api.get('/design-files')
     return res.data
   },
   get: async (id) => {
     const res = await api.get(`/design-files/${id}`)
     return res.data
   },
   create: async (payload) => {
     const res = await api.post('/design-files', payload)
     return res.data
   },
   update: async (id, payload) => {
     const res = await api.put(`/design-files/${id}`, payload)
     return res.data
   },
  remove: async (id) => {
    const res = await api.delete(`/design-files/${id}`)
    return res.data
  },
 }

 export default designFilesAPI


