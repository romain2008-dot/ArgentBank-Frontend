import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser, clearError } from '../../store/slices/authSlice'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)
    
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile')
        }
    }, [isAuthenticated, navigate])
    
    useEffect(() => {
        // Nettoyer les erreurs quand le composant se démonte
        return () => {
            dispatch(clearError())
        }
    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!email || !password) {
            return
        }
        
        try {
            await dispatch(loginUser({ email, password })).unwrap()
            // La redirection se fera via useEffect
        } catch (error) {
            // L'erreur est gérée par le slice
        }
    }
    
    return (
        <main className="main bg-dark">
            <section className="sign-in-content">
                <i className="fa fa-user-circle sign-in-icon"></i>
                <h1>Sign In</h1>
                {error && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="email" 
                            id="username" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-wrapper">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-remember">
                        <input 
                            type="checkbox" 
                            id="remember-me" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <button 
                        className="sign-in-button" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion...' : 'Sign In'}
                    </button>
                </form>
            </section>
        </main>
    )
}

export default Login