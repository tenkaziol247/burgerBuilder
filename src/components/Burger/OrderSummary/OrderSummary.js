import React, { Component } from 'react';

import Aux from '../../../hoc/Auxilliary/Auxiliary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
    //This could be a funcitonal component, doesn't have to be a class
    // componentWillUpdate() {
    //     console.log('[OrderSummary.js] Will Update')
    // }

    render() {
        const orderList = Object.keys(this.props.ingredients)
            .map(igKey => {
                return (<li key={igKey} style={{ textTransform: 'uppercase' }}>{igKey} : {this.props.ingredients[igKey]}</li>)
            })

        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A delicious with ingredients:</p>
                <ul>
                    {orderList}
                </ul>
                <hr />
                <p><strong>Total Price: {(this.props.totalPrice).toFixed(2)}</strong></p>
                <p>Continue to Checkout?</p>
                <Button buttonClicked={this.props.cancelHandler} btnType='Danger'>CANCEL</Button>
                <Button buttonClicked={this.props.continueHandler} btnType='Success'>CONTINUE</Button>
            </Aux>
        );
    }
}

export default OrderSummary;