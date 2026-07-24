import axios from "axios"


const base_URL = "http://localhost:3000/api"
const axiosInstance = axios.create({
    baseURL: base_URL,
    withCredentials: true,
    timeout: 10000,
    headers:{
        "Content-Type": "application/json",
    },
})

export default axiosInstance