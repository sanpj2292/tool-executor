import { GET_TOOL_LIST, SHOW_CREATE_FORM } from "./action-types";

export const getToolList = ({ rows, preview, selectedVals }) => ({
    type: GET_TOOL_LIST,
    payload: {
        rows,
        preview,
        selectedVals
    }
});

export const showCreateForm = ({ createForm, preview }) => ({
    type: SHOW_CREATE_FORM,
    payload: {
        createForm,
        preview
    }
});