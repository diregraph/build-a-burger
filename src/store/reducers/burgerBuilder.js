import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: true
};

const addIngredient = (state, action) => {
    const updatedIngredients = {
        ingredients: updateObject(
            state.ingredients,
            { [action.ingredientType]: state.ingredients[action.ingredientType] + 1 }),
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientType],
        building: true
    };
    return updateObject(state, updatedIngredients);
};

const removeIngredient = (state, action) => {
    const updatedIngredients = {
        ingredients: updateObject(
            state.ingredients,
            { [action.ingredientType]: state.ingredients[action.ingredientType] - 1 }),
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientType],
        building: true
    };
    return updateObject(state, updatedIngredients);
};

const setIngredients = (state, action) => {
    return updateObject(state, {
        ingredients: action.ingredients,
        totalPrice: 4,
        error: false,
        building: false
    });
};

const fetchIngredient = (state) => {
    return updateObject(state, { error: true });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENT: return setIngredients(state, action);
        case actionTypes.FETCH_INGREDIENT_FAILED: return fetchIngredient(state);
        default: return state;
    }
};

export default reducer;