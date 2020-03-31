import React from 'react';
import axios from 'axios';
import FileUpload from '../file-upload/file-upload';
import './store-tool.scss';
import InstructionInput from '../instruction/instruction';

class StoreTool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jarFile: null,
            instruction: '',
            showPreview: false,
            disablePreview: true
        };
    }


    onSubmitHandler = e => {
        e.preventDefault();
        const { jarFile } = this.state;
        const { preview } = this.props;
        const data = new FormData();
        data.append('jarFile', jarFile, jarFile.name);
        data.append('instruction', preview);
        axios.post('http://localhost:4000/service/toolSave', data, {
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
        const extension = e.target.getAttribute('extension');
        const { files } = e.target;
        if (!extension || extension === null) {
            throw new Error('No Extension has been specified');
        }
        if (!files || files.length <= 0) {
            console.error('Error in Uploaded File');
        }
        console.log(files[0]);
        const file = files[0];
        if (file.name.endsWith(`.${extension}`)) {
            this.setState({
                jarFile: file
            });
        } else {
            alert(`UploadError: Please upload a file with .${extension} only`);
        }
    };

    render() {
        const { handleInput, preview } = this.props;
        return (
            <form className='container border store-tool' onSubmit={this.onSubmitHandler}>
                <div className='form-group py-2'>
                    <FileUpload extension='jar'
                        name='jarFile'
                        onChange={this.onChangeHandler}
                        helptext='Jar File'>
                    </FileUpload>
                </div>
                <div className='form-group' >
                    <InstructionInput
                        instruction={preview}
                        handleInstruction={handleInput}
                        name='instruction'
                        label='Instructions'
                    />
                </div>
                <div className='form-group d-flex justify-content-end'>
                    <input type='submit' className='btn btn-primary' value='Upload' />
                </div>
            </form>
        );
    }
};


export default StoreTool;