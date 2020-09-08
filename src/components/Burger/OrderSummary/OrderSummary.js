import React from 'react';

import Aux from '../../../hoc/Auxiliary';

const orderSummary = (props) => {

    const orderList = Object.keys(props.ingredients)
        .map(igKey => {
            return (<li key={igKey} style={{ textTransform: 'uppercase' }}>{igKey} : {props.ingredients[igKey]}</li>)
        })

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious with ingredients:</p>
            <ul>
                {orderList}
            </ul>
            <p>Continue to Checkout?</p>
        </Aux>
    )
}

export default orderSummary;