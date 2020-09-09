import React from 'react';
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme) => ({
    compose: {
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        background: 'white',
        borderTop: '1px solid #eeeef1',
        position: 'fixed',
        width: '100%',
        bottom: '0px'
    },
      
    composeInput: {
        flex: '1',
        border: 'none',
        fontSize: '14px',
        height: '40px',
        width: '100%',
        background: 'none'
    },
    
    textField: {
        maxHeight: '100%',
    },

    placeholder: {
        opacity: '0.3'
    },
}));


export default function Compose(props) {
    const classes = useStyles();
    const {onSend, ...rest} = props;
    const [msg, setMsg] = React.useState();
    return (
      <div className={classes.compose}>
        <TextField
          variant='outlined'
          className={classes.composeInput}
          placeholder="Type a message"
          color='secondary'
          margin='dense'
          value = {msg}
          onChange= {(e) => setMsg(e.target.value)}
        />

        <Button
            color="primary"
            onClick = {() => {if(msg !== '') { const send = msg; setMsg(''); onSend(send) }}}
        >
            Send
        </Button>
      </div>
    );
}