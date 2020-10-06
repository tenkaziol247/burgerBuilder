import React from 'react';

import classes from './Modal.module.css';
import Aux from '../../../hoc/Auxilliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

const Modal = props => {
    // shouldComponentUpdate(nextProps, nextState){
    //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    // }

    // componentWillUpdate(){
    //     console.log('[Modal.js] Will Update')
    // }

    return (
        <Aux>
            <Backdrop show={props.show} backdropClicked={props.removedModal} />
            <div
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-200vh)',
                    opacity: props.show ? '1' : '0'
                }}
                className={classes.Modal}>
                {props.children}
            </div>
        </Aux>
    );
}

export default React.memo(
    Modal,
    (prevProps, nextProps) =>
        nextProps.show === prevProps.show && nextProps.children === prevProps.children
);