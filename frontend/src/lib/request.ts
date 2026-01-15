import axios from 'axios'

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
    timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        const { code, data, message } = response.data

        if (code === 200) {
            return data
        } else {
            // 错误处理
            console.error('API Error:', message)
            return Promise.reject(new Error(message))
        }
    },
    (error) => {
        if (error.response) {
            const { status } = error.response

            if (status === 401) {
                // Token 过期，清除并跳转登录
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export default request
