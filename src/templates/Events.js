import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import 'firebase/firestore'

import {
  Container,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  TablePagination,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import IconButton from '@material-ui/core/IconButton'
let useStyles = makeStyles({
  root: {
    paddingTop: '24px',
  },
})

export default function Events() {
  let classes = useStyles()
  let theme = useTheme
  let db = firebase.firestore()
  let [events, setEvents] = useState([])
  firebase.database().ref().child('events').on('value', (snap)=>
      console.log('snap', snap.val()))

  useEffect(() => {
    // db.collection('events')
    //   .get()
    //   .then(data => {
    //     let result = data.docs.map(doc => {
    //       return {
    //         ...doc.data(),
    //         id: doc.id,
    //       }
    //     })
    //     console.log(result);
        
    //     let docs = result.map((event, i) => (
    //       <Event title={event.title} stt={i + 1} key={i} id={event.id}></Event>
    //     ))

    //     setEvents(docs)
    //   })
    //   .catch(err => console.log(err))
    
    
  },[])
  return (
    <Container className={classes.root}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>STT</TableCell>
                <TableCell align='left'>Title</TableCell>
                <TableCell align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{events}</TableBody>
            <TableFooter>
              {/* <TablePagination rowsPerPage={5} page={1} count={100} ></TablePagination> */}
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
}

function Event(props) {
  let deleteEvent = ()=>{
    firebase.firestore()
    .collection('events')
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
