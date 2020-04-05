import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Container from '@material-ui/core/Container';

import Blog from '../pages/Blog';
import CreatePost from '../pages/CreatePost';
import CreateSeries from '../pages/CreateSeries';
import Events from '../pages/Events'; 
import CreateEvent from '../pages/CreateEvent';
// import Home from './Home'

import Series from '../templates/Series';
import Post from '../templates/Post';
import Event from '../templates/Event';

export default function Content() {
  return (
    <Container maxWidth="xl" style={{ marginTop: '20px' }}>
      <Switch>
        {/* <Route path='/' component={Home} /> */}
        <Route path='/createblog' component={CreatePost} />
        <Route path='/createevent' component={CreateEvent} />
        <Route path='/series/new' component={CreateSeries} />
        <Route path='/series/:id' component={Series} />
        <Route path='/posts/:id' component={Post} />
        <Route path='/events/:id' component={Event} />
        <Route path='/blog' component={Blog} />
        <Route path='/events' component={Events} />
      </Switch>
    </Container>
  )
}
