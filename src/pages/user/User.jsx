import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserProfile } from '../../store/slices/authSlice'
import { updateUserName } from '../../store/slices/userSlice' 
import Account from '../../components/Account/Account'
import accountsData from '../../data/accounts.json'
import './User.css'

function User() {
    const [isEditing, setIsEditing] = useState(false)
    const [newUserName, setNewUserName] = useState('')
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth)
    const { userName: currentUserName, isLoading: userLoading, error: userError } = useSelector((state) => state.user) // Sélectionnez l'état de la nouvelle slice

    useEffect(() => {
        
        if (!user) {
            dispatch(getUserProfile())
        }
    }, [isAuthenticated, user, dispatch, navigate])
    
    useEffect(() => {
        if (user) {
            setNewUserName(user.userName || '')
        }
    }, [user])
    
    const handleEditClick = () => {
        setIsEditing(true)
    }
    
    const handleSave = async (e) => {
        e.preventDefault()
        
        if (!newUserName.trim()) {
            return
        }
        
        try {
            await dispatch(updateUserName({ userName: newUserName.trim() })).unwrap()
            setIsEditing(false)
        } catch (error) {
            // L'erreur est gérée par le slice
        }
    }
    
    const handleCancel = () => {
        setNewUserName(user?.userName || '')
        setIsEditing(false)
    }
    
    if (!isAuthenticated) {
        return null
    }
    
    return (
        <main className="main bg-dark">
            <div className="header">
                {isEditing ? (
                    <div className="edit-form">
                        <h1>Welcome back<br />
                        {user?.firstName} {user?.lastName}!
                        </h1>
                        <form onSubmit={handleSave}>
                            <div className="input-wrapper">
                                <label htmlFor="userName">User name:</label>
                                <input
                                    type="text"
                                    id="userName"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="User name"
                                />
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="firstName">First name:</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={user?.firstName || ''}
                                    disabled
                                    placeholder="First name"
                                />
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="lastName">Last name:</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={user?.lastName || ''}
                                    disabled
                                    placeholder="Last name"
                                />
                            </div>
                            <div className="edit-buttons">
                                <button 
                                    type="submit" 
                                    className="edit-button"
                                    disabled={isLoading || userLoading}
                                >
                                    {isLoading || userLoading ? 'Saving...' : 'Save'}
                                </button>
                                <button 
                                    type="button" 
                                    className="edit-button"
                                    onClick={handleCancel}
                                    disabled={isLoading || userLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                        {error && (
                            <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>
                                {error}
                            </div>
                        )}
                        {userError && (
                            <div className="error-message" style={{ color: 'red', marginTop: '1rem' }}>
                                {userError}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                    <h1>Welcome back<br />
                            {user?.firstName} {user?.lastName}!
                        </h1>
                        <button className="edit-button" onClick={handleEditClick}>
                            Edit Name
                        </button>
                    </>
                )}
            </div>
            <h2 className="sr-only">Accounts</h2>
            {accountsData.map((account, index) => (
                <Account
                    key={index}
                    title={account.title}
                    amount={account.amount}
                    description={account.description}
                />
            ))}
        </main>
    )
}

export default User