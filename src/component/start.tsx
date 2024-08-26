import { useEffect, useState } from "react";
import { StoreInstance } from "../store";

export const Start = () => {
    const [machine, setMachine] = useState(true);
    const [machineColor, setMachineColor] = useState(-1);
    const [enable, setEnable] = useState(true);

    useEffect(() => {
        if (!StoreInstance.isPlaying) {
            setEnable(true);
        }
    });
    
    return <div className={`start${enable ? '': ' hide'}`} >
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
        {machine && <select  value={machineColor === 1 ? 'white': 'black'} onChange={(e) => {
            if (e.target.value === 'black') {
                setMachineColor(-1);
            } else {
                setMachineColor(1);
            }
        }}>
            <option value="black">执黑</option>
            <option value="white">执白</option>
        </select>}
        
        <button onClick={() => {
            StoreInstance.startGame(machine, machineColor);
            setEnable(false);
        }}>开始</button>
    </div>
}