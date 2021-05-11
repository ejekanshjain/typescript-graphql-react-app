import { FC, FormEvent, useState, useContext } from 'react'
import GoogleLogin from 'react-google-login'
import { setAuthState } from '../auth/authState'
import {
  useGoogleSignInMutation,
  useSignInMutation
} from '../generated/graphql'
import { AppStateContext } from '../context/AppStateContext'

export const SignIn: FC = () => {
  const { setAppState } = useContext(AppStateContext) as any
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signIn] = useSignInMutation()
  const [googleSignIn] = useGoogleSignInMutation()
  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const response = await signIn({
      variables: {
        email,
        password
      }
    })
    setPassword('')
    if (response.data && response.data.signIn) {
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
      } = response.data.signIn
      setEmail('')
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
  }
  const handleGoogleResponse = async (res: any) => {
    const idToken = res.tokenId
    if (!idToken) return console.log('Google sign in failed')
    const response = await googleSignIn({
      variables: {
        idToken
      }
    })
    setPassword('')
    if (response.data && response.data.googleSignIn) {
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
      } = response.data.googleSignIn
      setEmail('')
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
  }
  return (
    <form onSubmit={handleSignIn}>
      <div>
        <input
          type="email"
          value={email}
          placeholder="Email Address"
          onChange={e => setEmail(e.currentTarget.value)}
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </div>
      <div>
        <button type="submit">Sign In</button>
      </div>
      <div>
        <GoogleLogin
          clientId={`${process.env.REACT_APP_GOOGLE_OAUTH2_CLIENT_ID}`}
          onSuccess={handleGoogleResponse}
          onFailure={handleGoogleResponse}
          cookiePolicy={'single_host_origin'}
          render={renderProps => (
            <button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <span>Sign In with Google</span>
            </button>
          )}
        ></GoogleLogin>
      </div>
    </form>
  )
}
