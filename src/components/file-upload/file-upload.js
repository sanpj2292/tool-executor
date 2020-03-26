import React from 'react';
import axios from 'axios';

class FileUpload extends React.Component {
    state = {
        uploadedFile: null
    };

    onSubmitHandler = e => {
        e.preventDefault();
        console.log('Will send an Ajax Call');
        const { uploadedFile } = this.state;
        const data = new FormData();
        data.append('file', uploadedFile);
        axios.post('http://localhost:4000/uploadJarFile', data, {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }).then(res => {
            const { data: { message } } = res;
            console.log(message);
            alert(message);
        }).catch(err => console.error(err));
    };

    onChangeHandler = e => {
        const { files } = e.target;
        if (!files || files.length <= 0) {
            console.error('Error in Uploaded File');
        }
        const file = files[0];
        if (file.name.endsWith('.jar')) {
            this.setState({
                uploadedFile: file
            });
        }
    };

    render() {
        return (
            <form onSubmit={this.onSubmitHandler}>
                <input type='file' name='file' onChange={this.onChangeHandler} />
                <input type='submit' value='Upload' />
            </form>
        );
    }
};


export default FileUpload;