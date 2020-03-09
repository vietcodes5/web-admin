import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Blogs from './blogs/Blogs' 
import CreateBlog from './blogs/CreateBlog'
import Events from './events/Events' 
import CreateEvent from './events/CreateEvent'
// import Home from '../templates/Home'

export default function Content() {
  return (
      <Switch>
        {/* <Route path='/' component={Home} /> */}
        <Route path='/blogs' component={Blogs} />
        <Route path='/events' component={Events} />
        <Route path='/createblog' component={CreateBlog}/>
        <Route path='/createevent' component={CreateEvent}/>
      </Switch>
  )
}
