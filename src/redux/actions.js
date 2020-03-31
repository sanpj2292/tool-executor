import {
    GET_TOOL_LIST, SHOW_CREATE_FORM,
    PREVIEW_CHANGE, VERSION_CHANGE, DELETE_TOOL
} from "./action-types";

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

export const previewChange = (preview) => ({
    type: PREVIEW_CHANGE,
    payload: preview
});

export const versionChange = ({ preview, selectedVals }) => ({
    type: VERSION_CHANGE,
    payload: {
        preview,
        selectedVals
    }
});

export const deleteTool = ({ rows, preview }) => ({
    type: DELETE_TOOL,
    payload: {
        rows,
        preview
    }
});