import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Posts from '../templates/posts/Posts' 
import CreatePost from '../templates/posts/CreatePost'
import Events from '../templates/events/Events' 
import CreateEvent from '../templates/events/CreateEvent'
import Home from '../templates/Home'

export default function Content() {
  return (
      <Switch>
        {/* <Route path='/' component={Home} /> */}
        <Route path='/posts' component={Posts} />
        <Route path='/events' component={Events} />
        <Route path='/createpost' component={CreatePost}/>
        <Route path='/createevent' component={CreateEvent}/>
      </Switch>
  )
}
