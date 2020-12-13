import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import $ from 'jquery';


function Square(props) {
    let index = 0;
    return (<button className={`square ${props.winnerSquare ? "winnerSquare" : ""}`}
        id={`button-${index}`}
        onClick={props.onClick} > { props.value}
    </button>)
}

class Board extends React.Component {

    isWinnerSquare(row, column) {
        const winnerMoves = this.props.winnerMoveSet;

        if (winnerMoves === null) {
            return false;
        }


        for (const winnerSquare of winnerMoves) {
            const positions = winnerSquare.split("-");
            const winnerRow = parseInt(positions[0]);
            const winnerColumn = parseInt(positions[1]);

            if (row === winnerRow && column === winnerColumn) {
                return true;
            }
        }

        return false;
    }

    renderSquare(row, column) {
        return (<Square
            winnerSquare={this.isWinnerSquare(row, column)}
            value={this.props.squares[row][column]}
            onClick={
                () => this.props.onClick(row, column)
            }
        />
        )
    }

    render() {
        return (
            <div className="board" >
                <div className="row" >
                    {this.renderSquare(0, 0)}
                    {this.renderSquare(0, 1)}
                    {this.renderSquare(0, 2)}
                </div>
                <div className="row" >
                    {this.renderSquare(1, 0)}
                    {this.renderSquare(1, 1)}
                    {this.renderSquare(1, 2)}
                </div>
                <div className="row" >
                    {this.renderSquare(2, 0)}
                    {this.renderSquare(2, 1)}
                    {this.renderSquare(2, 2)}
                </div>
            </div>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null]
                ],
                currentPlayer: "X",
                gameOver: false,
                isVictory: false,
                isDraw: false,
                lastMove: { row: 0, column: 0 },
            }],
            gameTurnNumber: 0,
            status: "Player To Move",
            winnerMoveSet: []
        }
    }

    victoryColumns(squares, currentPlayer) {
        let winnerMoveSet = [];

        let finalArray = squares
            .map((row) => row
                .filter((cell) => cell === currentPlayer).length === squares.length);

        for (let position = 0; position < finalArray.length; position++) {
            if (finalArray[position]) {
                for (let index = 0; index < finalArray.length; index++) {
                    winnerMoveSet.push(`${position}-${index}`);
                }
            }
        }

        if (winnerMoveSet.length !== 0) {
            console.log("Victory Columns");
            return winnerMoveSet;
        }
        return null;

    }
    victoryRows(squares, currentPlayer) {

        let count = 0;
        for (let row = 0; row < squares.length; row++) {
            let winnerMoveSet = [];
            count = 0;
            for (let column = 0; column < squares.length; column++) {
                const cell = squares[column][row];
                if (cell === currentPlayer) {
                    winnerMoveSet.push(`${column}-${row}`);
                    count++;
                }
            }
            if (count === squares.length) {
                return winnerMoveSet;
            }
        }

        return null;
    }
    victoryDiagonal(squares, currentPlayer) {
        let winnerMoveSet = [];
        let count = 0;
        for (let cell = 0; cell < squares.length; cell++) {
            const value = squares[cell][cell];
            if (value === currentPlayer) {
                winnerMoveSet.push(`${cell}-${cell}`);
                count++;
            }
        }

        if (count === squares.length) {
            console.log("Victory diagonal ->");
            return winnerMoveSet;
        }

        winnerMoveSet = [];
        count = 0;
        for (let row = 0, column = squares.length - 1; row < squares.length; row++, column--) {
            const cell = squares[row][column];
            if (cell === currentPlayer) {
                winnerMoveSet.push(`${column}-${row}`);
                count++;
            }
        }
        if (count === squares.length) {
            console.log("Victory diagonal <-");
            return winnerMoveSet;
        }
        return null;
    }

    hasVictory(squares, currentPlayer) {
        let result;

        result = this.victoryColumns(squares, currentPlayer);
        if (result !== null) {
            return result;
        }
        result = this.victoryRows(squares, currentPlayer);
        if (result !== null) {
            return result;
        }
        result = this.victoryDiagonal(squares, currentPlayer);
        if (result !== null) {
            return result;
        }
        return null;
    }

    hasDraw(squares) {

        for (let row = 0; row < squares.length; row++) {
            for (let column = 0; column < squares.length; column++) {
                const cell = squares[row][column];
                if (cell === null) {
                    return false;
                }
            }
        }
        return true;
    }

    changePlayer(currentPlayer) {
        return currentPlayer === "X" ? "O" : "X";
    }

    jumpToTurn(turnNumber) {
        this.setState({
            gameTurnNumber: turnNumber
        })
    }

    duplicateBoardSquares(squares) {
        return JSON.parse(JSON.stringify(squares));
    }

    handleClick(row, column) {
        const history = this.state.history.slice(0, this.state.gameTurnNumber + 1);
        const currentState = history[history.length - 1];

        let squares = this.duplicateBoardSquares(currentState.squares);
        let currentSymbol = currentState.currentPlayer;

        if (squares[row][column] !== null || currentState.gameOver) {
            return;
        }
        squares[row][column] = currentSymbol;

        const victoryMoveSet = this.hasVictory(squares, currentSymbol);
        const isVictory = victoryMoveSet !== null;
        const draw = this.hasDraw(squares);

        let gameOver = isVictory || draw;

        this.setState({
            history: history.concat([{
                squares: squares,
                currentPlayer: gameOver ? currentSymbol : this.changePlayer(currentSymbol),
                gameOver: gameOver,
                isDraw: draw,
                isVictory: isVictory,
                lastMove: { row, column }
            }]),
            winnerMoveSet: victoryMoveSet,
            gameTurnNumber: history.length,
            historyOrderAsc: true
        })
    }

    focusButton(button) {

        $(".historyMove").each(function () {
            $(this).removeClass("focus");
        });
        $(button).toggleClass("focus");

    }

    generateHistoryLabels(history, order) {
        const list = history.map((step, move) => {

            const row = step.lastMove.row, column = step.lastMove.column;
            const desc = move ?
                `Go to move #${move} - (${row + 1},${column + 1})` :
                'Go to game start';



            return (
                <li key={move} >
                    <button
                        className={`historyMove ${step.isVictory ? "winnerTag" : ""}`}
                        onClick={(data) => {

                            this.focusButton(data.target);
                            this.jumpToTurn(move)
                        }}>
                        {desc}
                    </button>
                </li >
            );
        });

        return order ? list : list.reverse();
    }

    render() {
        const history = this.state.history;
        const currentState = history[this.state.gameTurnNumber];
        const currentPlayer = currentState.currentPlayer;

        let status = `Player To Move: ${currentPlayer}`;
        if (currentState.isVictory) {
            status = `Game Won by: ${currentPlayer}`;
        } else if (currentState.isDraw) {
            status = "Game Drawed";
        }

        const moves = this.generateHistoryLabels(history, this.state.historyOrderAsc);

        return (
            <div className="game" >
                <div className="game-board" >
                    <Board
                        winnerMoveSet={this.state.winnerMoveSet}
                        squares={currentState.squares}
                        onClick={(row, column) => { this.handleClick(row, column); }
                        }
                    />
                </div>

                <div className="game-info" >
                    <div> {status} </div>
                    <div id="buttonsContainer">
                        <button className="sortButton"
                            onClick={() => { this.setState({ historyOrderAsc: true }) }}
                        >
                            <i className="fas fa-sort-numeric-up-alt"></i>
                        </button>
                        <button className="sortButton"
                            onClick={() => { this.setState({ historyOrderAsc: false }) }}
                        >
                            <i className="fas fa-sort-numeric-down-alt"></i>
                        </button>
                    </div>
                    <ol > {moves} </ol>
                </div >
            </div>
        );
    }
}









ReactDOM.render(
    <React.StrictMode >
        <Game />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();