import React, { useState, useEffect } from 'react'
import {
  Grid,
} from '@material-ui/core'


import { makeStyles } from '@material-ui/core/styles'
import Popup from '../components/Popup'
import Sidebar from '../components/Sidebar'
import CreateSeries from '../components/Series/CreateSeries'
import CreatePost from '../components/Post/CreatePost'
import PreviewPost from '../components/Post/PreviewPost'
import PreviewSeries from '../components/Series/PreviewSeries'

import firebase from 'firebase'
import 'firebase/firestore'

let useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '24px',
  },

  preview: {
    height: '85vh'
  }

}));

export default function Posts() {
  let classes = useStyles()
  const [series, setSeries] = useState([])
  const [currentSeries, setCurrentSeries] = useState()
  const [posts, setPosts] = useState(null)
  const [post, setPost] = useState()
  const [openPopup, setOpenPopup] = useState(false)
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
    if (post) {
      setPost('')
    }
    setCurrentSeries(s)
    const postRefs = s.posts;
    console.log(postRefs);

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
        console.log(posts);

        setPosts(posts)
      })
      .catch(console.log);
  }
  let showPost = (item) => {
    setPost(item)
  }
  let addNewSeries = () => {
    setOpenPopup(true)
    setPopupContent(<CreateSeries />)
  }
  let addNewPostHandle = () => {
    setOpenPopup(true)
    setPopupContent(<CreatePost currentSeries={currentSeries} series={series} />)
  }

  return (
    <Grid container justify="center" className={classes.root} spacing={1}>
      <Grid container justify="center" item xs={6} md={4} spacing={1}>
        <Grid item xs={6}>
          <Sidebar onClickBtnAdd={addNewSeries} onClickItem={showPostsSidebar} items={series} subheader="Series" />
        </Grid>
        <Grid item xs={6}>
          {
            posts
              ? <Sidebar onClickBtnAdd={addNewPostHandle} onClickItem={showPost} items={posts} subheader="Posts" />
              : ''
          }
        </Grid>
      </Grid>
      <Grid item xs={6} md={8} className={classes.preview}>
        {
          post instanceof Object
            ? <PreviewPost post={post} currentSeries={currentSeries} series={series} />
            : currentSeries ?
              <PreviewSeries editing={true} currentSeries={currentSeries} />
              : ''
        }
      </Grid>
      <Popup open={openPopup} updatePopup={setOpenPopup} fullWidth={true} maxWidth="xl" content={popupContent} />
    </Grid>
  );
}
