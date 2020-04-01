import React from 'react';

import Preview from "../preview/preview";
import SyntaxStyleRenderer from '../markdown/syntax-style-renderer';
import { connect } from "react-redux";

const InstructionPreview = ({ isPreview, preview, containerClass }) => {
    const previewValue = (!preview || preview === null) && !isPreview ? '##### Information not provided' : preview;
    return (
        <div className={containerClass}>
            <div>
                <h4>Instruction{!isPreview ? '' : ' Preview'}</h4>
            </div>
            <Preview name='preview-instruction'
                previewValue={previewValue}
                renderers={{
                    code: SyntaxStyleRenderer
                }}
            />
        </div>)
};

const mapStateToProps = ({ preview, createForm }) => ({
    preview,
    isPreview: createForm
});

export default connect(mapStateToProps)(InstructionPreview);