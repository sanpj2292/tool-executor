import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { connect } from "react-redux";

import { dismissAlert } from "../../redux/actions";

import './timeout-alert.scss';

const TimeoutAlert = (props) => {
    const { alert: { show, variant, message }, timeout, dismissAlert } = props;
    // componentDidMount & componentWillUnmount
    useEffect(() => {
        const timer = setTimeout(dismissAlert, timeout ? timeout : 3000);
        return () => {
            clearTimeout(timer)
            dismissAlert()
        };
    }, []);

    return (
        <Alert className='transit rounded' show={show} variant={variant}
            onClose={dismissAlert}
            dismissible>
            {message}
        </Alert>
    );
}

const mapStateToProps = state => ({
    alert: state.alert
});

const mapDispatchToProps = dispatch => ({
    dismissAlert: () => dispatch(dismissAlert())
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeoutAlert);