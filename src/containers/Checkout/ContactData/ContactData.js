import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false,
            errorMessage: 'Please enter a valid name!'
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
            touched: false,
            errorMessage: 'Please enter a valid street!'
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
                minLength: 5,
                maxLength: 5,
                isNumeric: true
            },
            valid: false,
            touched: false,
            errorMessage: 'Please enter a valid ZIP code, have 5 numbers!'
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
            touched: false,
            errorMessage: 'Please enter a valid country!'
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your E-mail'
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
        deliveryMethod: {
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
    })
    const [formIsValid, setFormIsValid] = useState(false);


    const orderHandler = (event) => {
        event.preventDefault();
        let formData = {};
        for (let formElementIdentifier in orderForm) {
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: props.ings,
            price: props.price,
            orderData: formData,
            userId: props.userId
        }

        props.onOrderBurger(order, props.token);
    }

    const inputChangedHandler = (event, inputIdentifier) => {
        let updateOrderForm = updateObject(orderForm, {
            [inputIdentifier]: updateObject(orderForm[inputIdentifier], {
                value: event.target.value,
                valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
                touched: true
            })
        });

        let formIsValid = true;
        for (let inputIdentifier in updateOrderForm) {
            formIsValid = updateOrderForm[inputIdentifier].valid && formIsValid;
        }

        setOrderForm(updateOrderForm);
        setFormIsValid(formIsValid);
    }

    let formElementArr = [];
    for (let key in orderForm) {
        formElementArr.push({
            id: key,
            config: orderForm[key]
        })
    }

    let form = (
        <form onSubmit={orderHandler}>
            {formElementArr.map(formElement => {
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
            })}
            <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
        </form>
    );
    if (props.loading) {
        form = (<Spinner />);
    };

    return (
        <div className={classes.ContactData}>
            <h4>Enter Your Contact Data</h4>
            {form}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.idToken,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (order, token) => dispatch(actions.purchaseBurger(order, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));