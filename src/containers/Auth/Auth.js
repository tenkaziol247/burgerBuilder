import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = props => {

    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Enter Email'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false,
            errorMessage: 'Please enter a valid email!'
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Enter Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false,
            errorMessage: 'Please enter a valid password, min length 6 char!'
        }
    });
    const [isSignUp, setIsSignUp] = useState(true);

    const { buildingBurger, authRedirectPath, onSetInitRedirect } = props;

    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetInitRedirect();
        }
    }, [buildingBurger, authRedirectPath, onSetInitRedirect]);

    const inputChangedHandler = (event, controlName) => {
        let updateControls = updateObject(controls, {
            [controlName]: updateObject(controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true
            })
        });
        setControls(updateControls);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value, controls.password.value, isSignUp);
    }

    const switchAuthModeHandler = () => {
        setIsSignUp(prevState => !prevState);
    }

    let formElementArr = [];
    for (let key in controls) {
        formElementArr.push({
            id: key,
            config: controls[key]
        })
    }

    let form = (
        formElementArr.map(formElement => {
            return <Input
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                key={formElement.id}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                errorMessage={formElement.config.errorMessage}
                changed={(event) => inputChangedHandler(event, formElement.id)} />
        })
    );

    if (props.loading) {
        form = <Spinner />
    }

    let errorMessage = null;
    if (props.error) {
        errorMessage = <p>{props.error.message}</p>
    }

    let loginRedirect = null;
    if (props.isAuthenticated) {
        loginRedirect = <Redirect to={props.authRedirectPath} />
    }

    return (
        <div className={classes.Auth}>
            {loginRedirect}
            <form onSubmit={submitHandler}>
                <h4 className={classes.Title}>{isSignUp ? "SIGN UP" : "SIGN IN"}</h4>
                {errorMessage}
                {form}
                <Button btnType="Success">SUBMIT</Button>
            </form>
            <Button btnType="Danger" buttonClicked={switchAuthModeHandler}>SWITCH TO {isSignUp ? "SIGN IN" : "SIGN UP"}</Button>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.idToken !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetInitRedirect: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);