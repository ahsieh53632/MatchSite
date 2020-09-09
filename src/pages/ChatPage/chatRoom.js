import React, {useEffect, Component } from 'react';
import socketIOClient from "socket.io-client";
import ChatRoomHeader from './chatRoomHeader';
import { makeStyles } from '@material-ui/styles'
import MessageList from './MessageList'
import CssBaseline from '@material-ui/core/CssBaseline'


const ENDPOINT = "https://matchsitebackend.herokuapp.com/"

function mysqlTimeStampToDate(timestamp) {
    //function parses mysql datetime string and returns javascript Date object
    //input has to be in this format: 2007-06-05 15:26:02
    var regex=/^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])T(?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9])).000Z?$/;
    var parts=timestamp.replace(regex,"$1 $2 $3 $4 $5 $6").split(' ');
    return new Date(parts[0],parts[1]-1,parts[2],parts[3],parts[4],parts[5]);
}

const ChatRoom = (props) => {
    const {user, to, phone} = props || {user: "", to: ""};
    const [msgs, setMsgs] = React.useState([]);

    const onSend = (msg) => {

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
        setMsgs([...msgs, {
            id: new Date().toLocaleDateString(),
            author: user,
            message: msg,
            timestamp: require('moment')().format("YYYY-MM-DD HH:mm:ss")
        }])
    }
    
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.emit('join', user);
        socket.on('message', msg => {setMsgs([...msgs, msg])});
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
        return () => socket.disconnect();
    }, [])

    return (
        <>
            <CssBaseline />
            <ChatRoomHeader userName={user} phone={phone}/>
            <div>
                <MessageList user={user} messages={msgs} onSend={(message) => onSend(message)}/>
            </div>
        </>
        )


}

export default ChatRoom;