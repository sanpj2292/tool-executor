import React from 'react';
import Markdown from '../markdown/markdown';
import './preview.scss';

const Preview = ({ name, previewValue, ...otherProps }) => {
    return (
        <div className='preview'>
            <Markdown name={name}
                value={previewValue}
                {...otherProps}
            />
        </div>
    );
}

export default Preview;