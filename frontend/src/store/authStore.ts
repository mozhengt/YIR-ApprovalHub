import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
    token: string | null
    user: User | null
    setAuth: (token: string, user: User) => void
    clearAuth: () => void
    isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,

            setAuth: (token, user) => {
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
                set({ token, user })
            },

            clearAuth: () => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                set({ token: null, user: null })
            },

            isAuthenticated: () => !!get().token,
        }),
        {
            name: 'auth-storage',
        }
    )
)
