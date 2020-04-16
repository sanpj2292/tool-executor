import {
    GET_TOOL_LIST, SHOW_CREATE_FORM,
    PREVIEW_CHANGE, VERSION_CHANGE, DELETE_TOOL,
    INSERT_TOOL, SHOW_UPDATE_FORM, SHOW_ALERT, DISMISS_ALERT
} from "./action-types";

import { insertRow } from "./utils";

const INITIAL_STATE = {
    rows: [],
    preview: '',
    selectedVals: [],
    createForm: false,
    update: {
        isVisible: false,
        updInpVName: '',
        id: ''
    },
    alert: {
        variant: 'info',
        show: false,
        message: ''
    }
};

const toolReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SHOW_UPDATE_FORM:
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
        case VERSION_CHANGE:
            return {
                ...state,
                ...action.payload
            };
        case DELETE_TOOL:
            return {
                ...state,
                ...action.payload
            };
        case PREVIEW_CHANGE:
            return {
                ...state,
                preview: action.payload
            };
        case INSERT_TOOL:
            const rows = insertRow(state, action.payload);
            let { selectedVals } = state;
            if (selectedVals.length !== rows.length) {
                selectedVals.push(0);
            }
            return {
                ...state,
                rows,
                preview: rows[0].instructions[selectedVals[0] ? selectedVals[0] : 0],
                createForm: !state.createForm,
                selectedVals
            };
        case DISMISS_ALERT:
        case SHOW_ALERT:
            return {
                ...state,
                alert: { ...action.payload }
            }
        default:
            return state;
    }
};

export default toolReducer;