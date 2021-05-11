import { FC, useEffect, useState } from 'react'
import { Routes } from './components/Routes'
import { setAuthState } from './auth/authState'
import { fetchRefreshToken } from './auth/fetchRefreshToken'
import { AppStateContext } from './context/AppStateContext'
import { defaultAppState } from './defaultAppState'

export const App: FC = () => {
  const [loading, setLoading] = useState(true)
  const [appState, setAppState] = useState({ ...defaultAppState })

  useEffect(() => {
    fetchRefreshToken()
      .then(res => res.json())
      .then(json => {
        if (
          json &&
          json.data &&
          json.data.refreshToken &&
          json.data.refreshToken.accessToken
        ) {
          const {
            userId,
            role,
            email,
            firstName,
            lastName,
            profileImage,
            accessToken,
            issuedAt,
            expiresAt
          } = json.data.refreshToken
          setAppState({
            signedIn: true,
            userId,
            role,
            email,
            firstName,
            lastName,
            profileImage: profileImage || ''
          })
          setAuthState(userId, accessToken, issuedAt, expiresAt)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to refresh token', err)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  return (
    <AppStateContext.Provider value={{ appState, setAppState }}>
      <Routes />
    </AppStateContext.Provider>
  )
}
