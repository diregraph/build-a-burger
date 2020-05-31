import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import { updateObject, checkValidity } from '../../shared/utility';
import * as authActions from '../../store/actions/index';


class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'E-mail',
                    autoComplete: 'username'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password',
                    autoComplete: 'current-password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        },
        isSignUp: false
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    switchAuthMethodHandler = () => {
        this.setState((prevState) => ({ isSignUp: !prevState.isSignUp }));
    }

    inputChangeHandler = (event, controlName) => {
        const controlElement = this.state.controls[controlName];
        const updatedControls = updateObject(
            this.state.controls,
            {
                [controlName]: updateObject(
                    controlElement,
                    {
                        value: event.target.value,
                        valid: checkValidity(controlElement.validation, event.target.value),
                        touched: true
                    })
            }
        )
        this.setState({
            controls: updatedControls
        });
    }

    onSubmitHandler = (event) => {
        event.preventDefault()
        this.props.onAuth(
            this.state.controls.email.value,
            this.state.controls.password.value,
            this.state.isSignUp);
        this.setState({
            controls: {
                email: updateObject(
                    this.state.controls.email,
                    { value: '' }),
                password: updateObject(
                    this.state.controls.password,
                    { value: '' }),
            }
        });
    }

    parseErrorMessage(errorCode) {
        switch (errorCode) {
            case 'INVALID_EMAIL':
                return 'Hmm... Are you sure the e-mail is valid?';
            case 'EMAIL_NOT_FOUND':
                return 'Hmm... We couldn\'t find an account for this email';
            case 'INVALID_PASSWORD':
                return 'Hmm... The password is incorrect.';
            case 'MISSING_PASSWORD':
                return 'Oops... The password is missing.';
            case 'USER_DISABLED':
                return 'Yikes! Your accounts is disabled, contact us to see why.';
            case 'EMAIL_EXISTS':
                return 'Oh snap! There\'s an existing account for this e-mail';
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                return 'Umm... Something\'s not right, try again later';
            case 'WEAK_PASSWORD: Password should be at least 6 characters ':
                return 'Password should be at least 6 characters.';
            default:
                return null;
        }
    }

    render() {
        let authForm = <Spinner />
        if (!this.props.loading) {
            const formElementArray = [];
            for (let key in this.state.controls) {
                formElementArray.push({
                    id: key,
                    config: this.state.controls[key]
                });
            }

            let errorMessage = null;
            if (this.props.error) {
                errorMessage =
                    <p className={classes.Error}>
                        {this.parseErrorMessage(this.props.error)}
                    </p>
            }

            authForm = (
                <React.Fragment>
                    <h4>Sign {!this.state.isSignUp ? ' In' : ' Up'} to build your favorite burger.</h4>
                    {errorMessage}
                    <form onSubmit={this.onSubmitHandler}>
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
                        <Button btnType="Success" >Next</Button>
                    </form>
                    <Button
                        clicked={this.switchAuthMethodHandler}
                        btnType="Danger" >Switch to Sign{this.state.isSignUp ? ' In' : ' Up'}</Button>
                </React.Fragment>

            );

        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {

            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        return (
            <div className={classes.AuthForm}>
                {authRedirect}
                {authForm}
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        error: state.auth.error,
        loading: state.auth.loading,
        isAuthenticated: state.auth.token != null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirect
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(authActions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(authActions.setAuthRedirectPath('/'))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);