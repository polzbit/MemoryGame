import React, {useState, useEffect} from 'react';
import Card from './Card';

const GameBoard = () => {
    const [state, setState] = useState({
        sizeX: 2,
        sizeY: 2,
        boardState: [],
        showTitle: true,
        current_move: 0,
        current_card: null,
        cardValues: ['Dog', 'Cat', 'Mouse', 'Cow', 'Fish', 'Snake', 'Shark', 'Donkey', 'Hourse', 'Bird', 'Eagle',  'Rat', 'Snail', 'Bug', 'Worm', 'Ant', 'Panda', 'Monkey'],
        numOfpairs:0,
        time: 0,
        fin:false,
        level: 1,
    });
    /* -------------------- Navigation Section -------------------- */
    const startGame = () => {
        /* start new game */
        const board = assignCards()
        setState(prevState => ({
            ...prevState,
            boardState:board,
            showTitle:false,
            numOfpairs: state.sizeX * state.sizeY * state.level * state.level / 2,
            current_move:0,
            current_card: null,
            time:0,
        }));
    }

    const goToMenu = (nextLevel) => {
        /* navigate to main menu */
        let level = state.level;
        if(nextLevel) level++;
        if(level === 4) level = 1;
        setState(prevState => ({
            ...prevState,
            showTitle:true,
            fin:false,
            level: level,
        }));
    }

    /* -------------------- Game Section -------------------- */
    const onMove = (card) => {
        /* called when on card click */
        if(state.current_card == null) {
            // case first card flip
            setState(prevState => ({
                ...prevState,
                current_card:card,
            }));
        } else {
            // check for match
            checkMatch(card, state.current_card);
        }
    }

    const checkMatch = (cardA, cardB) => {
        /* compair two cards for a match */
        let pairs = state.numOfpairs;
        let fin = false;
        if(cardA.value === cardB.value && cardA.coordinate !== cardB.coordinate) {
            // case match
            cardA.correct();
            cardB.correct();
            pairs--;
            if(pairs === 0) {
                // case winner
                fin = true;
            }
        } else {
            // case no match
            cardA.hide();
            cardB.hide(); 
        }
        // reset values
        setState(prevState => ({
            ...prevState,
            current_card:null,
            current_move:state.current_move+1,
            numOfpairs:pairs,
            fin: fin,
        }));
    }

    const assignCards = () => {
        /* assign cards to board */
        let board = new Array(state.sizeX*state.level).fill(new Array(state.sizeY*state.level).fill(null));
        const numOfCards = state.sizeX * state.sizeY * state.level * state.level;
        let values = [...state.cardValues, ...state.cardValues].sort((a, b) =>
            a.localeCompare(b)
        ).splice(0, numOfCards);
        for(let x = 0; x < board.length; x++) {
            let row = [];
            for(let y = 0; y < board[x].length; y++) {
                const randNum = Math.floor(Math.random() * (values.length));
                const val = values[randNum];
                values.splice(randNum, 1);
                row.push(val);
            }
            board[x] = row;
        }
        console.log(board);
        return board;
    }

    /* -------------------- Render Section -------------------- */
    const generateBoard = () => {
        return state.boardState.map( (x, col) => {
            return [...state.boardState[col]].map((x, row) => {
                return(
                    <Card key={row} coordinate={{x:col, y:row}} value={state.boardState[col][row]} onMove={onMove}></Card>
                )
            });
        });
    }

    useEffect(() => {
        if(!state.showTitle && !state.fin) {
            const interval = setInterval(() => {
                setState(prevState => ({
                    ...prevState,
                    time:state.time+1,
                }));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [state.showTitle, state.time, state.fin]);

    return (
        <div className="GameBoard">
            {state.showTitle ? 
                <div className="GameMenu">
                    <div className="GameTitle row">
                        <h1>Memory Game</h1>
                    </div>
                    <div className="GameTitle row">
                        <h3>Level <span>{state.level}</span></h3>
                    </div>
                    <button className="playBtn" onClick={() => startGame()}>PLAY</button>
                </div>
                :
                <div className="Game">
                    <div className="topRow row">
                        <button className="backBtn" onClick={() => goToMenu()}>BACK</button>
                        <h3 className="subTitle">LEVEL: <span className="time">{state.level}</span></h3> 
                        <h3 className="subTitle">MOVES: <span className="movesNum">{state.current_move}</span></h3>
                        <h3 className="subTitle">TIME: <span className="time">{state.time}</span></h3>
                    </div>
                    <div className="Board" style={{gridTemplateColumns: '1fr '.repeat(state.sizeX*state.level)}}>
                        {generateBoard()}
                    </div>
                </div>
            }
            {state.fin && 
                <div className="popup">
                    <h1>Congratulation!</h1>
                    <table className="stats">
                        <tbody>
                            <tr>
                                <td style={{textAlign: 'right'}}>Level:</td>
                                <td>{state.level}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right'}}>Number of Moves:</td>
                                <td>{state.current_move}</td>
                            </tr>
                            <tr>
                                <td style={{textAlign: 'right'}}>Time:</td>
                                <td>{state.time}s</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className="menuBtn" onClick={() => goToMenu(true)}>MENU</button>
                </div>
            }
        </div>
    );
}

export default GameBoard;
