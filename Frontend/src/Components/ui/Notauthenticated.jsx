import React from 'react'
import { Navigate } from 'react-router-dom'
export default function Notauthenticated() {
  return (
    <div><p>User is not authenticated to view info</p>
        <Navigate to="/login"/>
    </div>
  )
}
