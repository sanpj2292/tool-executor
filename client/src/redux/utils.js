export const insertRow = ({ rows }, row) => {
    const index = rows.map(o => o.name).indexOf(row.name);
    if (index !== -1) {
        // Existing
        rows[index] = row;
    } else {
        rows.push(row);
    }
    return rows;
};