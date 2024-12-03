import { io } from 'socket.io-client';

const {REACT_APP_API_HOST} = process.env

const URL =  REACT_APP_API_HOST;

export const socket = io(URL);