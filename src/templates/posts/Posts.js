import React,{useState, useEffect} from 'react'
import { Container, Grid, Button, TextField, Paper,TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination, } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import IconButton from '@material-ui/core/IconButton'
import { Link } from 'react-router-dom'
import firebase from 'firebase'

let useStyles = makeStyles({
  root: {
    paddingTop: '24px',
  },
})
export default function Posts() {
  let classes = useStyles()
  let db = firebase.firestore()
  const [posts, setPosts] = useState([])
  useEffect(()=>{
    db.collection('posts').get().then(
      data =>{
        let result = data.docs.map(doc =>{
          return {
            ...doc.data(),
            id: doc.id
          }
        })
        let docs = result.map((post, i) =>
          <Post id={post.id} title={post.title} key={i} stt={i+1}/>
        )
        setPosts(docs)
    })
  }, [])

  return (
    <Container className={classes.root}>
      <Paper>
        <Grid container>
          <Link to='/createpost'>
            <Button variant='contained' color='primary'>
              Thêm post
            </Button>
          </Link>
        </Grid>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>STT</TableCell>
                <TableCell align='left'>Title</TableCell>
                <TableCell align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{posts}</TableBody>
            <TableFooter>
              {/* <TablePagination rowsPerPage={5} page={1} count={100} ></TablePagination> */}
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
}
function Post(props) {
  let deleteEvent = ()=>{
    firebase.firestore()
    .collection('posts')
    .doc(props.id)
    .delete()
    .then(()=> console.log("Done"))
    .catch((err)=> console.log(err))
  }
  return (
    <TableRow>
      <TableCell align='center'>{props.stt}</TableCell>
      <TableCell align='left'>{props.title}</TableCell>
      <TableCell align='center'>
        <IconButton>
          <EditIcon />
        </IconButton>
        <IconButton onClick={deleteEvent} >
          <DeleteOutlineIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}
