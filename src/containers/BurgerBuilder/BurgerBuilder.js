import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENTS_PRICES = {
    salad: 0.4,
    cheese: 0.7,
    bacon: 1.4,
    meat: 2.1
};

class BurgerBuilder extends Component{

    state = {
        ingredients: {
            salad: 0,
            cheese: 0,
            bacon: 0,
            meat: 0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false
    }

    updatePurchaseState (ingredients){
        let sum = Object.values(ingredients).reduce((total, item) => {
            return total + item;
        }, 0);
        if(sum > 0){
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
        let currentIngredient = {...this.state.ingredients};
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
        if(oldQuantity <= 0){
            return;
        }
        let newQuantity = oldQuantity - 1;
        let currentIngredient = {...this.state.ingredients};
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
        this.setState({purchasing: true});
    }

    modalHideHandler = () => {
        this.setState({purchasing: false});
    }

    render(){
        let disableIngredient = {...this.state.ingredients};
        for(let key in disableIngredient){
            disableIngredient[key] = disableIngredient[key] <= 0;
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} removedModal={this.modalHideHandler}>
                    <OrderSummary ingredients={this.state.ingredients} />
                </Modal>
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
    }
}  

export default BurgerBuilder;