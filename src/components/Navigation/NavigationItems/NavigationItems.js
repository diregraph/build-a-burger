import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';

const navigationItems = (props) => {
    return (<ul className={classes.NavigationItems}>
        <NavigationItem link="/build-a-burger" clicked={props.close} >Burger Builder</NavigationItem>
        {props.isAuthenticated ?
            <NavigationItem link="/orders" clicked={props.close} >Orders</NavigationItem> :
            null}
        {props.isAuthenticated ?
            <NavigationItem link="/signout" clicked={props.close} >Sign Out</NavigationItem> :
            <NavigationItem link="/auth" clicked={props.close} >Sign In / Sign Up</NavigationItem>
        }

    </ul>);
};

export default navigationItems;