import React from 'react';
import { versionChange } from "../../redux/actions";
import { connect } from "react-redux";

const GridSelect = (props) => {

    const { rowData: { row, rowInd } } = props;

    const onChangeSelect = (e, rowInd) => {
        const selectVal = e.currentTarget.value;
        let { selectedVals, rows, versionChange } = props;
        selectedVals[rowInd] = Number(selectVal);
        const preview = rows[rowInd].instructions[selectVal];
        versionChange({ selectedVals, preview });
    };

    return (
        <select key={`select-row-${rowInd}`}
            className="custom-select custom-select-sm"
            value={props.selectedVals[rowInd]}
            onClick={e => e.stopPropagation()}
            onChange={e => onChangeSelect(e, rowInd)}>
            {
                row.versions.map((opt, i) => (
                    <option key={`${row.name}-opt-${i}`} value={i} >{opt}</option>
                ))
            }
        </select>
    );
}

const mapStateToProps = ({ selectedVals, rows }) => {
    return {
        selectedVals,
        rows
    };
};

const mapDispatchToProps = dispatch => {
    return {
        versionChange: (preview) => dispatch(versionChange(preview)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GridSelect);