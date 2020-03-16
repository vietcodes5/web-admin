import React from 'react'
import {makeStyles} from '@material-ui/core/styles'

let useStyles = makeStyles({
    input:{
        border: '1px solid #3333',
        height: '40px',
        borderRadius: '5px',
        padding: '5px',
        width: '100%'
    }
})

export default function InputFile(props){
    let classes = useStyles()
    return(
        <div>
            <label for={props.id}>{props.label}</label>
            <input id={props.id} class={classes.input} type={props.type} name={props.name} multiple={props.multiple} />
        </div>
    )
}
InputFile.defaultProps = {
    type : "file"
}