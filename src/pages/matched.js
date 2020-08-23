import React from 'react';
import SideBar from './MainPage/sideBar'
import { navigate } from 'gatsby'

export default ({location}) => (
    <SideBar userName={(typeof window !== 'undefined') ? location.state.username : ""} />
);