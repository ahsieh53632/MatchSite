import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Slide, Toolbar, List, ListItem, ListItemText, ListItemIcon, Divider, ListItemAvatar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { navigate } from 'gatsby';
import MatchedHeader from './matchedHeader';

const useStyles = makeStyles((theme) => ({
    '@global': {
        '*::-webkit-scrollbar': {
          width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 153, 153, .5)',
          outline: '1px solid slategrey'
        },
      },
    root: {
        position: 'relative',
        width: '100%',
        padding: '0px 0px 0px 10px',
        height: 'calc(100vh - 125px)',
        display: 'flex',
        overflowY: 'scroll',
        overflowX: 'hidden',
    },
    avatar: {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        backgroundPosition: 'center',
        position: 'relative',
    },
    listItem: {
        width: '100%',
        padding: '10px 0 10px 0px',
        alignItems: 'center',
        
    },
    txt: {
        zIndex: '-1',
        position: 'relative',
        height: '45px',
        margin: '0',
        padding: '0 0 0 0',
        color: "gray",
        display: 'block',
        background: 'linear-gradient(90deg, #F76C6C 0%, rgba(255, 153, 153, 1) 80%)',
}}));

function handleClick(e, userName) {
    console.log(e.target);
}
const SideBar = (props) => {
    const classes = useStyles();
    const {userName, ...rest} = props;
    const [matched, setMatched] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            fetch('https://matchsitebackend.herokuapp.com/matched/get', {
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
                    console.log('got matched');
                    console.log(data.data);
                    setMatched(data.data);
                    } else {
                        console.log('failed');
                    }
                    })
    }}, []);


    return(
        <div>
        <MatchedHeader userName={userName}/>
        <div className={classes.root} aria-label="main mailbox folders">
            <List component="nav" className={classes.listItem}>
                {matched.map(({name, image_path, matchType, startTime, endTime}) => (
                <div key={name}>
                <ListItem button onClick={(e) => handleClick(e, name)} className={classes.listItem}>
                    <ListItemIcon>
                        <img className={classes.avatar} src={"https://matchsiteimg.s3.ap-northeast-2.amazonaws.com/" + image_path}>
                        </img>
                    </ListItemIcon>
                <ListItemText> 
                    <Typography variant="h5">
                        {name}, {matchType === "*" ? "anything" : matchType}
                    </Typography>
                    <Typography variant="subtitle1">
                        FROM: [{startTime.toString().slice(5,10)}] TO: [{endTime.toString().slice(5,10)}]
                    </Typography>
                </ListItemText>
                </ListItem>
                <Divider />
                </div>))}
            </List>
        </div>
        </div>
    );

}

export default SideBar;