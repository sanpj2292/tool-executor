import React from "react";
import { connect } from "react-redux";
import InstructionInput from "../../instruction/instruction";
import axios from "axios";
import { withRouter } from "react-router-dom";

class UpdateTool extends React.Component {

    onSubmitHandler = async e => {
        try {
            e.preventDefault();
            alert('Update submit form clicked');
            const { preview, update: { id }, history } = this.props;
            const formData = new FormData();
            formData.append('instruction', preview);
            const axRes = await axios.patch(`/api/service/update/${id}`,
                formData);
            console.log(axRes);
            const message = axRes.data;
            alert(`Message from Server: ${message}`);
            history.push('/')
        } catch (error) {
            console.error(error.stack);
        }
    }

    render() {
        const { preview, update: { updInpVName } } = this.props;
        return (
            <form className='container border store-tool' onSubmit={this.onSubmitHandler} >
                <div className='form-group'>
                    <input type='text' className='form-control'
                        value={updInpVName} readOnly />
                </div>
                <div className='form-group' >
                    <InstructionInput
                        instruction={preview}
                        name='updateInstuction'
                        label='Instructions'
                    />
                </div>
                <div className='form-group d-flex justify-content-end'>
                    <input type='submit' className='btn btn-primary' value='Update' />
                </div>
            </form>
        );
    }
}
const mapStateToProps = ({ preview, update }) => ({
    update,
    preview
});

const mapDispatchToProps = dispatch => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UpdateTool));