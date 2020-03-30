import React from 'react';
import ReactMarkdown from "react-markdown";

const Markdown = ({ value, ...otherProps }) => {
    return (<ReactMarkdown source={value} {...otherProps} />);
}

export default Markdown;