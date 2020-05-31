import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';

const navigationItems = (props) => {
    return (<ul className={classes.NavigationItems}>
        <NavigationItem link="/build-a-burger" >Burger Builder</NavigationItem>
        {props.isAuthenticated ? <NavigationItem link="/orders" >Orders</NavigationItem> : null}
        {props.isAuthenticated ? 
        <NavigationItem link="/signout" >Sign Out</NavigationItem> : 
        <NavigationItem link="/auth" >Sign In / Sign Up</NavigationItem>
        }
        
    </ul>);
};

export default navigationItems;