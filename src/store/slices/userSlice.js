import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// === UPDATE USERNAME ===
export const updateUserName = createAsyncThunk(
  'user/updateUserName',
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName }),
      })

      const data = await response.json()

      if (!response.ok || !data.body || !data.body.userName) {
        return rejectWithValue(data.message || 'Erreur lors de la mise à jour')
      }

      return data.body
    } catch (error) {
      return rejectWithValue('Erreur réseau')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userName: '',
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetUserName: (state) => {
      state.userName = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserName.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.isLoading = false
        state.userName = action.payload.userName
        state.error = null
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload

        // Gestion automatique d’un token invalide
        if (
          action.payload === 'Token manquant' ||
          action.payload === 'Token invalide'
        ) {
          localStorage.removeItem('token')
        }
      })
  },
})

export const { clearError, resetUserName } = userSlice.actions
export default userSlice.reducer
