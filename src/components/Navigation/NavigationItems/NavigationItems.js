import React from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem exact link="/">Burger Builder</NavigationItem>
        {props.isAuthenticated ? <NavigationItem link="/orders">Checkout</NavigationItem> : null}
        {props.isAuthenticated 
            ?<NavigationItem link="/logout">Logout</NavigationItem>
            :<NavigationItem link="/auth">Authentication</NavigationItem>}
    </ul>
);

export default navigationItems;