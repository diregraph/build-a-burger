import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as orderActions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    maxLength: 5,
                    minLength: 5,
                    isNumeric: true
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your e-mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            deliveryOption: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault()

        const formData = {};
        for (let formElement in this.state.orderForm) {
            formData[formElement] = this.state.orderForm[formElement].value
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId
        }
        this.props.onOrderBurger(order, this.props.token);
    }

    checkValidity(rules, value) {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }

    inputChangeHandler = (event, formElementId) => {
        const updatedOrderForm = { ...this.state.orderForm };
        const updatedFormElement = { ...updatedOrderForm[formElementId] };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(
            updatedFormElement.validation, updatedFormElement.value
        )
        updatedFormElement.touched = true;
        updatedOrderForm[formElementId] = updatedFormElement;
        let formIsValid = true;
        for (let updatedOrderFormElementId in updatedOrderForm) {
            formIsValid =
                updatedOrderForm[updatedOrderFormElementId].valid && formIsValid;
        }
        this.setState({
            orderForm: updatedOrderForm,
            formIsValid: formIsValid
        })
    }

    render() {
        let contactData = <Spinner />
        if (!this.props.loading) {
            const formElementArray = [];
            for (let key in this.state.orderForm) {
                formElementArray.push({
                    id: key,
                    config: this.state.orderForm[key]
                });
            }
            contactData = (
                <React.Fragment>
                    <h4>Enter your ContactData</h4>
                    <form onSubmit={this.orderHandler}>
                        {formElementArray.map(formElement => (
                            <Input
                                key={formElement.id}
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                value={formElement.config.value}
                                changed={event => this.inputChangeHandler(event, formElement.id)}
                                invalid={!formElement.config.valid}
                                touched={formElement.config.touched}
                                valueType={formElement.id} />
                        ))}
                        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
                    </form>
                </React.Fragment>
            );
        }
        return (
            <div className={classes.ContactData} >
                {contactData}
            </div>
        );

    }

};

const mapStateToProps = state => {
    return {
        ingredients: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(orderActions.purchaseBurger(orderData, token))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));