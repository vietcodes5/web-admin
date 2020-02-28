import React from 'react'
import { Container, Grid, Button, TextField, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

let useStyles = makeStyles({
  root: {
    paddingTop: '24px',
  },
})
export default function Posts() {
  let classes = useStyles()
  return (
    <Container className={classes.root}>
      <Paper>
        <Grid container>
          <Link to='/creatpost'>
            <Button variant='contained' color='primary'>
              Thêm post
            </Button>
          </Link>
        </Grid>
        <Grid container>
          <TextField label='Search' variant='outlined' />
          <Button>Search</Button>
        </Grid>
      </Paper>
    </Container>
  )
}
