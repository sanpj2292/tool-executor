import { GET_TOOL_LIST, SHOW_CREATE_FORM, PREVIEW_CHANGE } from "./action-types";

const INITIAL_STATE = {
    rows: [],
    preview: '',
    selectedVals: [],
    createForm: false
};

const toolReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_TOOL_LIST:
            return {
                ...state,
                ...action.payload
            };
        case SHOW_CREATE_FORM:
            return {
                ...state,
                ...action.payload
            };
        case PREVIEW_CHANGE:
            return {
                ...state,
                preview: action.payload
            };
        default:
            return state;
    }
};

export default toolReducer;