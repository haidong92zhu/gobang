import { useEffect, useState } from "react";
import { start } from "../store";

export const Start = (props: { reset: boolean }) => {
    const [machine, setMachine] = useState(false);
    const [machineColor, setMachineColor] = useState(-1);
    const [enable, setEnable] = useState(true);

    useEffect(() => {
        if (props.reset) {
            setMachine(false);
            setMachineColor(-1);
            setEnable(true);
        }
    }, [props.reset]);
    
    return <div className={`start ${enable ? '': ' hide'}`} >
        <select value={machine ? 'machine': 'ptp'} onChange={(e) => {
            if (e.target.value === 'machine') {
                setMachine(true);

            } else {
                setMachine(false);
            }
        }}>
            <option value="ptp">双人</option>
            <option value="machine">人机</option>
        </select>
        <select  value={machineColor === 1 ? 'white': 'black'} onChange={(e) => {
            if (e.target.value === 'black') {
                setMachineColor(-1);
            } else {
                setMachineColor(1);
            }
        }}>
            <option value="black">执黑</option>
            <option value="white">执白</option>
        </select>
        <button onClick={() => {
            start(machine, machineColor)
            setEnable(false);
        }}>开始</button>
    </div>
}