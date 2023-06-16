import Cell from "./cell";

interface ColumnProps {
    cellClick: any;
    columnIndex: number;
    cellValueList: any;
}

const CELLS_PER_COLUMN = 6;

export default function Column({cellClick, columnIndex, cellValueList}: ColumnProps) {
    let column:any = [];
    
    for(let i = 0; i<CELLS_PER_COLUMN; i++) {
        column.push(<Cell key={i} click={cellClick} columnIndex={columnIndex} value={cellValueList[i]} />);
    }

    return <div>{column}</div>
}