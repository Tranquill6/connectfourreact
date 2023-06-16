interface ButtonProps {
    label: string;
    onClickFunction: any;
    value: string;
    disabled: boolean;
}

export default function Button({label, value, onClickFunction, disabled = false} : ButtonProps) {
    //if disabled button, then render something else
    if(disabled) {
        return(
            <button className='bg-zinc-600 cursor-not-allowed text-neutral-400 font-bold py-2 px-4 rounded-full w-64 mx-5' onClick={onClickFunction} value={value} disabled={disabled}>
                {label}
            </button>
        )
    } else {
        return(
            <button className='bg-blue-500 hover:bg-blue-700 cursor-pointer text-white font-bold py-2 px-4 rounded-full w-64 mx-5' onClick={onClickFunction} value={value} disabled={disabled}>
                {label}
            </button>
        )
    }

}