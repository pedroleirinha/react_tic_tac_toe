import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';


function Square(props) {
	let index = 0;
	return (
		<button
			className="square"
			id={`button-${index}`}
			onClick={props.onClick}
		>
			{props.value}
		</button>)
}

class Board extends React.Component {

	renderSquare(row, column) {
		return (
			<Square
				value={this.props.squares[row][column]}
				onClick={() => this.props.onClick(row, column)}
			/>
		)
	}

	render() {
		return (
			<div className="board">
				<div className="row">
					{this.renderSquare(0, 0)}
					{this.renderSquare(0, 1)}
					{this.renderSquare(0, 2)}
				</div>
				<div className="row">
					{this.renderSquare(1, 0)}
					{this.renderSquare(1, 1)}
					{this.renderSquare(1, 2)}
				</div>
				<div className="row">
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
			}],
			status: "Player To Move"
		}
	}

	victoryColumns() {
		const currentBoard = this.state.history[this.state.history.length - 1];
		const squares = currentBoard.squares.slice();

		let finalArray = squares.map((row) => row.filter((cell) => cell === currentBoard.currentPlayer).length === squares.length);


		if (finalArray.includes(true)) {
			console.log("Victory Columns");
			return true;
		}
		return false;

	}
	victoryRows() {
		const currentBoard = this.state.history[this.state.history.length - 1];
		const squares = currentBoard.squares.slice();

		let count = 0;
		for (let row = 0; row < squares.length; row++) {
			count = 0;
			for (let column = 0; column < squares.length; column++) {
				const cell = squares[column][row];
				if (cell === currentBoard.currentPlayer) {
					count++;
				}
			}
		}

		return count === this.state.squares.length;
	}
	victoryDiagonal() {
		const currentBoard = this.state.history[this.state.history.length - 1];
		const squares = currentBoard.squares.slice();

		let count = 0;
		for (let cell = 0; cell < squares.length; cell++) {
			const value = squares[cell][cell];
			if (value === currentBoard.currentPlayer) {
				count++;
			}
		}

		if (count === squares.length) {
			console.log("Victory diagonal ->");
			return true;
		}

		count = 0;
		for (let row = 0, column = squares.length - 1; row < squares.length; row++, column--) {
			const cell = squares[row][column];
			if (cell === currentBoard.currentPlayer) {
				count++;
			}
		}
		if (count === squares.length) {
			console.log("Victory diagonal <-");
			return true;
		}
		return false;
	}

	hasVictory() {
		let victory = this.victoryColumns() || this.victoryRows() || this.victoryDiagonal();

		this.setState({ isVictory: victory });

		return victory;
	}

	hasDraw() {
		const currentBoard = this.state.history[this.state.history.length - 1];
		const squares = currentBoard.squares.slice();

		for (let row = 0; row < squares.length; row++) {
			for (let column = 0; column < squares.length; column++) {
				const cell = squares[row][column];
				if (cell === null) {
					return false;
				}
			}
		}
		this.setState({
			isDraw: true
		});
		return true;
	}

	changePlayer() {
		return this.state.currentPlayer === "X" ? "O" : "X";
	}

	handleClick(row, column) {
		let squares = this.state.squares.slice();
		let currentSymbol = this.state.currentPlayer;

		if (squares[row][column] !== null || this.state.gameOver) {
			return;
		}
		squares[row][column] = currentSymbol;

		let gameOver = this.hasDraw() || this.hasVictory();

		this.setState({
			squares: squares,
			gameOver: gameOver,
			currentPlayer: gameOver ? currentSymbol : this.changePlayer()
		})
	}

	render() {

		let status = `Player To Move: ${this.state.currentPlayer}`;
		if (this.state.isDraw) {
			status = "Game Drawed";
		}
		else if (this.state.isVictory) {
			status = `Game Won by: ${this.state.currentPlayer}`;
		}
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={this.state.squares}
						onClick={(row, column) => { this.handleClick(row, column); }}
					/>
				</div>

				<div className="game-info">
					<div>{status}</div>
				</div>
			</div>
		);
	}
}









ReactDOM.render(
	<React.StrictMode>
		<Game />
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
