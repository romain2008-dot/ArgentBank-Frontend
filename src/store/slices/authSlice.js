import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Actions asynchrones
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
      
      // Stocker le token dans localStorage
      localStorage.setItem('token', data.body.token)
      
      return data.body.token
    } catch (error) {
      return rejectWithValue('Erreur réseau')
    }
  }
)

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const token = auth.token || localStorage.getItem('token')
      
      if (!token) {
        return rejectWithValue('Token manquant')
      }
      
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

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ userName }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const token = auth.token || localStorage.getItem('token')
      
      if (!token) {
        return rejectWithValue('Token manquant')
      }
      
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.message || 'Erreur lors de la mise à jour')
      }
      
      return data.body
    } catch (error) {
      return rejectWithValue('Erreur réseau')
    }
  }
)

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
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.replace('Error: ', '')
        state.isAuthenticated = false
      })
      // Get Profile
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
        state.error = action.payload
        if (action.payload === 'Token manquant') {
          state.isAuthenticated = false
          state.token = null
          localStorage.removeItem('token')
        }
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer