import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Posts from '../templates/Posts' 
import Events from '../templates/Events' 
import CreatePost from '../templates/CreatePost'
import Home from '../templates/Home'

export default function Content() {
  return (
      <Switch>
        {/* <Route path='/' component={Home} /> */}
        <Route path='/posts' component={Posts} />
        <Route path='/events' component={Events} />
        <Route path='/creatpost' component={CreatePost}/>
      </Switch>
  )
}
