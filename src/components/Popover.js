import React from 'react';

import { Typography } from '@material-ui/core'

export default function Popover() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (<Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
            paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
    >
        <Typography>I use Popover.</Typography>
    </Popover>)
}