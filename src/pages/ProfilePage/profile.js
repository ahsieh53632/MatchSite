import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { Menu, MenuItem } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card'
import { navigate } from 'gatsby'
import Select from '@material-ui/core/Select';


const useStyles = makeStyles((theme) => ({
    '@global': {
        '*::-webkit-scrollbar': {
          display: 'none'
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 153, 153, .5)',
          outline: '1px solid slategrey'
        },
        '*::-webkit-overflow-scrolling': 'touch',
        'body': {
            margin: '0',
            padding: '0 0 0 0',
        },
      },
    root: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        margin: 'auto',
        display: 'flex',
        backgroundColor: '#E5F8FF',
        flexGrow: '1',
    },
    
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        width: '90vw',
        height: '95vh',
        backgroundColor: 'rgba(255,255,255, .8)',
        overflowY: 'scroll',
        overflowX: 'hidden',
    },

    img: {
        margin: 'auto',
        display: 'block',
        height: '60vh',
        width: '90vw',
        objectFit: 'cover',
        objectPosition: '0% 0%'
    },

    cell: {
    },

    formControl: {
        minWidth: 150,
        margin: theme.spacing(1)
      },
}));


const Profile = ({location}) => {
    const userName = (typeof window !== 'undefined') ? location.state.username : "";
    const [info, setInfo] = useState({name: '', age: 0, image_path: '', msg: ''});
    const [matching, setMatching] = useState(1);
    const [msg, setMsg] = useState();
    const [img, setImg] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Chang_Chia-Hang_giving_V-sign_20190414.jpg/1200px-Chang_Chia-Hang_giving_V-sign_20190414.jpg');
    const classes = useStyles();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            fetch('https://matchsitebackend.herokuapp.com/profile/get', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "account": userName,
                })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                    console.log('got info');
                    console.log(data.data[0]);
                    setInfo(data.data[0]);
                    setMatching(Number(data.data[0].matchingLoc));
                    setMsg(data.data[0].msg);
                    } else {
                        navigate('/login');
                    }
                    })
            }}, []);
    
    function update() {
        if (typeof window !== 'undefined') {
            fetch('https://matchsitebackend.herokuapp.com/profile/update', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "account": userName,
                    "matchingLoc": matching,
                    "msg": msg,
                })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        console.log('updated');
                    } else {
                        console.log('update failed');
                    }
                    })
            }
    }
    return (
        <div className={classes.root}>
            <head>
                <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </head>
            <Card className={classes.paper}>
                <Grid container direction={'column'} spacing={3} justify="center">
                    <Grid item xs={12} className={classes.cell}>  
                        <img className={classes.img} src={'https://matchsiteimg.s3.ap-northeast-2.amazonaws.com/'+info.image_path} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h4'>
                            {info.name}, {info.age}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label= "about me"
                            multiline
                            rowsMax={12}
                            variant="outlined"
                            value={msg}
                            InputLabelProps={{shrink: true}}
                            onChange={(e) => setMsg(e.target.value)}
                        />
                        <FormControl className={classes.formControl} color='secondary'>
                            <TextField
                                select
                                label="matching Location"
                                id="matching Loc"
                                value={matching}
                                onChange={(e) => setMatching(Number(e.target.value))}
                            >

                                <MenuItem value={1}>Taipei City</MenuItem>
                                <MenuItem value={2}>Others</MenuItem>
                            </TextField>
                        </FormControl>
                    </Grid>
                    
                </Grid>
                <Grid container>
                    <Button onClick={() => update()}> Update </Button>
                    <Button onClick={(e) => navigate('/Main', {
                                  state: {username: userName,},
                                })}> MainPage </Button>
                </Grid>
            </Card>
        </div>


    )

}

export default Profile;