import React from "react";
import './instruction.scss';
import { connect } from "react-redux";
import { previewChange } from "../../redux/actions";

const InstructionInput = ({ instruction, previewChange }) => {

    const handleInstruction = (e) => {
        previewChange(e.currentTarget.value);
    }

    return (
        <div className='instruction-container'>
            <label htmlFor='instruction'>Instructions</label>
            <textarea name='instruction' className='instruction'
                value={instruction} onChange={handleInstruction}></textarea>
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        previewChange: (preview) => dispatch(previewChange(preview))
    }
};

export default connect(null, mapDispatchToProps)(InstructionInput);