import React from 'react';
import axios from 'axios';
import FileUpload from '../file-upload/file-upload';
import './store-tool.scss';
import Preview from "../preview/preview";
import SyntaxStyleRenderer from '../markdown/syntax-style-renderer';
import Switch from "../switch";
import InstructionInput from '../instruction/instruction';

class StoreTool extends React.Component {
    state = {
        jarFile: null,
        instruction: '',
        showPreview: false,
        disablePreview: true
    };

    onSubmitHandler = e => {
        e.preventDefault();
        const { jarFile, instruction } = this.state;
        const data = new FormData();
        data.append('jarFile', jarFile);
        data.append('instruction', instruction);
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
        const extension = e.target.getAttribute('extension');
        const { files } = e.target;
        if (!extension || extension === null) {
            throw new Error('No Extension has been specified');
        }
        if (!files || files.length <= 0) {
            console.error('Error in Uploaded File');
        }
        const file = files[0];
        if (file.name.endsWith(`.${extension}`)) {
            this.setState({
                [`${extension}File`]: file
            });
        } else {
            alert(`UploadError: Please upload a file with .${extension} only`);
        }
    };

    handleInstruction = (e) => {
        const { value } = e.currentTarget;
        this.setState({
            instruction: value,
            disablePreview: !value && value === ''
        });
    }

    handlePreview = e => {
        this.setState((prevState, prevProps) => {
            return { ...prevState, showPreview: !prevState.showPreview };
        });
    }

    render() {
        const { showPreview, instruction, disablePreview } = this.state;
        return (
            <form className='px-2 py-2 container border store-tool' onSubmit={this.onSubmitHandler}>
                <div className='form-group py-2'>
                    <FileUpload extension='jar'
                        name='jarFile'
                        onChange={this.onChangeHandler}
                        helptext='Jar File'>
                    </FileUpload>
                </div>
                <div className='form-group' >
                    <Switch
                        checked={showPreview}
                        label='Preview'
                        disabled={disablePreview}
                        onChange={this.handlePreview} />
                    {
                        showPreview ? (
                            <Preview name='preview-instruction'
                                previewValue={instruction}
                                renderers={{
                                    code: SyntaxStyleRenderer
                                }}
                            />
                        ) : (
                                <InstructionInput
                                    instruction={instruction}
                                    handleInstruction={this.handleInstruction}
                                    label='Instructions'
                                />
                            )
                    }
                </div>
                <div className='form-group d-flex justify-content-end'>
                    <input type='submit' className='btn btn-primary' value='Upload' />
                </div>
            </form>
        );
    }
};


export default StoreTool;