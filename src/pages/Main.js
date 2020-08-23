import React from 'react';
import MainPage from './MainPage/mainPage'
import { navigate } from 'gatsby'

export default ({location}) => (
    <MainPage userName={location.state.username} />
);