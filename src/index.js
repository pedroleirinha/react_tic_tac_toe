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
				]
			}],
			currentPlayer: "X",
			gameOver: false
		}
	}

	render() {
		const status = "";
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={this.state.history[0].squares}
						onClick={() => { console.log("click") }}
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
