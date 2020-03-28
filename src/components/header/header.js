import React from "react";
import { ReactComponent as ToolSvg } from '../../icons/web-maintenance.svg';

const Header = () => {
    return (
        <div className="navbar navbar-dark bg-dark">
            <a className="navbar-brand" href='/'>
                <ToolSvg width={20} height={20} className="mr-1" />
                <span className='align-center'>Tool Executor</span>
            </a>
        </div>
    );
};

export default Header