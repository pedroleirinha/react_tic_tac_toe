import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import $ from 'jquery';


function Square(props) {
    let index = 0;
    return (<button className="square"
        id={`button-${index}`}
        onClick={props.onClick} > { props.value}
    </button>)
}

class Board extends React.Component {

    renderSquare(row, column) {
        return (<Square value={this.props.squares[row][column]}
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
            status: "Player To Move"
        }
    }

    victoryColumns(squares, currentPlayer) {

        let finalArray = squares.map((row) => row.filter((cell) => cell === currentPlayer).length === squares.length);


        if (finalArray.includes(true)) {
            console.log("Victory Columns");
            return true;
        }
        return false;

    }
    victoryRows(squares, currentPlayer) {

        let count = 0;
        for (let row = 0; row < squares.length; row++) {
            count = 0;
            for (let column = 0; column < squares.length; column++) {
                const cell = squares[column][row];
                if (cell === currentPlayer) {
                    count++;
                }
            }
            if (count === squares.length) {
                return true;
            }
        }

        return false;
    }
    victoryDiagonal(squares, currentPlayer) {

        let count = 0;
        for (let cell = 0; cell < squares.length; cell++) {
            const value = squares[cell][cell];
            if (value === currentPlayer) {
                count++;
            }
        }

        if (count === squares.length) {
            console.log("Victory diagonal ->");
            return true;
        }

        count = 0;
        for (let row = 0, column = squares.length - 1; row < squares.length; row++) {
            const cell = squares[row][column];
            if (cell === currentPlayer) {
                count++;
            }
        }
        if (count === squares.length) {
            console.log("Victory diagonal <-");
            return true;
        }
        return false;
    }

    hasVictory(squares, currentPlayer) {
        let victory = this.victoryColumns(squares, currentPlayer) || this.victoryRows(squares, currentPlayer) || this.victoryDiagonal(squares, currentPlayer);
        return victory;
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

        const victory = this.hasVictory(squares, currentSymbol);
        const draw = this.hasDraw(squares);
        let gameOver = victory || draw;

        this.setState({
            history: history.concat([{
                squares: squares,
                currentPlayer: gameOver ? currentSymbol : this.changePlayer(currentSymbol),
                gameOver: gameOver,
                isDraw: draw,
                isVictory: victory,
                lastMove: { row, column }
            }]),
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
                        className="historyMove"
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
        if (currentState.isDraw) {
            status = "Game Drawed";
        } else if (currentState.isVictory) {
            status = `Game Won by: ${currentPlayer}`;
        }

        const moves = this.generateHistoryLabels(history, this.state.historyOrderAsc);

        return (
            <div className="game" >
                <div className="game-board" >
                    <Board
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