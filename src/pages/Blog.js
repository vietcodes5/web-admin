import React, { useState, useEffect } from 'react'
import {
  Grid,
  Container,
  Button
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/core/styles'

import Popup from '../components/Popup'
import Sidebar from '../components/Sidebar'
import CreateSeries from '../pages/CreateSeries'
import CreatePost from '../pages/CreatePost'

import firebase from 'firebase'
import 'firebase/firestore'

let useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '24px',
  }
}));

export default function Posts() {
  let classes = useStyles()
  const [series, setSeries] = useState([])
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState()
  const [ openPopup, setOpenPopup] = useState(false)
  const [popupContent, setPopupContent] = useState('')

  useEffect(() => {
    const db = firebase.firestore()

    db.collection('series')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return console.log('No series found');
        }
        let allSeries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSeries(allSeries)

      });
  }, []);
  let showPostsSidebar = (s) => {
    const postRefs = s.posts;
    const promises = postRefs.map(ref => ref.get());

    Promise.all(promises)
      .then(postDocs => {
        const posts = [];
        postDocs.forEach(postDoc => {
          posts.push({
            id: postDoc.id,
            ...postDoc.data()
          });
        });
        setPosts(posts)
      })
      .catch(console.log);
  }
  let showPost = (item) => {
    setPost(item)
  }
  let addNewSeries = () => {
    setOpenPopup(!openPopup)
    setPopupContent(<CreateSeries/>)
  }
  let addNewPost = () => {
    setOpenPopup(!openPopup)
    setPopupContent(<CreatePost/>)
  }

  return (
    <Grid container className={classes.root} spacing={0}>
      <Grid container item lg={4} spacing={0}>
        <Grid item lg={6}>
          <Sidebar onClickBtnAdd={addNewSeries} onClickItem={showPostsSidebar} items={series} />
        </Grid>
        <Grid item lg={6}>
          {
            posts.length > 0
              ? <Sidebar onClickBtnAdd={addNewPost} onClickItem={showPost} items={posts} />
              : ''
          }
        </Grid>
      </Grid>
      <Grid item lg={8}>
        {
          post instanceof Object 
          ? <PreviewPost post={post} />
          : ''
        }
      </Grid>
      <Popup open={openPopup} updatePopup={setOpenPopup} fullWidth={true} maxWidth="xl" content={popupContent} />
    </Grid>
  );
}
function PreviewPost(props) {
  return (
    <Container>
      <Button startIcon={<EditIcon />}>Edit</Button>
      <Button startIcon={<DeleteIcon />}>Delete</Button>
      <h1>{props.post.title}</h1>
      <p>{props.post.content}</p>
    </Container>
  )
}

