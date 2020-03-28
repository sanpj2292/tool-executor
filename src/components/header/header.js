import React from "react";

const Header = () => {
    return (
        <div className="navbar navbar-dark bg-dark">
            <a className="navbar-brand" href='/'>
                <img src="../../icons/clipboard-play-multiple-outline.svg"
                    width="30" height="30"
                    className="d-inline-block align-top" alt="" />
                    Tool Executor
            </a>
        </div>
    );
};

export default Header