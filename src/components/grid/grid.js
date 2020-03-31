import React from 'react';
import axios from 'axios';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Preview from "../preview/preview";
import SyntaxStyleRenderer from "../markdown/syntax-style-renderer";
import './grid.scss';
import InstructionPreview from '../instruction/instruction-preview';

class Grid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            selectedVals: [0, 0]
        }
    }

    renderHeader = () => {
        const { columns } = this.props;
        return columns.map((column, i) => (
            <th key={`grid-header-${i}`} scope='col'>{
                `${column[0].toUpperCase()}${column.substring(1)}`}
            </th>
        ));
    }

    renderGridSelect = (row, rowInd) => {
        const { onChangeSelect } = this.props;
        return (
            <select key={`select-row-${rowInd}`}
                className="custom-select custom-select-sm"
                defaultValue={0}
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

    onDownload = async (e, rowInd) => {
        try {
            const { selectedVals, rows } = this.state;
            const versionSelVal = selectedVals[rowInd];
            const id = rows[rowInd].ids[versionSelVal];
            window.location = `http://localhost:4000/service/download/${id}`;
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { rows, onRowClick } = this.props;
        const { renderHeader, renderGridSelect } = this;
        return (
            <table className="table table-hover table-dark">
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {
                        rows && rows.length > 0 ? (rows.map((row, ind) => (
                            <tr key={`row-${ind}`} onClick={e => onRowClick(e, row, ind)}>
                                <td key={`row-name-td-${ind}`}>
                                    <u style={{ color: 'white' }}>
                                        {row.name}
                                    </u>
                                </td>
                                <td key={`row-grid-${ind}`}>{renderGridSelect(row, ind)}</td>
                                <td key={`row-grid-dwnlod-${ind}`}>
                                    <i className="fas fa-download"
                                        onClick={e => this.onDownload(e, ind)}>
                                    </i>
                                </td>
                            </tr>
                        ))) : null
                    }
                </tbody>
            </table>
        );
    }

}

export default Grid;