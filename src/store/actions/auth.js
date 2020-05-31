import axios from 'axios';

import * as actionTypes from './actionTypes';

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

const authSuccess = (token, id) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: id
    };
};

const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

const checkAuthTimeout = (expirationTime) => (dispatch) => {
    setTimeout(() => {
        dispatch(authLogout());
    }, expirationTime * 1000)
};

export const auth = (email, password, isSignUp) => (dispatch) => {
    dispatch(authStart());
    const authData = {
        email: email,
        password: password,
        returnSecureToken: true
    }
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDPuTQl_Oeo70CisNJCbN_w6b99Lve8cBc';
    if (isSignUp) {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDPuTQl_Oeo70CisNJCbN_w6b99Lve8cBc';
    }
    axios.post(url,
        authData)
        .then((response) => {
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('userId', response.data.localId);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn));
        })
        .catch(error => dispatch(authFail(error.response.data.error.message)))
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
        dispatch(authLogout());
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if (expirationDate <= new Date()) {
            dispatch(authLogout());
        } else {
            const userId = localStorage.getItem('userId');
            dispatch(authSuccess(token, userId));
            dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
        }
    }
}