import React from 'react';
import ChatRoom from './ChatPage/chatRoom'
import { navigate } from 'gatsby'

export default ({location}) => (
    <ChatRoom 
        user={(typeof window !== 'undefined') ? location.state.user : ""} 
        to={(typeof window !== 'undefined') ? location.state.to : ""}
        phone={(typeof window !== 'undefined') ? location.state.phone : ""}
    />
);