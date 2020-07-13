import React from 'react';
import './App.css';
import './GameBoardComponent.css';
import GameBoardDisplay from './GameBoardComponent.js';
const SudokuGenerator = require("js-sudoku-generator").SudokuGenerator;

class App extends React.Component{
    constructor(props){
        super(props);
        /* preset board stores position of starting puzzle elements, which are immutable */
        this.state = {
            gameBoardData: [],
            presetBoardData: [],
            solutionBoardData: []
        };

        this.inputHandler = this.inputHandler.bind(this);
        this.initGameBoard = this.initGameBoard.bind(this);
    }

    initGameBoard(){
        SudokuGenerator.generate(1);
        let generatedGameBoard = SudokuGenerator.generatedBoards[0];
        let easySheet = generatedGameBoard.getSheet(0);

        let tempBoardData = [];
        let tempPresetData = [];

        for(let i = 0; i < 9; i++){
            let tempColBoard = [];
            let tempColPreset = [];
            for(let j = 0; j < 9; j++)
                if(easySheet[i][j] != ""){
                    tempColBoard.push(easySheet[i][j]);
                    tempColPreset.push(1);
                }else{
                    tempColBoard.push(null);
                    tempColPreset.push(0);
                }

            tempBoardData.push(tempColBoard);
            tempPresetData.push(tempColPreset);
        }

        this.setState({
            gameBoardData: tempBoardData,
            presetBoardData: tempPresetData,
            solutionBoardData: generatedGameBoard.board
        });
    }

    /* checks whether move is coherent with rest of game board */
    validSudokuMove(yPos, xPos, gameBoard, val){
        //if player is deleting a value, its always coherent with board
        if(val == "") return true;

        //checks if val is number and within bounds
        val = parseInt(val);
        if(Number.isNaN(val)) return false;
        if(val < 0 || val > gameBoard.length) return false;

        //checks row val is on for repeats
        for(let i = 0; i < gameBoard[0].length; i++)
            if(gameBoard[yPos][i] == val && xPos != i)
                return false;

        //checks col for repeats
        for(let i = 0; i < gameBoard.length; i++)
            if(gameBoard[i][xPos] == val && yPos != i)
                return false;

        //checks respective 3x3 squre for repeats
        let xPosOfCellStart = Math.floor(xPos/3) * 3;
        let yPosOfCellStart = Math.floor(yPos/3) * 3;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let tempXPos = xPosOfCellStart + j;
                let tempYPos = yPosOfCellStart + i
                if(gameBoard[tempYPos][tempXPos] == val
                    && !(tempXPos == xPos && tempYPos == yPos))
                    return false;
            }
        }

        return true;
    }

    checkSolution(gameBoard, solutionBoard){
        for(let i = 0; i < solutionBoard.length; i++){
            for(let j = 0; j < solutionBoard[0].length; j++){
                if(parseInt(gameBoard[i][j]) !== solutionBoard[i][j])
                    return false;
            }
        }

        return true;
    }

    inputHandler(yPos, xPos, event){
        event.persist();

        //if space prefilled
        if(this.state.presetBoardData[yPos][xPos] == 0){
            if(this.validSudokuMove(yPos, xPos, this.state.gameBoardData, event.target.value)){
                this.setState(function(state, props){
                    let tempBoardData = this.state.gameBoardData;
                    tempBoardData[yPos][xPos] = event.target.value;

                    if(this.checkSolution(tempBoardData, this.state.solutionBoardData))
                        alert("Completed!");

                    return {gameBoardData: tempBoardData};
                });
            }
            else{
                alert("invalid move");
            }
        }
    }
    componentDidMount(){
        this.initGameBoard();
    }
    render(){
        return (
            <div className="content">
                <h className="mainHeader">Sudoku</h>
                <br/>
                <GameBoardDisplay boardData={this.state.gameBoardData} inputHandler={this.inputHandler}/>
                <br/>
                <button className="newGameButton" onClick={this.initGameBoard}> New Game </button>

            </div>
        );

    }
}

export default App;
