import React from 'react';

const FileUpload = (props) => {
    return (
        <div className='border-bottom d-flex flex-row'>
            <p className='w-50 my-auto'>{props.helptext}</p>
            <input type='file' {...props} />
        </div>

    );
};

export default FileUpload;