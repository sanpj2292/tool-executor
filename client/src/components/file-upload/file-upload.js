import React from 'react';
import './file-upload.scss';

const FileUpload = (props) => {
    return (
        <div className='border-bottom d-md-flex justify-content-between file-upload'>
            <div>
                <p>{props.helptext}</p>
            </div>
            <div>
                <input type='file' {...props} />
            </div>
        </div>

    );
};

export default FileUpload;