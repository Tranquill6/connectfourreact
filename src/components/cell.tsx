//import
import { statusContext } from "@/context/contexts";
import { useContext } from "react";

//interface to declare props, if need be
interface CellProps {
    click: any;
    columnIndex: number;
    value: number
}

export default function Cell({click, columnIndex, value}: CellProps) {
    //context used to see if player can click or not
    let gameStatus = useContext(statusContext);

    //determines color of the cell, if player/AI has moved here
    let color = 'bg-white';
    if(value == 1) {
        color = 'bg-red-500';
    }
    if(value == 2) {
        color = 'bg-yellow-500';
    }

    return(
        <div className='w-28 h-28 bg-blue-500 rounded-lg flex justify-center items-center' onClick={() => {
            if(gameStatus != 'gameover') {
                click(columnIndex);
            }
        }}>
            <div className={`w-24 h-24 ${color} rounded-full`}></div>
        </div>
    );
}