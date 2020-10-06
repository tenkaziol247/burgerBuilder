import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Aux from '../../hoc/Auxilliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';



const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });

    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice;
    });

    const error = useSelector(state => {
        return state.burgerBuilder.error;
    });

    const isAuthenticated = useSelector(state => {
        return state.auth.idToken !== null;
    });

    const dispatch = useDispatch();

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedictPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        let sum = Object.values(ingredients).reduce((total, item) => {
            return total + item;
        }, 0);
        return sum > 0;
    };

    const modalShowHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedictPath('/checkout');
            props.history.push('/auth');
        }
    }

    const modalHideHandler = () => {
        setPurchasing(false);
    }

    const purchasingCancelHandler = () => {
        setPurchasing(false);
    }

    const purchasingContinueHandler = () => {
        // alert('You continue!');
        onInitPurchase();
        props.history.push('/checkout');
    }

    let disableIngredient = { ...ings };
    for (let key in disableIngredient) {
        disableIngredient[key] = disableIngredient[key] <= 0;
    }
    let orderSummary = null;

    let burger = error  ? <p>Ingredients can't be loaded!</p> : <Spinner />

    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemove={onIngredientRemoved}
                    disableIngredient={disableIngredient}
                    price={price}
                    purchasable={updatePurchaseState(ings)}
                    btnClicked={modalShowHandler}
                    isAuth={isAuthenticated} />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={ings}
            totalPrice={price}
            cancelHandler={purchasingCancelHandler}
            continueHandler={purchasingContinueHandler} />;
    }
    // if (this.state.loading) {
    //     orderSummary = <Spinner />
    // }

    return (
        <Aux>
            <Modal show={purchasing} removedModal={modalHideHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
}

export default withErrorHandler(BurgerBuilder, axios);