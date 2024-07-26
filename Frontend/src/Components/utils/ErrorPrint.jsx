import { Typography } from '@mui/material'
import React from 'react'

function ErrorPrint({content}) {
  return (
      <p><Typography variant='h6'>{content}</Typography></p>
  )
}

export default ErrorPrint