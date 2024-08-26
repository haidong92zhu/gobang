import { PlayerEnum } from "../store";

interface ITitleProps {
    player: PlayerEnum,
    winner: PlayerEnum,
    reStart: (reset?: boolean) => void,
}
export const Title = (props: ITitleProps) => {
    const { player, winner, reStart } = props;
    const text = winner ? <div>{winner === PlayerEnum.white? '白棋胜利' : '黑棋胜利'}</div> : <div>{player === PlayerEnum.white ? '现在白棋行棋' : '现在黑棋行棋'}</div>
    return <div className="text">
        {text}
        <div>
            <button onClick={() => { reStart() }}>重新开始</button>
            <button onClick={() => { reStart(true) }}>返回标题页</button>
        </div>
    </div>
}