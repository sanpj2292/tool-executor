export const insertRow = ({ rows }, row) => {
    console.log('Rows:');
    console.log(rows);
    const index = rows.map(o => o.name).indexOf(row.name);
    if (index !== -1) {
        // Existing
        rows[index] = row;
        return rows;
    } else {
        rows.push(row);
        return rows;
    }
};