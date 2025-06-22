import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserProfile } from '../../store/slices/userSlice'
import { updateUserName } from '../../store/slices/userSlice' 
import Account from '../../components/Account/Account'
import accountsData from '../../data/accounts.json'
import './User.css'

function User() {
    const [isEditing, setIsEditing] = useState(false)
    const [newUserName, setNewUserName] = useState('')
    
    const dispatch = useDispatch()
    const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth)
    const { userName, firstName, lastName, isLoading: userLoading, error: userError } = useSelector((state) => state.user)

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getUserProfile())
        }
    }, [isAuthenticated, dispatch])
    
    useEffect(() => {
        if (userName) {
            setNewUserName(userName || '')
        }
    }, [userName])
    
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
        setNewUserName(userName || '')
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
                        {firstName} {lastName}!
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
                                    value={firstName || ''}
                                    disabled
                                    placeholder="First name"
                                />
                            </div>
                            <div className="input-wrapper">
                                <label htmlFor="lastName">Last name:</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName || ''}
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
                            {firstName} {lastName}!
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