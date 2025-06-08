import logo from '../../assets/argentBankLogo.webp'
import { Link } from 'react-router-dom'
import './Nav.css'

function Nav() {
    return (
        <nav className='main-nav'>
            <Link to="/" className='main-nav-logo'>
                <img src={logo} alt="Argent Bank Logo" className='main-nav-logo-image'/>
            </Link>
            <Link to="/login" className='main-nav-item'>
                <i className="fa fa-user-circle"></i>
                Sign In
            </Link>
        </nav>
    );
}

export default Nav