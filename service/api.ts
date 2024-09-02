import axios from "axios"

const api = axios.create({ baseURL: `localhost:5555` }) // Server developer Local

export default api
