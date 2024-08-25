
interface ITitleProps {
    player: string,
    winner: string,
    reStart: () => void,
}
export const Title = (props: ITitleProps) => {
    const { player, winner, reStart } = props;
    const text = winner ? <div>{winner === 'white' ? '白棋胜利' : '黑棋胜利'}</div> : <div>{player === 'white' ? '现在白棋' : '现在黑棋'}</div>
    return <div className="text">
        {text}
        <button onClick={reStart}>重新开始</button>
    </div>
}