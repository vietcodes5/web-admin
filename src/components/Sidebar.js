import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { makeStyles } from "@material-ui/core/styles";


let useStyle = makeStyles((theme) => ({
  list: {
    maxWidth: '250px',
    backgroundColor: theme.palette.background.paper,
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
    <List className={classes.list}>
      <ListItem >
        <Button onClick={() => props.onClickBtnAdd()} startIcon={<AddIcon />} variant="outlined" color="primary" >
          Add new
        </Button>

      </ListItem  >
      {
        props.items.map((item, i) => {
          return (
            <ListItem selected={selectedIndex === i} button onClick={() => clickItem(item, i)} key={i}>
              <ListItemText primary={item.title} />
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
            </ListItem>
          )
        })
      }
    </List>
  );
}
