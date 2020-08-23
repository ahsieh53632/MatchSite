import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Slide, Toolbar, AppBar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { navigate } from 'gatsby';
import { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '100px',
        padding: '0 0px 0 0px',
        display: 'fixed',
        background: 'linear-gradient(90deg, #F76C6C 0%, rgba(255, 153, 153, 1) 80%)',
    },
    text: {
        marginLeft: '5px',
        marginRight: '20px',
        color: 'white',
        fontSize: '15px',
        flexGrow: '1',
    },
    avatar: {
        margin: '0',
        padding: '0px 0px 0px 0px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '2px solid white',
        
    },
    button: {
        color: 'white',
        marginRight: 'auto'
    },
    inButton: {
        color: 'white',
        flexGrow: '0',
        marginLeft: 'auto',
    }

}));

const SideBarHeader = (props) => {
    const classes = useStyles();
    const {userName, ...rest} = props;
    const [img, setImg] = useState();


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
                    console.log('got image');
                    setImg(data.data[0].image_path);
                    } else {
                        navigate('/login');
                    }
                    })
            }}, []);
    
    return(
    <div>
    <AppBar position='static'>
    <Toolbar className={classes.container}>        
        <Button className={classes.button} onClick={(e) => navigate('../ProfilePage/profile', {
                                  state: {username: userName,},
                                })}>
            <div>
                <img className={classes.avatar} src={"https://matchsiteimg.s3.ap-northeast-2.amazonaws.com/" + img} />
            </div>
            <Typography className={classes.text}>Your Profile</Typography>
        </Button>

        <div>
            <Button color='inherit' className={classes.inButton} onClick={(e) => navigate('../matched', {
                                  state: {username: userName,},
                                })}> 
                <Typography className={classes.text}>matches</Typography> 
            </Button>
        </div>
    </Toolbar>
    </AppBar>
    </div>
    )

};

export default SideBarHeader;