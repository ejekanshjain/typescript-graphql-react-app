import { FC, useContext } from 'react'
import { Link } from 'react-router-dom'
import { setAuthState } from '../auth/authState'
import { useMeQuery, useSignOutMutation } from '../generated/graphql'
import { AppStateContext } from '../context/AppStateContext'
import { defaultAppState } from '../defaultAppState'

export const Header: FC = () => {
  const { setAppState } = useContext(AppStateContext) as any
  const { data } = useMeQuery()
  const [signOut] = useSignOutMutation()
  return (
    <div>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/signIn">Sign In</Link>
      </div>
      <div>
        <Link to="/profile">Profile</Link>
      </div>
      Status: {data && data.me ? data.me.id : 'Not logged in'}
      <div>
        <button
          onClick={async () => {
            await signOut()
            setAppState({ ...defaultAppState })
            setAuthState('', '', 0, 0)
            window.location.href = '/'
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
