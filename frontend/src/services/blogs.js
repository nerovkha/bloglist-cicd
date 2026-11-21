import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => axios.get(baseUrl).then((response) => response.data)

const create = (newBlog) =>
  axios
    .post(baseUrl, newBlog, { headers: { Authorization: token } })
    .then((response) => response.data)

const update = (id, changedBlog) =>
  axios
    .put(`${baseUrl}/${id}`, changedBlog)
    .then((response) => response.data)

const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: token } })

export default { getAll, create, update, remove, setToken }
