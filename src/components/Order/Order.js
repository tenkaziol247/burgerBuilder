import React from 'react';

import classes from './Order.module.css';

const order = (props) => {
    let ingredients = [];
    for(let ingredientName in props.ingredients){
        ingredients.push(
            {
                name: ingredientName, 
                amout: props.ingredients[ingredientName]
            });
    }

    let ingredientsOutput = ingredients.map(ig => {
        return <span 
            key={ig.name} 
            style={{
                display: 'inline-block', 
                textTransform: 'capitalize',
                margin: '0 10px',
                padding: '5px',
                boxSizing: 'border-box',
                border: '1px solid #ccc'
            }}>{ig.name} ({ig.amout})</span>
    })

    return (
        <div className={classes.Order}>
            <p>Ingredients: {ingredientsOutput}</p>
    <p>Price: <strong>{Number.parseFloat(props.price).toFixed(2)}</strong></p>
        </div>
    );
}

export default order;