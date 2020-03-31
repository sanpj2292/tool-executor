import React from "react";
import './instruction.scss';

const InstructionInput = ({ instruction, handleInstruction }) => {
    return (
        <div className='instruction-container'>
            <label htmlFor='instruction'>Instructions</label>
            <textarea name='instruction' className='instruction'
                value={instruction} onChange={handleInstruction}></textarea>
        </div>
    );
}

export default InstructionInput;