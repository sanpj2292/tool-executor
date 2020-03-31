import React from 'react';

import Preview from "../preview/preview";
import SyntaxStyleRenderer from '../markdown/syntax-style-renderer';

const InstructionPreview = ({ className, isPreview, previewText }) => {
    return (
        <div className={className}>
            <div>
                <h4>Instruction{!isPreview ? '' : ' Preview'}</h4>
            </div>
            <Preview name='preview-instruction'
                previewValue={previewText}
                renderers={{
                    code: SyntaxStyleRenderer
                }}
            />
        </div>)
};

export default InstructionPreview;