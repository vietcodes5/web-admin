import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Typography,
  Divider,
  TextField,
  Fab
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { makeStyles } from "@material-ui/core/styles";


let useStyle = makeStyles((theme) => ({
  list: {
    minWidth: '150px',
    backgroundColor: theme.palette.background.paper,
    maxHeight: '85vh',
    padding: '16px 0',
    overflow: 'scroll'
  },
  listItemText: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  subheader: {
    marginBottom: '16px'
  },
  btnAdd: {
    margin: '0px 8px',
    minWidth: '40px'
  }
}));

export default function Sidebar(props) {
  let classes = useStyle();
  const [selectedIndex, setSelectedIndex] = useState();
  const clickItem = (item, i) => {
    setSelectedIndex(i)
    props.onClickItem(item)
  }

  return (
    <List className={classes.list}
      subheader={
        <ListSubheader className={classes.subheader} component="div" id="nested-list-subheader">
          <Typography variant="h3" align="center">{props.subheader}</Typography>
        </ListSubheader>
      }>
      <Divider />
      <ListItem>
        <TextField variant="outlined" label={'Search ' + props.subheader} />
        <Fab className={classes.btnAdd} onClick={() => props.onClickBtnAdd()} size="small" color="primary" aria-label="add">
          <AddIcon />
        </Fab>

      </ListItem  >
      {
        props.items.map((item, i) => {
          return (
            <ListItem selected={selectedIndex === i} button onClick={() => clickItem(item, i)} key={i}>
              <ListItemText className={classes.listItemText} primary={item.title} />
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
            </ListItem>
          )
        })
      }
    </List >
  );
}
