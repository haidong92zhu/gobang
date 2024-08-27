import { useEffect, useState } from "react";
import { PlayerEnum, StoreInstance } from "../store";

export const Start = () => {
    const [machine, setMachine] = useState(true);
    const [machineColor, setMachineColor] = useState(PlayerEnum.white);
    const [enable, setEnable] = useState(true);
    const [mtm, setMtm] = useState(false);

    useEffect(() => {
        if (!StoreInstance.isPlaying) {
            setEnable(true);
        }
    });

    return <div className={`start${enable ? '' : ' hide'}`} >
        <select value={mtm ? 'mtm' : (machine ? 'machine' : 'ptp')} onChange={(e) => {
            if (e.target.value === 'machine') {
                setMachine(true);
            } else {
                setMachine(false);
            }
            setMtm(e.target.value === 'mtm');
        }}>
            <option value="ptp">双人</option>
            <option value="machine">人机</option>
            <option value="mtm">机器对战</option>
        </select>
        {machine && <select value={machineColor === 1 ? 'white' : 'black'} onChange={(e) => {
            if (e.target.value === 'black') {
                setMachineColor(PlayerEnum.white);
            } else {
                setMachineColor(PlayerEnum.black);
            }
        }}>
            <option value="black">执黑</option>
            <option value="white">执白</option>
        </select>}

        <button onClick={() => {
            StoreInstance.startGame(machine, machineColor, mtm);
            setEnable(false);
        }}>开始</button>
    </div>
}