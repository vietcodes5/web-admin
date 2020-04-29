import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import showdown from 'showdown';
showdown.setFlavor('github');
let converter = new showdown.Converter();

const useStyles = makeStyles(theme => ({
  markdownConfig: {
    textIndent: '3em',
    overflow: 'auto'
  }
}));

export default function Markdown(props) {
  const { children } = props;
  const classes = useStyles();
  return (
    <div
      className={classes.markdownConfig}
      dangerouslySetInnerHTML={{
        __html: converter.makeHtml(children)
      }}>

    </div>
  )
}