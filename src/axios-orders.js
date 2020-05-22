import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://build-a-burger-bb28e.firebaseio.com'
});

export default instance;