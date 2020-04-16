import React from 'react';
import axios from 'axios';
import FileUpload from '../file-upload/file-upload';
import './store-tool.scss';
import InstructionInput from '../instruction/instruction';
import { connect } from "react-redux";
import { insertTool } from "../../redux/actions";
import { showAlert } from "../../redux/actions";

class StoreTool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jarFile: null,
        };
    }

    onSubmitHandler = e => {
        e.preventDefault();
        const { jarFile } = this.state;
        const { preview, insertTool, showAlert } = this.props;
        const data = new FormData();
        data.append('jarFile', jarFile);
        data.append('instruction', preview);
        axios.post('/api/service/toolSave', data).then(res => {
            const { data: { row, msg: message } } = res;
            insertTool(row);
            showAlert({ variant: 'success', message });
        }).catch(err => showAlert({ variant: 'danger', message: err.message }));
    };

    onChangeHandler = e => {
        const { showAlert } = this.props;
        const extension = e.target.getAttribute('extension');
        const { files } = e.target;
        if (!extension || extension === null) {
            return showAlert({ variant: 'danger', message: 'No Extension has been specified' });
        }
        if (!files || files.length <= 0) {
            return showAlert({ variant: 'danger', message: 'Error in uploaded file' })
        }
        const file = files[0];
        if (file.name.endsWith(`.${extension}`)) {
            this.setState({
                jarFile: file
            });
        } else {
            let message = `UploadError: Please upload a file with .${extension} only`;
            return showAlert({ variant: 'danger', message });
        }
    };

    render() {
        const { preview } = this.props;
        return (
            <form className='container border store-tool' onSubmit={this.onSubmitHandler} encType='multipart/form-data'>
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

const mapStateToProps = ({ preview }) => {
    return { preview };
}

const mapDispatchToProps = dispatch => {
    return {
        insertTool: (row) => dispatch(insertTool(row)),
        showAlert: ({ variant, message }) => dispatch(showAlert({ variant, message }))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreTool);