import React from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import EventIcon from "@material-ui/icons/Event";
import CreateIcon from "@material-ui/icons/Create";
import LogoutIcon from "@material-ui/icons/ExitToApp";

import firebase from "firebase";

let useStyle = makeStyles({
  tabs: {
    // backgroundColor: "#dadada"
    borderRight: '1px solid #aaa',
  }
});

export default function VerticalTabs(props) {
  let classes = useStyle();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  let logout = () => {
    firebase.auth().signOut();
  };
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  return (
    <List component="nav" className={classes.tabs}>
      <Link style={{ textDecoration: "none", color: "black" }} to="/blog">
        <ListItem
          button
          selected={selectedIndex === 1}
          onClick={event => handleListItemClick(event, 1)}
        >
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Blog" />
        </ListItem>
      </Link>
      <Link style={{ textDecoration: "none", color: "black" }} to="/events">
        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={event => handleListItemClick(event, 2)}
        >
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItem>
      </Link>
      <ListItem button onClick={logout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );
}
