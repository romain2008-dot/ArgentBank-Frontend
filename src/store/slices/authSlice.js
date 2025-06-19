import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// === LOGIN : ne renvoie que le token, pas le user ===
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Erreur de connexion')
      }

      const { token } = data.body
      localStorage.setItem('token', token)
      return token
    } catch (error) {
      return rejectWithValue('Erreur réseau')
    }
  }
)

// === GET PROFILE : déclenché après login ou au refresh ===
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState()
    const token = auth.token || localStorage.getItem('token')

    if (!token) {
      return rejectWithValue('Token manquant')
    }

    try {
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.message || 'Erreur lors de la récupération du profil')
      }

      return data.body
    } catch (error) {
      return rejectWithValue('Erreur réseau')
    }
  }
)

// === SLICE ===
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // === LOGIN ===
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })

      // === GET PROFILE ===
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false
        const error = action.payload

        // Auto logout si token invalide
        if (
          error === 'Token manquant' ||
          error === 'Token invalide' ||
          error === 'Erreur lors de la récupération du profil'
        ) {
          state.token = null
          state.user = null
          state.isAuthenticated = false
          localStorage.removeItem('token')
        }

        state.error = error
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
