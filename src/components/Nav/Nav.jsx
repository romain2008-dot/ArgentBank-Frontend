import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import logo from '../../../public/assets/argentBankLogo.webp'
import './Nav.css'

function Nav() {
    const { isAuthenticated } = useSelector((state) => state.auth)
    const { userName } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const handleLogout = () => {
        dispatch(logout())
        navigate('/')
    }
    
    return (
        <nav className='main-nav'>
            <Link to="/" className='main-nav-logo'>
                <img src={logo} alt="Argent Bank Logo" className='main-nav-logo-image'/>
            </Link>
            {isAuthenticated ? (
                <div className='main-nav-items'>
                    <Link to="/profile" className='main-nav-item'>
                        <i className="fa fa-user-circle"></i>
                        {userName || 'User'}
                    </Link>
                    <Link 
                        to="#"
                        onClick={handleLogout}
                        className='main-nav-item main-nav-logout'
                    >
                        <i className="fa fa-sign-out"></i>
                        Sign Out
                    </Link>
                </div>
            ) : (
                <Link to="/login" className='main-nav-item'>
                    <i className="fa fa-user-circle"></i>
                    Sign In
                </Link>
            )}
        </nav>
    )
}

export default Nav