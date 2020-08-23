import React from 'react';
import MainPage from './MainPage/mainPage'
import { navigate } from 'gatsby'

export default ({location}) => (
    <MainPage userName={(typeof window !== 'undefined') ? location.state.username : ""} />
);