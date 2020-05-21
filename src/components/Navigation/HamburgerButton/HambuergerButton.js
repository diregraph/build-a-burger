import React from 'react';

import classes from './HamburgerButton.module.css';

const hambuergerButton = (props) => (
    <button
        onClick={props.clicked}
        className={classes.Button}>
        <div className={classes.HambuergerButton}></div>
        <div className={classes.HambuergerButton}></div>
        <div className={classes.HambuergerButton}></div>
    </button>
);

export default hambuergerButton;