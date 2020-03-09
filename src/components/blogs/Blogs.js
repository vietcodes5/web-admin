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
import Popup from '../Popup'

let useStyles = makeStyles({
  root: {
    paddingTop: '24px',
  },
})
export default function Posts() {
  let classes = useStyles()
  let db = firebase.firestore()
  const [blogs, setBlogs] = useState([])
  useEffect(()=>{
    db.collection('blogs').get().then(
      data =>{
        let result = data.docs.map(doc =>{
          return {
            ...doc.data(),
            id: doc.id
          }
        })
        let docs = result.map((blog, i) =>
          <Blog id={blog.id} title={blog.title} key={i} stt={i+1}/>
        )
        setBlogs(docs)
    })
  }, [])

  return (
    <Container className={classes.root}>
      <Paper>
        <Grid container>
          <Link to='/createblog'>
            <Button variant='contained' color='primary'>
              Thêm blog
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
      <TableCell align='center'>{props.stt}</TableCell>
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
