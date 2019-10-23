
export interface DropdownProps {
    values: string[];
    currentValue: string;
    onChange(newValue: string): void;
}

export function Dropdown(props: DropdownProps) {

    const options = props.values.map(value => <option va></option>)

    return (
        <button className={`button ${props.type}`} onClick={() => props.onClick()}>{props.text}</button>
    );
}