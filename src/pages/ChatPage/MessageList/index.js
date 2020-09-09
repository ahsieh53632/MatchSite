import React, {useEffect, useState} from 'react';
import Message from '../Message';
import moment from 'moment';
import Compose from '../Compose';
import './MessageList.css';
import socketIOClient from "socket.io-client";

const ENDPOINT = "https://matchsitebackend.herokuapp.com/"
const socket = socketIOClient(ENDPOINT);

function mysqlTimeStampToDate(timestamp) {
  //function parses mysql datetime string and returns javascript Date object
  //input has to be in this format: 2007-06-05 15:26:02
  var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])T(?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9])).000Z?$/;
  var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
  return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
}

export default function MessageList(props) {
  const {user, to, ...rest} = props;
  const [messages, setMsgs] = useState([]);

  console.log(user, to);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        fetch('https://matchsitebackend.herokuapp.com/msg/get', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "account": user,
                "to": to,
            })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const fetchedMsgs = data.data.map((row, i) => {
                        return {
                            id: i,
                            author: row.userName,
                            message: row.msg,
                            timestamp: mysqlTimeStampToDate(row.time)
                        }
                    })
                    console.log(fetchedMsgs);
                    setMsgs(fetchedMsgs);
                } else {
                  console.log('ERROR')
                }})
    }
  }, [user, to]);

  useEffect(() => {
    socket.connect();
    socket.emit('join', user);
    socket.on('message', msg => {
      const nextState = messages.slice();
      nextState.push(msg);
      setMsgs(nextState);
    });

    return () => socket.off('message');
  }, [messages]);

  const onSend = (e, msg) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
        fetch('https://matchsitebackend.herokuapp.com/msg/post', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "account": user,
                "to": to,
                "msg": msg,
            })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log('successfully added to db')
                } else {
                    console.log('ERROR')
                }
            })
    }
    socket.emit('new msg', {room: to, msg: {
        id: new Date().toLocaleDateString(),
        author: user,
        message: msg,
        timestamp: require('moment')().local().format("YYYY-MM-DD HH:mm:ss")
    }});

    setMsgs([...messages, {
        id: new Date().toLocaleDateString(),
        author: user,
        message: msg,
        timestamp: require('moment')().local().format("YYYY-MM-DD HH:mm:ss")
    }])
  }

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages ? messages.length : 0;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === user;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.author === current.author;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  }

    return(
      <div className="message-list">
        <div className="message-list-container" style={{padding: '10px', paddingBottom: '70px'}}>{renderMessages()}</div>
        <Compose onSend={(e, msg) => onSend(e, msg)}/>
      </div>
    );
}