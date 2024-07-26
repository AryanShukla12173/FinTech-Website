import React from 'react'
import { Navigate } from 'react-router-dom'
export default function Notauthenticated() {
  return (
    <div>
    <Navigate to="/login"/>
    </div>
  )
}
