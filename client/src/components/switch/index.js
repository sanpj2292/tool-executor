import React from 'react';
import './switch.css';

export default ({ checked, className, onChange, label, disabled, ...otherProps }) => {
    return (
        <div className=' switch'>
            {
                label !== '' && label ? (
                    <label
                        htmlFor="preview">
                        {label}
                    </label>) : null}
            <div className={`slider round ${checked ? 'active' : ''}
            ${disabled ? 'disabled' : ''}`.trim()}
                name='preview' onClick={onChange}></div>
        </div>
    );
}