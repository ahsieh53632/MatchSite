import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Slide, AppBar } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import { navigate } from 'gatsby';
import SideBarHeader from './sideBarHeader'
import SideBar from './sideBar'
import CardStack from '../cardStack'
import { Router } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    container: {
        width: '100%',
        height: '100%',
        margin: `0`,
        padding: '0',
        overflow: 'hidden',
    },
    root: {
        flexGrow: '1',
    },
    sideBar: {
        width: 'fit-content',

    }
})
class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeEl: null,
            dateEl: null,
            matchDate: null,
            startTime: '1999-01-01',
            endTime: '9999-12-30',
            type: '*',
            imgPath: '',
            loc: 1,
        };
        this.matches = [];
    }

    componentDidMount() {
        const {classes, userName, ...rest} = this.props
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
                    console.log('fetching matching time period');
                    this.setState({...this.state, 
                        startTime: data.data[0].startTime.toString().slice(0,10),
                        endTime: data.data[0].endTime.toString().slice(0,10),
                        loc: data.data[0].matchingLoc});
                    }
                    })
    }


    handleTypeClick(e) {
        var x = e.currentTarget;
        this.setState({typeEl: x, dateEl: null});
    }

    handleDateClick(e) {
        var x = e.currentTarget;
        this.setState({typeEl: null, dateEl: x});
    }

    handleClose() {
        this.setState({typeEl: null, dateEl: null});
    }

    handleChangeDate(date) {
        var startDate = new Date();
        var newDate = new Date();
        if (date === "today") {
            newDate = startDate;
        } else if (date === "tmr") {
            newDate = new Date(startDate.getTime() + 1 * 86400000 );
        } else if (date === "thisWeek") {
            newDate = new Date(startDate.getTime() + 7 * 86400000 );
        } else {
            // next week
            newDate = new Date(startDate.getTime() + 14 * 86400000 );
            startDate = new Date(startDate.getTime() + 7 * 86400000 );
        }
        const start = startDate.getFullYear() +'-'+ (startDate.getMonth() + 1) +'-'+ startDate.getDate();
        const end = newDate.getFullYear() +'-'+ (newDate.getMonth() + 1) +'-'+ newDate.getDate();
        this.setState({...this.state, startTime: start,
             endTime: end, dateEl: null});
    }

    handleChangeType(type) {
        this.setState({...this.state, type: type, typeEl: null});
    }

    render() {
        const {classes, userName, ...rest} = this.props
        return (
            <div>
            <SideBarHeader userName={userName}/>
            <div className={classes.container}>    
            <Grid container direction={'row'} alignItems="flex-start" spacing={0} className={classes.root}>
                <Grid item xs={6} sm={3}>
                    <Button aria-controls="fade-menu" aria-haspopup="true" onClick={(e) => this.handleTypeClick(e)}>
                        Choose Type
                    </Button>
                    <Menu 
                        id="fade-menu"
                        anchorEl={this.state.typeEl}
                        keepMounted
                        open={Boolean(this.state.typeEl)}
                        onClose={() => {this.handleClose()}}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => this.handleChangeType("machong")}>打麻將</MenuItem>
                        <MenuItem onClick={() => this.handleChangeType("movie")}>看電影</MenuItem>
                        <MenuItem onClick={() => this.handleChangeType("eat")}>吃飯</MenuItem>
                        <MenuItem onClick={() => this.handleChangeType("*")}>ALL</MenuItem>
                    </Menu>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Button aria-controls="date-menu" aria-haspopup="true" onClick={(e) => this.handleDateClick(e)}>
                        Choose Date
                    </Button>
                    <Menu 
                        id="date-menu"
                        anchorEl={this.state.dateEl}
                        keepMounted
                        open={Boolean(this.state.dateEl)}
                        onClose={() => {this.handleClose()}}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => this.handleChangeDate("today")}>今天</MenuItem>
                        <MenuItem onClick={() => this.handleChangeDate("tmr")}>明天</MenuItem>
                        <MenuItem onClick={() => this.handleChangeDate("thisWeek")}>這禮拜</MenuItem>
                        <MenuItem onClick={() => this.handleChangeDate("nextWeek")}>下禮拜</MenuItem>
                    </Menu>
                </Grid>
                <Grid item xs={12}>
                    <CardStack type={this.state.type} 
                        startTime={this.state.startTime}
                        endTime={this.state.endTime}
                        userName= {userName}
                        loc={this.state.loc}/>
                </Grid>
                
            </Grid>
            </div>
            </div>
        )
    }

}

export default withStyles(styles)(MainPage);