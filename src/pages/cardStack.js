import { render } from 'react-dom'
import React, { useEffect, useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture, useDrag } from 'react-use-gesture'
import { makeStyles } from '@material-ui/styles'
import { Grid, Typography } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  '@global': {
    'body': {
      background: '#E5F8FF',
      overflow: 'hidden',
    },
  },
  root: {
    boxSizing: 'border-box',
    position: 'fixed',
    width: '100%',
    height: '100%',
  },
  div: {
    boxSizing: 'border-box',
    position: 'absolute',
    width: '100%',
    height: '75vh',
    willChange: 'transform',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerDiv: {
    zIndex: '1',  
    boxSizing: 'border-box',
    backgroundColor: 'white',
    backgroundSize: 'auto 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    width: '35vh',
    maxWidth: '280px',
    height: '80vh',
    maxHeight: '500px',
    willChange: 'transform',
    borderRadius: '30px',
    boxShadow: '0 12.5px 100px -10px rgba(90, 90, 90, 0.4), 0 10px 10px -10px rgba(90, 90, 90, 0.3)',
    color: "white",
    display: 'flex',
    backgroundSize: '35vh 75vh',
  },

  text: {
    width: '60vw',
    textShadow: '2px 2px rgba(0, 0, 0, 1)',
  },

  boldText: {
    textShadow: '2px 2px rgba(0, 0, 0, 1)',
    fontSize: '20px'
  },
  container: {
    position: 'relative',
    padding: '0 0px 15px 10px',
    bottom:'0',
  },
}))

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })
const from = i => ({ x: 0, y: i * -4, scale: .2, rot: -10 + Math.random() * 20, delay: i * 100 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`



const Deck = (props) => {
  const {startTime, endTime, type, userName, loc, gotData, ...rest} = props;
  const classes = useStyles()
  const [gone] = useState(() => new Set())
  const [matching, setMatching] = useState([]);
  const [ps, set] = useSprings(matching.length, i => ({ ...to(i), from: from(i) })) 
  const b1 = useDrag(({ args: [index], down, movement: [mx], distance, direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index)
    if (!down && trigger) {
      if (dir == 1) {
        match(userName, matching[index].username, startTime, endTime, type, matching[index].name, "YES");
      } else {
        match(userName, matching[index].username, startTime, endTime, type, matching[index].name, "NO");
      }
    }
    set(i => {
      if (index !== i) return 
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 } }
    })
    
  })

  function match(userName, who, startTime, endTime, type, name, decision) {
    if (typeof window !== 'undefined') {
      fetch('https://matchsitebackend.herokuapp.com/matched/set', {
                  method: 'PUT',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      "account": userName,
                      "who": who,
                      "startTime": startTime,
                      "endTime": endTime,
                      "type": type,
                      "decision": decision,
                  })
                  })
                  .then(res => res.json())
                  .then(data => {
                      if (data.success) {
                        console.log('match inserted to db');
                        if (data.matched) {
                          alert("CONGRATS! you just matched with " + name)
                        }
                      } else {
                          alert('there is an error!');
                      }
                      })
    }
  }
  
  useEffect(() => {
    if (typeof window !== 'undefined' && gotData) {
      fetch('https://matchsitebackend.herokuapp.com/matching/get', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "account": userName,
              "startTime": startTime,
              "endTime": endTime,
              "type": type,
              "loc": loc,
          })
          })
          .then(res => res.json())
          .then(data => {
              if (data.success) {
              console.log('got info');
              console.log(data.data);
              setMatching(data.data);
              } else {
                console.log('NO ONE TO MATCH :(')
                setMatching([]);
              }
              })
      }}, [type, startTime, endTime, gotData]);
  
  return (
    <div className={classes.root}>
      <header>
      <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width"
      />
      </header>
    <div>
    <Grid container>  
    {ps.map(({ x, y, rot, scale }, i) => (
    <animated.div className={classes.div} key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
      <animated.div {...b1(i)}
        className={classes.innerDiv}
        style={{ transform: interpolate([rot, scale], trans), backgroundImage: `url(${"https://matchsiteimg.s3.ap-northeast-2.amazonaws.com/"+matching[i].image_path})` }}>
        <Grid container justify="flex-end" direction="column" alignItems="stretch" className={classes.container}>
        <Grid item className={classes.test}>
      <Typography className={classes.boldText}>{matching[i].name},{matching[i].age}</Typography>
        </Grid>
        <Grid item className={classes.text}>
          <Typography>{matching[i].msg}</Typography>
        </Grid>
      </Grid>
      </animated.div>
    </animated.div>))}
    </Grid>
    </div>
    </div>
  )
}


export default Deck;