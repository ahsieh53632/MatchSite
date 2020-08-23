import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Slide } from '@material-ui/core';
import { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card'
import { func } from 'prop-types';
import { navigate } from 'gatsby'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="">
        MatchSite
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
      background: 'linear-gradient(45deg, #FE6B8B 30%, #ffff 100%)',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));




function SingIn() {
  const classes = useStyles();
  const [username, setUN] = useState();
  const [password, setPD] = useState();

  function login(e, u, p) {
    e.preventDefault();
    console.log(u);
    console.log(p);
    if (typeof window !== 'undefined') {
      fetch('https://matchsitebackend.herokuapp.com/LoginPage/auth', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "account": u,
            "pwd": p
        })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
              console.log('logging')
              navigate('/Main', {
                                  state: {username: username,},
                                });
            } else {
              navigate('/login');
            }
        })
    }
  };


  
  return (
    <Container component="div" maxWidth="xs" justify="center" >
      <CssBaseline />
      <Slide in={true} direction="right" unmountOnExit>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={(e) => login(e, username, password)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="username"
            name="username"
            autoComplete="username"
            autoFocus
            color='secondary'
            onChange={(e) => setUN(e.target.value)}/>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            color= 'secondary'
            onChange={(e) => setPD(e.target.value)}/>
          <FormControlLabel
            control={<Checkbox value="remember" color="secondary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password? TOO BAD! HA
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signUp" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      </Slide>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default SingIn;