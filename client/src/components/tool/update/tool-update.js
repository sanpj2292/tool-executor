import React from "react";

class UpdateTool extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <form className='container border store-tool' onSubmit={this.onSubmitHandler} >
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
}

export default UpdateTool;