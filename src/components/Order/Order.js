import React from 'react';

import classes from './Order.module.css';

const order = (props) => {
    const ingredients = [];
    for (let i in props.ingredients) {
        ingredients.push({
            name: i,
            amount: props.ingredients[i]
        });
    }
    const ingredientsJSX = ingredients.map(ig => (
        <span
            key={ig.name}
            style={{
                textTransform: "capitalize",
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
            }}>
            {ig.name} ({ig.amount})
        </span>
    ));
    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientsJSX}</p>
            <p>Price: <strong>USD {props.price.toFixed(2)}</strong></p>
        </div>
    );
};

export default order;