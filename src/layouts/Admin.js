import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Header from '../components/Header'

import Content from '../components/Content'

export default function Admin() {
  return (
    <Router>
      <Header />
      <Content />
    </Router>
  )
}
