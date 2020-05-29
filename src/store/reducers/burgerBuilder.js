import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT: {
            const updatedIngredients = {
                ingredients: updateObject(
                    state.ingredients, 
                    { [action.ingredientType]: state.ingredients[action.ingredientType] + 1 }),
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientType]
            };
            return updateObject(state, updatedIngredients);
        }
        case actionTypes.REMOVE_INGREDIENT: {
            const updatedIngredients = {
                ingredients: updateObject(
                    state.ingredients, 
                    { [action.ingredientType]: state.ingredients[action.ingredientType] - 1 }),
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientType]
            };
            return updateObject(state, updatedIngredients);
        }
        case actionTypes.SET_INGREDIENT: {
            return updateObject(state, {
                ingredients: action.ingredients, 
                totalPrice: 4,
                error: false});
        }
        case actionTypes.FETCH_INGREDIENT_FAILED: {
            return updateObject(state, {error: true});
        }
        default:
            return state;
    }
}

export default reducer;