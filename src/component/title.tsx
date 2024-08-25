
interface ITitleProps {
    player: string,
    winner: string,
}
export const Title = (props: ITitleProps) => {
    const { player, winner } = props;
    const text = winner ? <div>{winner === 'white' ? '白棋胜利' : '黑棋胜利'}</div> : <div>{player === 'white' ? '现在白棋' : '现在黑棋'}</div>
    return <div>{text}</div>
}