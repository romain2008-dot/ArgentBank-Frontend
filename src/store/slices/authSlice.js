import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Fonction utilitaire pour gérer le stockage
const getStoredToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

const removeStoredToken = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

// === LOGIN : ne renvoie que le token, pas le user ===
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
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
      
      // Stocker selon le choix de l'utilisateur
      if (rememberMe) {
        localStorage.setItem('token', token)
        sessionStorage.removeItem('token') // Nettoyer l'autre storage
      } else {
        sessionStorage.setItem('token', token)
        localStorage.removeItem('token') // Nettoyer l'autre storage
      }
      
      return token
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
    token: getStoredToken(),
    isLoading: false,
    error: null,
    isAuthenticated: !!getStoredToken(),
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      removeStoredToken()
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
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
