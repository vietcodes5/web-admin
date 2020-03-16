import React,{useState, useEffect} from 'react'
import { Container, Grid, Button, Paper,TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import IconButton from '@material-ui/core/IconButton'
import { Link } from 'react-router-dom'
import firebase from 'firebase'
import Popup from '../components/Popup'

let useStyles = makeStyles({
  root: {
    paddingTop: '24px',
  },
})
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
  }, [])

  return (
    <Container className={classes.root}>
      <Paper>
        <Grid container>
          <Grid item xs={4} md={6}>
            <Link to='/createblog'>
              <Button variant='contained' color='primary'>
                Add new post
              </Button>
            </Link>
          </Grid>
          <Grid item xs={4} md={6}>
            <Link to='/series/new'>
              <Button variant='contained' color='primary'>
                Create new series
              </Button>
            </Link>
          </Grid>
        </Grid>
        <TableContainer>
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
        </TableContainer>
      </Paper>
    </Container>
  )
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
