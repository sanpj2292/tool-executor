import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

class SyntaxStyleRenderer extends PureComponent {
    static propTypes = {
        value: PropTypes.string.isRequired,
        language: PropTypes.string
    };

    static defaultProps = {
        language: null
    };

    render() {
        const { language, value } = this.props;
        return (
            <SyntaxHighlighter language={language} style={okaidia}>
                {value}
            </SyntaxHighlighter>
        );
    }
}

export default SyntaxStyleRenderer;