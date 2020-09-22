import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxilliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actionTypes from '../../store/action';



class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        // axios.get('/ingredients.json')
        //     .then(response => {
        //         this.setState({ ingredients: response.data });
        //     })
        //     .catch(error => {
        //         this.setState({error: true})
        //     });
    }

    updatePurchaseState(ingredients) {
        let sum = Object.values(ingredients).reduce((total, item) => {
            return total + item;
        }, 0);
        return sum > 0;
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
        this.props.history.push('/checkout');
    }

    render() {
        let disableIngredient = { ...this.props.ings };
        for (let key in disableIngredient) {
            disableIngredient[key] = disableIngredient[key] <= 0;
        }
        let orderSummary = null;
        
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

        if(this.props.ings){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemove={this.props.onIngredientRemoved}
                        disableIngredient={disableIngredient}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        btnClicked={this.modalShowHandler} />
                </Aux>
            );
            orderSummary = <OrderSummary
            ingredients={this.props.ings}
            totalPrice={this.props.price}
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));