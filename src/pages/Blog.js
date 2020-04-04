import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { 
  Container, 
  Grid, 
  Button, 
  Paper,
  Typography,
} from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'

import { makeStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import firebase from 'firebase'
import 'firebase/firestore'

let useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '24px',
  },
  button: {
    marginBottom: '10px',

    '&:hover': {
      backgroundColor: '#36ed4e',
    }
  },
  treeView: {
    minHeight: '216px',
    flexGrow: 1,
  },
}));

export default function Posts() {
  let classes = useStyles()
  const [ treeNodes, updateTreeNodes ] = useState([]);
  const [ expanded, setExpanded ] = useState([]);
  const [ selected, setSelected ] = useState([]);

  const handleToggle = (e, nodeIds) => setExpanded(nodeIds);
  const handleSelect = (e, nodeIds) => setSelected(nodeIds);

  useEffect(()=>{
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
        // console.log(allSeries);

        allSeries.forEach(s => {
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

              const postNodes = posts.map(post => (
                <TreeItem 
                  key={post.id} 
                  nodeId={post.id} 
                  label={
                    <Link to={`/series/${s.id}/${post.id}`}>
                      <Typography variant="h4">{post.title}</Typography>
                    </Link>
                  } />
              ));
              const SeriesNode = (
                <TreeItem 
                  // 
                  style={{padding:'10px', fontSize: '40px'}}
                  key={s.id} 
                  nodeId={s.id} 
                  label={
                    <Link to={`/series/${s.id}`}>
                      <Typography variant="h3">{s.title}</Typography>
                    </Link>
                  }>
                { postNodes }
                </TreeItem>
              );

              updateTreeNodes(prevState => [ ...prevState, SeriesNode ]);
            })
            .catch(console.log);
        });
      });
  }, []);

  return (
    <Container className={classes.root}>
      <Typography variant="h1" gutterBottom>
        Blog
      </Typography>
      <Grid container>
        <Grid item xs={4} md={6}>
          <Link to='/createblog'>
            <Button variant='contained' className={classes.button}>
               Add new post
            </Button>
          </Link>
        </Grid>
        <Grid item xs={4} md={6}>
          <Link to='/series/new'>
            <Button variant='contained' className={classes.button}>
              Create new series
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Paper>
        <TreeView
          className={classes.treeView}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          selected={selected}
          onNodeToggle={handleToggle}
          onNodeSelect={handleSelect}
        >
        { Array.isArray(treeNodes) && treeNodes.length ? treeNodes : "Loading data..." }
        </TreeView>
      </Paper>
    </Container>
  );
}

