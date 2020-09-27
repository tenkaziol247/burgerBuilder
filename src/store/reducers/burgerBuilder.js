import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false
}

const INGREDIENTS_PRICES = {
    salad: 0.4,
    cheese: 0.7,
    bacon: 1.4,
    meat: 2.1
};

const addIngredient = (state, action) => {
    let updateIngredient = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
    let updateIngredients = updateObject(state.ingredients, updateIngredient);
    let updateState = {
        ingredients: updateIngredients,
        totalPrice: state.totalPrice + INGREDIENTS_PRICES[action.ingredientName]
    }
    return updateObject(state, updateState);
}

const removeIngredient = (state, action) => {
    let updateIng = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
    let updateIngs = updateObject(state.ingredients, updateIng);
    let updateSta = {
        ingredients: updateIngs,
        totalPrice: state.totalPrice - INGREDIENTS_PRICES[action.ingredientName]
    }
    return updateObject(state, updateSta);
}

const setIngredients = (state, action) => {
    return updateObject(state, {
        ingredients: {
            salad: action.ingredients.salad,
            cheese: action.ingredients.cheese,
            bacon: action.ingredients.bacon,
            meat: action.ingredients.meat
        },
        totalPrice: 4,
        error: false
    });
}

const fetchIngredientsFailed = (state, action) => {
    return updateObject(state, {error: true});
}

const reducer = (state = initialState, action) => {
    switch (action.type){
        case actionTypes.ADD_INGREDIENT: return addIngredient(state, action); 
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action); 
        case actionTypes.SET_INGREDIENTS: return setIngredients(state, action); 
        case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action); 
        default: return state;
    }
}

export default reducer;