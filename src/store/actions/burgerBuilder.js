import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';
import { setAuthRedirectPath } from './index';


export const addIngredient = (type) => {
    return {
        type: actionTypes.ADD_INGREDIENT, ingredientType: type
    }
};

export const removeIngredient = (type) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT, ingredientType: type
    }
};

const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENT,
        ingredients: ingredients
    }
}

const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENT_FAILED,
    }
}

export const initIngredients = () => {
    return dispatch => {
        axios.get('/ingredients.json')
            .then(response => {
                dispatch(setIngredients(response.data));
                dispatch(setAuthRedirectPath('/'));
            })
            .catch(error => dispatch(fetchIngredientsFailed()));
    }
}