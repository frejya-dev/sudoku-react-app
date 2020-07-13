import React from 'react';

function GameBoardDisplay(props){

    let inputAreas = [];

    if(props.boardData != null){
        let counter = 0;
        for(let i = 0; i < props.boardData.length; i++){
            for(let j = 0; j < props.boardData.length; j++){
                /*determines background color of square*/
                let x = Math.floor(j/3);
                let y = Math.floor(i/3);
                let color = (x + y) % 2 === 0 ? "grayBox" : "whiteBox";

                let inputVal = props.boardData[i][j] ? props.boardData[i][j] : "";
                let styleName = "inputBox " + color;
                inputAreas.push(<input key={counter} id={counter++} className={styleName} type="text" value={inputVal} onChange={(e) => props.inputHandler(i, j, e)}/>);
            }
        }
    }

    return (
        <div>
            <div className="gameBoard">
                {inputAreas}
            </div>
        </div>

    );
}

export default GameBoardDisplay;
