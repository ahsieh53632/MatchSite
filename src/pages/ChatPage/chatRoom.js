import React, {useEffect, Component } from 'react';
import ChatRoomHeader from './chatRoomHeader';
import { makeStyles } from '@material-ui/styles'
import MessageList from './MessageList'
import CssBaseline from '@material-ui/core/CssBaseline'





const ChatRoom = (props) => {
    const {user, to, phone} = props || {user: "", to: ""};
    const [msgs, setMsgs] = React.useState([]);

    
    return (
        <>
            <CssBaseline />
            <ChatRoomHeader userName={user} phone={phone}/>
            <div>
                <MessageList user={user} to={to}/>
            </div>
        </>
        )


}

export default ChatRoom;