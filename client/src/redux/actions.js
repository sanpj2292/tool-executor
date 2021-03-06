import {
    GET_TOOL_LIST, SHOW_CREATE_FORM,
    PREVIEW_CHANGE, VERSION_CHANGE, DELETE_TOOL,
    INSERT_TOOL, SHOW_UPDATE_FORM, SHOW_ALERT, DISMISS_ALERT, HIDE_UPDATE_FORM
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
        preview,
        updateForm: false
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

export const deleteTool = ({ rows, preview, selectedVals }) => ({
    type: DELETE_TOOL,
    payload: {
        rows,
        preview,
        selectedVals
    }
});

export const insertTool = (row) => ({
    type: INSERT_TOOL,
    payload: row
});

export const showUpdateForm = ({ id, preview, updInpVName }) => ({
    type: SHOW_UPDATE_FORM,
    payload: {
        preview,
        update: {
            id, updInpVName,
            isVisible: true
        }
    }
});

export const hideUpdateForm = () => ({
    type: HIDE_UPDATE_FORM,
    payload: {
        update: {
            id: '',
            isVisible: false,
            updInpVName: ''
        }
    }
});

export const showAlert = ({ variant, message }) => ({
    type: SHOW_ALERT,
    payload: {
        variant,
        show: true,
        message
    }
});

export const dismissAlert = () => ({
    type: DISMISS_ALERT,
    payload: {
        variant: 'info',
        show: false,
        message: ''
    }
});