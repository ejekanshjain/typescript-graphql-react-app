import { FC } from 'react'
import {
  useActiveSessionsQuery,
  useRemoveSessionMutation
} from '../generated/graphql'

export const ActiveSessions: FC = () => {
  const { loading, error, data } = useActiveSessionsQuery({
    fetchPolicy: 'network-only'
  })
  const [removeSession] = useRemoveSessionMutation()
  const deleteSession = async (sessionId: string) => {
    await removeSession({
      variables: { sessionId },
      update: cache => {
        cache.modify({
          fields: {
            activeSessions: (existing: any[], { readField }) =>
              existing.filter(
                sessionRef => sessionId !== readField('id', sessionRef)
              )
          }
        })
      }
    })
  }
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error...</div>
  if (!data?.activeSessions || !data.activeSessions.length)
    return <div>No Data...</div>
  else
    return (
      <div>
        {data.activeSessions.map(session => (
          <div key={session.id}>
            <div>{session.id}</div>
            <button onClick={deleteSession.bind(this, session.id)}>
              remove
            </button>
          </div>
        ))}
      </div>
    )
}
