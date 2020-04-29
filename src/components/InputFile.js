import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

let useStyles = makeStyles({
    input: {
        border: '1px solid #3333',
        height: '40px',
        borderRadius: '5px',
        padding: '5px',
        width: '95%',
    },
    title: {
        fontWeight: '300',
    }

})

export default function InputFile(props) {
    let classes = useStyles()
    return (
        <div>
            <label htmlFor={props.id}>
                <Typography variant="h5" >{props.label}</Typography>
            </label>
            <input className={classes.input} {...props} />
        </div>
    )
}
InputFile.defaultProps = {
    type: "file"
}