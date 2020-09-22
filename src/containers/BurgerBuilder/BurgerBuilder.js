import React, { Component } from 'react';

import Aux from '../../hoc/Auxilliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';

const INGREDIENTS_PRICES = {
    salad: 0.4,
    cheese: 0.7,
    bacon: 1.4,
    meat: 2.1
};

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data });
            })
            .catch(error => {
                this.setState({error: true})
            });
    }

    updatePurchaseState(ingredients) {
        let sum = Object.values(ingredients).reduce((total, item) => {
            return total + item;
        }, 0);
        if (sum > 0) {
            this.setState({
                purchasable: true
            })
        } else {
            this.setState({
                purchasable: false
            })
        }
    }

    addIngredientHandler = (type) => {
        let oldQuantity = this.state.ingredients[type];
        let newQuantity = oldQuantity + 1;
        let currentIngredient = { ...this.state.ingredients };
        currentIngredient[type] = newQuantity;
        let priceAddition = INGREDIENTS_PRICES[type];
        let newTotalPrice = this.state.totalPrice + priceAddition;
        this.setState({
            ingredients: currentIngredient,
            totalPrice: newTotalPrice
        });
        this.updatePurchaseState(currentIngredient);
    }

    removeIngredientHandler = (type) => {
        let oldQuantity = this.state.ingredients[type];
        if (oldQuantity <= 0) {
            return;
        }
        let newQuantity = oldQuantity - 1;
        let currentIngredient = { ...this.state.ingredients };
        currentIngredient[type] = newQuantity;
        let priceAddition = INGREDIENTS_PRICES[type];
        let newTotalPrice = this.state.totalPrice - priceAddition;
        this.setState({
            ingredients: currentIngredient,
            totalPrice: newTotalPrice
        });
        this.updatePurchaseState(currentIngredient);
    }

    modalShowHandler = () => {
        this.setState({ purchasing: true });
    }

    modalHideHandler = () => {
        this.setState({ purchasing: false });
    }

    purchasingCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchasingContinueHandler = () => {
        // alert('You continue!');
        
        let queryParams = [];
        for(let index in this.state.ingredients){
            queryParams.push(encodeURIComponent(index) + '=' + encodeURIComponent(this.state.ingredients[index]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        let queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {
        let disableIngredient = { ...this.state.ingredients };
        for (let key in disableIngredient) {
            disableIngredient[key] = disableIngredient[key] <= 0;
        }
        let orderSummary = null;
        
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemove={this.removeIngredientHandler}
                        disableIngredient={disableIngredient}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        btnClicked={this.modalShowHandler} />
                </Aux>
            );
            orderSummary = <OrderSummary
            ingredients={this.state.ingredients}
            totalPrice={this.state.totalPrice}
            cancelHandler={this.purchasingCancelHandler}
            continueHandler={this.purchasingContinueHandler} />;
        }
        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        
        return (
            <Aux>
                <Modal show={this.state.purchasing} removedModal={this.modalHideHandler}>
                    {orderSummary}
                </Modal>
            {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);