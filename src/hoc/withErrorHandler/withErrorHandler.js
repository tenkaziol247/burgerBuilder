import React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxilliary/Auxiliary';
import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {
    return (props) => {
        const [ error, clearError ] = useHttpErrorHandler(axios);
        // const [error, setError] = useState(null);

        // const reqInterceptors = axios.interceptors.request.use(req => {
        //     setError(null);
        //     return req;
        // });
        // const resInterceptors = axios.interceptors.response.use(res => res, err => {
        //     setError(err);
        // });
    
        // useEffect(() => {
        //     return (() => {
        //         axios.interceptors.request.eject(reqInterceptors);
        //         axios.interceptors.response.eject(resInterceptors);
        //     });
        // }, [reqInterceptors, resInterceptors]);
    
        // const errorConfirmHandler = () => {
        //     setError(null);
        // };

        return (
            <Aux>
                <Modal
                    show={error}
                    removedModal={clearError}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );
    }
}

export default withErrorHandler;