import React,{useState, useEffect} from 'react'
import { 
  Container, 
  Grid, 
  Button, 
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import IconButton from '@material-ui/core/IconButton'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import Popup from '../components/Popup'

let useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '24px',
  },
  button: {
    marginBottom: '10px',

    '&:hover': {
      backgroundColor: '#36ed4e',
    }
  }
}));

export default function Posts() {
  let classes = useStyles()
  const [blogs, setBlogs] = useState([])
  useEffect(()=>{
    let db = firebase.firestore()
    
    db.collection('series')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return console.log('No series found');
        }

        let series = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        series.forEach(s => {
          db.collection('series')
            .doc(s.id)
            .get()
            .then(doc => {
              if (!doc.exists) {
                return console.log('Cannot find series with the id: ' + doc.id);
              }

              let blogRefs = doc.data().blogs;
              let seriesTitle = doc.data().title;
              
              blogRefs.forEach(ref => {
                ref.get().then(doc => {
                  if (!doc.exists) {
                    return console.log('Cannot find blog with id: ' + doc.id);
                  }

                  let data = doc.data();
                  let blog = (
                    <Blog
                      key={doc.id}
                      title={data.title}
                      series={seriesTitle}
                    />
                  );

                  setBlogs((prevState) => [...prevState, blog]);
                });
              })
            })
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Series</TableCell>
              <TableCell align='left'>Title</TableCell>
              <TableCell align='center'>Actions</TableCell>
             </TableRow>
          </TableHead>
          <TableBody>{blogs}</TableBody>
          <TableFooter>
            {/* <TablePagination rowsPerPage={5} page={1} count={100} ></TablePagination> */}
          </TableFooter>
        </Table>
      </Paper>
    </Container>
  );
}

function Blog(props) {
  const [dialog, setDialog] = useState(false);

  let deleteEvent = ()=>{
    firebase.firestore()
    .collection('blogs')
    .doc(props.id)
    .delete()
    .then(()=> {
      setDialog(false);
    })
    .catch((err)=> console.log(err))
  }
  return (
    <TableRow>
      <TableCell align='left'>{props.series}</TableCell>
      <TableCell align='left'>{props.title}</TableCell>
      <TableCell align='center'>
        <IconButton>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => setDialog(true)}>
          <DeleteOutlineIcon />
        </IconButton>
      </TableCell>
      <Popup
        direction = '/blogs'
        content="Bạn có chắc chắn muốn xoá ?"
        updatePopup={setDialog}
        show={dialog}
        btnConfirm="Xoá"
        btnConfirmAction={deleteEvent}
      />
    </TableRow>
  )
}
