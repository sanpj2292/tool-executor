import React from 'react';
import Markdown from '../markdown/markdown';
import './preview.scss';

const Preview = ({ prevClassName, name, previewValue, ...otherProps }) => {
    return (
        <div className={`preview ${prevClassName}`.trim()}>
            <Markdown name={name}
                value={previewValue}
                {...otherProps}
            />
        </div>
    );
}

export default Preview;