const chessBoard = document.querySelector('.chessBoard');
const row = document.querySelectorAll('.row');
const createSquare = ele => {
    for (let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('style', 'width: 11.111%; height:100%;display:inline-block');
        square.dataset.row = ele.dataset.row;
        square.dataset.column = i + 1;
        ele.appendChild(square);
    }
}
row.forEach(item => {
    createSquare(item)
}
)
//show turn order on screen
const showTurn = document.querySelector('#showTurn')
let isRed = true;
let currentTurn = (isRed ? 'red' : 'black');

let counter = 4; // to check whether it is the first click or second click on board


function setNextTurn(){
    isRed = !isRed;
    currentTurn = (isRed ? 'red' : 'black');
    showTurn.textContent =  `Round ${Math.floor(counter/4)} : ${currentTurn} to move`  // 2 clicks for both red and black valid moves, so 4 clicks a turn
}

const square = Array.from(document.querySelectorAll('.row .square'));
// removing all the colored squares on board
function removeGreenColor (){
    const availableSquare = square.filter( item => item.classList.contains('available')    )   //remove green color
    availableSquare.forEach(item=>{
        item.classList.remove('available')
    });
}
function removeBlueColor(){
    const currentSquare = square.filter( item => item.classList.contains('current')    )   //removing the blue color when clicked on new piece
    currentSquare.forEach(item=>{
        item.classList.remove('current')
    });
};
// creating a piece
function createPiece(name, color, row, column) {
    const img = document.createElement('img')
    img.setAttribute('src', `images/${color}_${name}.svg`)  //link the image
    img.dataset.piece = name;
    img.dataset.color = color;
    img.dataset.row = row;
    img.dataset.column = column;
    const destination = square.filter(item => item.dataset.row == row && item.dataset.column == column)
    destination[0].appendChild(img)
}

//movement of pieces
function setCurrentPieceInfo(piece){  // record the data for the first click
    currentPiece.piece = piece.dataset.piece;
    currentPiece.color = piece.dataset.color;
    currentPiece.row = parseInt(piece.dataset.row) ;
    currentPiece.column = parseInt(piece.dataset.column);
    removeBlueColor();
    document.querySelector(`.square[data-row="${currentPiece.row}"][data-column="${currentPiece.column}"]`).classList.add('current')
};

function setDestinationInfo(piece){ // record the data for second click
    destination.row = piece.dataset.row;
    destination.column = piece.dataset.column;
};

function removePiece(row,column){ // remove the piece from the square
    const target = document.querySelector(`img[data-row = "${row}"][data-column = "${column}" ]`)
    target.remove();
};

function markAvailableSpots(row,column){ // mark the square green if it is available for the piece
    document.querySelector(`.square[data-row="${row}"][data-column="${column}"]`).classList.add('available')
};

function removeAvailableSpots(row,column){ // mark the square green if it is available for the piece
    document.querySelector(`.square[data-row="${row}"][data-column="${column}"]`).classList.remove('available')
};

function checkGameOver(){
    let validMoves = 0
    const pieces = square.filter(item => item.hasChildNodes() && item.firstElementChild.dataset.color != currentTurn);
    pieces.forEach(item => {
        currentPiece.piece = item.firstElementChild.dataset.piece;
        currentPiece.color = item.firstElementChild.dataset.color;
        currentPiece.row = parseInt(item.firstElementChild.dataset.row);
        currentPiece.column = parseInt(item.firstElementChild.dataset.column);
        setAvailablePath(item.firstElementChild.dataset.piece);
        validMoves += Array.from(document.querySelectorAll('.square.available')).length;

    });
    for(const info in currentPiece){
        delete currentPiece[info]
    };
    if(validMoves == 0){
        return true
    }else{
        return false
    }
}

const currentPiece = {}
const destination = {}
function movePieces(){
        square.forEach(sqr => {
            sqr.addEventListener('click',function(e1){
                    if(counter % 2 == 0 && (e1.target.dataset.color == currentTurn)){
                        if(sqr.hasChildNodes()){                   //first time clicking on pieces
                            setCurrentPieceInfo(e1.target);
                            setAvailablePath(currentPiece.piece)
                            counter+=1;                          // mark down there has already been a click on the board
                        }
                    }else if(counter % 2 != 0){             // On the second click
                        if(sqr.hasChildNodes()){                  // if the second target has a piece
                            if(sqr.firstElementChild.dataset.color == currentPiece.color){    //if selecting the piece with the same color
                                removeGreenColor();
                                setCurrentPieceInfo(e1.target);
                                setAvailablePath(currentPiece.piece);
                            }else if(sqr.classList.contains('available')){        // capturing opponent pieces
                                setDestinationInfo(e1.target);
                                removePiece(currentPiece.row,currentPiece.column);  // remove original piece
                                removePiece(destination.row,destination.column);    // remove piece at destination(capture)
                                createPiece(currentPiece.piece,currentPiece.color,destination.row,destination.column);
                                printGameRecord();
                                if(checkGameOver()){
                                    showTurn.textContent = `Game over, ${currentTurn.toUpperCase()} wins`
                                    removeBlueColor();
                                    return
                                }else{
                                    removeGreenColor(); 
                                    removeBlueColor();
                                    counter+=1;
                                    setNextTurn();
                                }; 

                            }
                        }else if(!sqr.hasChildNodes() && sqr.classList.contains('available')){ // if there is no piece and the square is available
                            setDestinationInfo(e1.target);
                            removePiece(currentPiece.row,currentPiece.column);  // remove original piece
                            createPiece(currentPiece.piece,currentPiece.color,destination.row,destination.column);
                            printGameRecord();
                            if(checkGameOver()){
                                showTurn.textContent = `Game over, ${currentTurn.toUpperCase()} wins`
                                removeBlueColor();
                                square.forEach(item => item.classList.add('disabled'))
                                return
                            }else{
                                removeGreenColor(); 
                                removeBlueColor();
                                counter+=1;
                                setNextTurn();
                            }; 
                        }else if(!sqr.hasChildNodes() && !sqr.classList.contains('available')){ // click on somewhere else on the board
                            removeGreenColor();
                            removeBlueColor();
                            counter-=1;
                        }
                    }
                

            })
        })
    }
    
movePieces();

//check danger squares for king
function checkDanger(row,column){
    const vertical = Array.from(document.querySelectorAll(`.square[data-column="${column}"]`));
    const horizontal = Array.from(document.querySelectorAll(`.square[data-row="${row}"]`));

    //threats from top
    if(row < 10){
        const piecesAbove = vertical.filter(item => item.hasChildNodes() && parseInt(item.dataset.row) > row);
        piecesAbove.sort((a,b) => parseInt(a.firstElementChild.getAttribute('data-row')) - parseInt(b.firstElementChild.getAttribute('data-row'))) //from bottom to top
        if (piecesAbove.length > 0) {
            if(piecesAbove[0].firstElementChild.dataset.color != currentPiece.color){
                if(piecesAbove[0].firstElementChild.dataset.piece == 'rook' || piecesAbove[0].firstElementChild.dataset.piece == 'king'){
                    return true
                };
                if(piecesAbove[0].firstElementChild.dataset.piece == 'pawn'){            // if there is an black pawn 1 step away in front(only applicable for red)
                    if(currentPiece.color == 'red' && parseInt(piecesAbove[0].firstElementChild.dataset.row) == row + 1){
                        return true
                    };
                };
            };
            if(piecesAbove.length > 1){
                if(piecesAbove[1].firstElementChild.dataset.color != currentPiece.color){
                    if(piecesAbove[1].firstElementChild.dataset.piece == 'cannon'){
                        return true
                    };
                };
            }
        }
    };
        //threats from bottom
        if(row > 1){
            const piecesBelow = vertical.filter(item => item.hasChildNodes() && parseInt(item.dataset.row) < row);
            piecesBelow.sort((a,b) => parseInt(b.firstElementChild.getAttribute('data-row')) - parseInt(a.firstElementChild.getAttribute('data-row'))) //from bottom to top
            if (piecesBelow.length > 0) {
                if(piecesBelow[0].firstElementChild.dataset.color != currentPiece.color){
                    if(piecesBelow[0].firstElementChild.dataset.piece == 'rook' || piecesBelow[0].firstElementChild.dataset.piece == 'king'){
                        return true
                    };
                    if(piecesBelow[0].firstElementChild.dataset.piece == 'pawn'){            // if there is an black pawn 1 step away in front(only applicable for red)
                        if(currentPiece.color == 'black' && parseInt(piecesBelow[0].firstElementChild.dataset.row) == row - 1){
                            return true
                        };
                    };
                };
                if(piecesBelow.length > 1){
                    if(piecesBelow[1].firstElementChild.dataset.color != currentPiece.color){
                        if(piecesBelow[1].firstElementChild.dataset.piece == 'cannon'){
                            return true
                        };
                    };
                }
            }
        };
        //threats from the left
        if(column > 1){
            const piecesLeft = horizontal.filter(item => item.hasChildNodes() && parseInt(item.dataset.column) < column);
            piecesLeft.sort((a,b) => parseInt(b.firstElementChild.getAttribute('data-column')) - parseInt(a.firstElementChild.getAttribute('data-column'))); // sort from right to left
            if (piecesLeft.length > 0) {
                if(piecesLeft[0].firstElementChild.dataset.color != currentPiece.color){
                    if(piecesLeft[0].firstElementChild.dataset.piece == 'rook'){
                        return true
                    };
                    if(piecesLeft[0].firstElementChild.dataset.piece == 'pawn'){            // if there is an black pawn 1 step away in front(only applicable for red)
                        if(parseInt(piecesLeft[0].firstElementChild.dataset.column) == column - 1){
                            return true
                        };
                    };
                };
                if(piecesLeft.length > 1){
                    if(piecesLeft[1].firstElementChild.dataset.color != currentPiece.color){
                        if(piecesLeft[1].firstElementChild.dataset.piece == 'cannon'){
                            return true
                        };
                    };
                }
            }
        };
        //threats from the right
        if(column < 9){
            const piecesRight = horizontal.filter(item => item.hasChildNodes() && parseInt(item.dataset.column) > column);
            piecesRight.sort((a,b) => parseInt(a.firstElementChild.getAttribute('data-column')) - parseInt(b.firstElementChild.getAttribute('data-column'))); // sort from left to right
            if (piecesRight.length > 0) {
                if(piecesRight[0].firstElementChild.dataset.color != currentPiece.color){
                    if(piecesRight[0].firstElementChild.dataset.piece == 'rook'){
                        return true
                    };
                    if(piecesRight[0].firstElementChild.dataset.piece == 'pawn'){            // if there is an black pawn 1 step away in front(only applicable for red)
                        if(parseInt(piecesRight[0].firstElementChild.dataset.column) == column + 1){
                            return true
                        };
                    };
                };
                if(piecesRight.length > 1){
                    if(piecesRight[1].firstElementChild.dataset.color != currentPiece.color){
                        if(piecesRight[1].firstElementChild.dataset.piece == 'cannon'){
                            return true
                        };
                    };
                }
            }
        };
        // threats from the horse
        const topLeftObstacle = document.querySelector(`.square[data-row="${row + 1}"][data-column="${column - 1}"]`)
        const bottomLeftObstacle = document.querySelector(`.square[data-row="${row - 1}"][data-column="${column - 1}"]`)
        const topRightObstacle = document.querySelector(`.square[data-row="${row + 1 }"][data-column="${column + 1}"]`)
        const bottomRightObstacle = document.querySelector(`.square[data-row="${row - 1 }"][data-column="${column + 1}"]`)
        function checkKnightSquare(x,y){
            const target = document.querySelector(`.square[data-row="${x}"][data-column="${y}"]`)
            if(target.hasChildNodes() && target.firstElementChild.dataset.piece == 'knight' && target.firstElementChild.dataset.color != currentPiece.color){
                return true
            }else{
                return false
            }
        };
        if(row < 9){
            if(column > 1 && !topLeftObstacle.hasChildNodes() ){        // if no obstacle on the top left
                if(checkKnightSquare(row + 2, column - 1)){
                    return true
                }
            };
            if(column < 9 && !topRightObstacle.hasChildNodes()){        // if no obstacle on the top right
                if(checkKnightSquare(row + 2, column + 1)){
                    return true
                }
            };
        };
        if(row > 2){
            if(column > 1 && !bottomLeftObstacle.hasChildNodes()){        // if no obstacle on the bottom left
                if(checkKnightSquare(row - 2, column - 1)){
                    return true
                }
            };
            if(column < 9 && !bottomRightObstacle.hasChildNodes()){        // if no obstacle on the bottom right
                if(checkKnightSquare(row - 2, column + 1)){
                    return true
                }
            };
        };
        if(column > 2){
            if( row < 10 && !topLeftObstacle.hasChildNodes()){        // if no obstacle on the top left
                if(checkKnightSquare(row + 1, column - 2)){
                    return true
                }
            };
            if(row > 1 && !bottomLeftObstacle.hasChildNodes() ){        // if no obstacle on the bottom left
                if(checkKnightSquare(row - 1, column - 2)){
                    return true
                }
            };
        };
        if(column < 8){
            if(row < 10 && !topRightObstacle.hasChildNodes() ){        // if no obstacle on the top right
                if(checkKnightSquare(row + 1, column + 2)){
                    return true
                }
            };
            if(row > 1 && !bottomRightObstacle.hasChildNodes()){        // if no obstacle on the top right
                if(checkKnightSquare(row - 1, column + 2)){
                    return true
                }
            };
        };
};

function setAvailablePath(name){
    const palace = {
        redRow:[1,2,3],
        
        blackRow:[10,9,8],
        
        column:[4,5,6]

    }
    removeGreenColor();
    switch(name){
        case 'pawn' : 
            if(currentPiece.color == 'red'){
                if(currentPiece.row >= 4 && currentPiece.row <=9){ // move forward
                    markAvailableSpots(parseInt(currentPiece.row) + 1,currentPiece.column)
                };
                if(currentPiece.row >= 6 && currentPiece.column>1){ // move to the left
                    markAvailableSpots(currentPiece.row,parseInt(currentPiece.column)-1)
                };
                if(currentPiece.row >= 6 && currentPiece.column<9){ // move to the right
                    markAvailableSpots(currentPiece.row,parseInt(currentPiece.column)+1)
                }
            }else if(currentPiece.color == 'black'){
                if(currentPiece.row <= 7 && currentPiece.row >=2){ // move forward
                    markAvailableSpots(parseInt(currentPiece.row) - 1,currentPiece.column)
                };
                if(currentPiece.row <= 5 && currentPiece.column>1){ // move to the left
                    markAvailableSpots(currentPiece.row,parseInt(currentPiece.column)-1)
                };
                if(currentPiece.row <= 5 && currentPiece.column<9){
                    markAvailableSpots(currentPiece.row,parseInt(currentPiece.column)+1)
                }
            };
            break;
        case 'advisor':
            if(currentPiece.color == 'red'){
                if(palace.redRow.includes(parseInt(currentPiece.row)+1)){ // if the advisor is at 1st floor or 2nd floor
                    if(palace.column.includes(parseInt(currentPiece.column)+1)){ // if column is 4 or 5
                        // move top-right
                        markAvailableSpots(parseInt(currentPiece.row)+1,parseInt(currentPiece.column)+1)
                    }
                    if(palace.column.includes(parseInt(currentPiece.column)-1)){ // // if column is 6 or 5
                        // move top-left
                        markAvailableSpots(parseInt(currentPiece.row)+1,parseInt(currentPiece.column)-1)
                    }
                };
                if(palace.redRow.includes(parseInt(currentPiece.row)-1)){   // if the advisor is at 3rd floor or 2nd floor
                    if(palace.column.includes(parseInt(currentPiece.column)+1)){ // if column is 4 or 5
                        // move bottom-right
                        markAvailableSpots(parseInt(currentPiece.row)-1,parseInt(currentPiece.column)+1)
                    }
                    if(palace.column.includes(parseInt(currentPiece.column)-1)){  // if column is 5 or 6
                        // move bottom-left
                        markAvailableSpots(parseInt(currentPiece.row)-1,parseInt(currentPiece.column)-1)
                    }
                }
            }else if (currentPiece.color == 'black'){
                if(palace.blackRow.includes(parseInt(currentPiece.row)+1)){ // if the advisor is at 8th floor or 9th floor
                    if(palace.column.includes(parseInt(currentPiece.column)+1)){ // if column is 4 or 5
                        // move top-right
                        markAvailableSpots(parseInt(currentPiece.row)+1,parseInt(currentPiece.column)+1)
                    }
                    if(palace.column.includes(parseInt(currentPiece.column)-1)){ // // if column is 6 or 5
                        // move top-left
                        markAvailableSpots(parseInt(currentPiece.row)+1,parseInt(currentPiece.column)-1)
                    }
                };
                if(palace.blackRow.includes(parseInt(currentPiece.row)-1)){   // if the advisor is at 3rd floor or 2nd floor
                    if(palace.column.includes(parseInt(currentPiece.column)+1)){ // if column is 4 or 5
                        // move bottom-right
                        markAvailableSpots(parseInt(currentPiece.row)-1,parseInt(currentPiece.column)+1)
                    }
                    if(palace.column.includes(parseInt(currentPiece.column)-1)){  // if column is 5 or 6
                        // move bottom-left
                        markAvailableSpots(parseInt(currentPiece.row)-1,parseInt(currentPiece.column)-1)
                    }
                }
            };
            break;
        case 'bishop':
            if(currentPiece.color == 'red'){
                if(currentPiece.row<5){  // if the bishop is at row 1 or row 3
                    const topLeftObstacle = document.querySelector(`.square[data-row = "${parseInt(currentPiece.row)+1}"][data-column = "${parseInt(currentPiece.column)-1}"]`)
                    const topRightObstacle = document.querySelector(`.square[data-row = "${parseInt(currentPiece.row)+1}"][data-column = "${parseInt(currentPiece.column)+1}"]`)
                    if(currentPiece.column != 1){
                        if(!topLeftObstacle.hasChildNodes()){ // if there is no pieces on its top left corner
                            markAvailableSpots(parseInt(currentPiece.row)+2,parseInt(currentPiece.column)-2)
                        };
                    };
                    if(currentPiece.column != 9){
                        if(!topRightObstacle.hasChildNodes()){
                            markAvailableSpots(parseInt(currentPiece.row)+2,parseInt(currentPiece.column)+2)
                        }
                    }
                };
                if(currentPiece.row>1){ // if the bishop is at row 3 or row 5
                    const bottomLeftObstacle = document.querySelector(`.square[data-row = "${parseInt(currentPiece.row)-1}"][data-column = "${parseInt(currentPiece.column)-1}"]`)
                    const bottomRightObstacle = document.querySelector(`.square[data-row = "${parseInt(currentPiece.row)-1}"][data-column = "${parseInt(currentPiece.column)+1}"]`)
                    
                    if(currentPiece.column != 1){
                        if(!bottomLeftObstacle.hasChildNodes()){ // if there is no pieces on its top left corner
                            markAvailableSpots(parseInt(currentPiece.row)-2,parseInt(currentPiece.column)-2)
                        };
                    };
                    if(currentPiece.column != 9){
                        if(!bottomRightObstacle.hasChildNodes()){
                            markAvailableSpots(parseInt(currentPiece.row)-2,parseInt(currentPiece.column)+2)
                        }
                    }

                }
            }else if(currentPiece.color == 'black'){
                if(currentPiece.row<10){  // if the bishop is at row 6 or row 8
                    const topLeftObstacle = document.querySelector(`.square[data-row = "${parseInt(currentPiece.row)+1}"][data-column = "${parseInt(currentPiece.column)-1}"]`)
                    const topRightObstacle = document.querySelector(`.square[data-row = "${parseInt(currentPiece.row)+1}"][data-column = "${parseInt(currentPiece.column)+1}"]`)
                    if(currentPiece.column != 1){
                        if(!topLeftObstacle.hasChildNodes()){ // if there is no pieces on its top left corner
                            markAvailableSpots(parseInt(currentPiece.row)+2,parseInt(currentPiece.column)-2)
                        };
                    };
                    if(currentPiece.column != 9){
                        if(!topRightObstacle.hasChildNodes()){
                            markAvailableSpots(parseInt(currentPiece.row)+2,parseInt(currentPiece.column)+2)
                        }
                    }
                };
                if(currentPiece.row>6){ // if the bishop is at row 8 or row 10
                    const bottomLeftObstacle = document.querySelector(`.square[data-row = "${parseInt(currentPiece.row)-1}"][data-column = "${parseInt(currentPiece.column)-1}"]`)
                    const bottomRightObstacle = document.querySelector(`.square[data-row = "${parseInt(currentPiece.row)-1}"][data-column = "${parseInt(currentPiece.column)+1}"]`)
                    
                    if(currentPiece.column != 1){
                        if(!bottomLeftObstacle.hasChildNodes()){ // if there is no pieces on its top left corner
                            markAvailableSpots(parseInt(currentPiece.row)-2,parseInt(currentPiece.column)-2)
                        };
                    };
                    if(currentPiece.column != 9){
                        if(!bottomRightObstacle.hasChildNodes()){
                            markAvailableSpots(parseInt(currentPiece.row)-2,parseInt(currentPiece.column)+2)
                        }
                    }

                }
            };
            break;
        case 'king' :

            if(currentPiece.column > 4){ // if the king is at 5th or 6th column
                // move to the left
                markAvailableSpots(currentPiece.row, currentPiece.column-1)                  
            };
            if(currentPiece.column < 6){ // if the king is at 4th or 5th column
                // move to the right
                markAvailableSpots(currentPiece.row, currentPiece.column+1)                  
            }
            if(currentPiece.color == 'red'){
                if(currentPiece.row < 3){  // if the king is at 1st or 2nd floor
                    //move upwards
                    markAvailableSpots(currentPiece.row+1, currentPiece.column)
                };
                if(currentPiece.row > 1){  // if the king is at 2nd or 3rd floor
                    //move downwards
                    markAvailableSpots(currentPiece.row-1, currentPiece.column)
                };
            }else if(currentPiece.color == 'black'){
                if(currentPiece.row < 10){  // if the king is at 1st or 2nd floor
                    //move upwards
                    markAvailableSpots(currentPiece.row+1, currentPiece.column)
                };
                if(currentPiece.row > 8){  // if the king is at 2nd or 3rd floor
                    //move downwards
                    markAvailableSpots(currentPiece.row-1, currentPiece.column)
                };
            }
            ;
            break;
        case 'rook':
            const horizontal = Array.from(document.querySelectorAll(`.square[data-row = "${currentPiece.row}"]`))
            const vertical = Array.from(document.querySelectorAll(`.square[data-column = "${currentPiece.column}"]`))
            if(currentPiece.row < 10){        // if it is not at the top, then it can try going up
                const up = (vertical.filter( item => parseInt(item.dataset.row) > parseInt(currentPiece.row))).sort((a,b) => parseInt(a.getAttribute('data-row')) - parseInt(b.getAttribute('data-row'))); // sort them from bottom to top
                const havePiece = up.filter(item => item.hasChildNodes())
                if(havePiece.length != 0){
                    for(let i = parseInt(currentPiece.row) + 1 ; i <= parseInt(havePiece[0].firstElementChild.getAttribute('data-row')) ; i++ ){
                        markAvailableSpots( i , currentPiece.column )
                    };
                    // if(havePiece[0].firstElementChild.getAttribute('data-color') == currentPiece.color){
                    //     markAvailableSpots(havePiece[0].firstElementChild.getAttribute('data-row'), havePiece[0].firstElementChild.getAttribute('data-column'))   //can be deleted because if the obstacle is a teammate,the color will be removed at the end
                    // };
                }
                else if(havePiece.length == 0){ // if it is not at the bottom
                    up.forEach(item => {
                        markAvailableSpots(item.getAttribute('data-row'),item.getAttribute('data-column'))
                    })
                }    
            };
            if(currentPiece.row > 1){
                const down = (vertical.filter( item => parseInt(item.dataset.row) < parseInt(currentPiece.row))).sort((a,b) => parseInt(b.getAttribute('data-row')) - parseInt(a.getAttribute('data-row')) ); // sort them from top to bottom
                const havePiece = down.filter(item => item.hasChildNodes())
                if(havePiece.length != 0){
                    for(let i = parseInt(currentPiece.row) - 1 ; i >= parseInt(havePiece[0].firstElementChild.getAttribute('data-row')) ; i-- ){
                        markAvailableSpots( i , currentPiece.column )
                    };

                }else if(havePiece.length == 0){
                    down.forEach(item => {
                        markAvailableSpots(item.getAttribute('data-row'),item.getAttribute('data-column'))
                    })
                }    
            };
            if(currentPiece.column < 9){  // if it is not on the right edge
                const right = (horizontal.filter( item => parseInt(item.dataset.column) > parseInt(currentPiece.column))).sort((a,b) => parseInt(a.getAttribute('data-row')) - parseInt(b.getAttribute('data-row'))); // sort them from left to right
                const havePiece = right.filter(item => item.hasChildNodes())
                if(havePiece.length != 0){
                    for(let i = parseInt(currentPiece.column) + 1 ; i <= parseInt(havePiece[0].firstElementChild.getAttribute('data-column')) ; i++ ){
                        markAvailableSpots( currentPiece.row , i )
                    };

                }else if(havePiece.length == 0){ // if it is not at the bottom
                    right.forEach(item => {
                        markAvailableSpots(item.getAttribute('data-row'),item.getAttribute('data-column'))
                    })
                }    
            };

            if(currentPiece.column > 1 ){  // if it is not on the left edge
                const left = (horizontal.filter( item => parseInt(item.dataset.column) < parseInt(currentPiece.column))).sort((a,b) => parseInt(b.getAttribute('data-column')) - parseInt(a.getAttribute('data-column'))); // sort them from right to left
                const havePiece = left.filter(item => item.hasChildNodes())
                if(havePiece.length != 0){
                    for(let i = parseInt(currentPiece.column) - 1 ; i >= parseInt(havePiece[0].firstElementChild.getAttribute('data-column')) ; i-- ){
                        markAvailableSpots(currentPiece.row , i )
                    };

                }else if(havePiece.length == 0){ // if it is not at the bottom
                    left.forEach(item => {
                        markAvailableSpots(item.getAttribute('data-row'),item.getAttribute('data-column'))
                    })
                }    
            };
            
            break;
        case 'cannon' :
            const horizontalC = Array.from(document.querySelectorAll(`.square[data-row = "${currentPiece.row}"]`))
            const verticalC = Array.from(document.querySelectorAll(`.square[data-column = "${currentPiece.column}"]`))

            if(currentPiece.row < 10){        // if it is not at the top, then it can try going up
                const up = (verticalC.filter( item => parseInt(item.dataset.row) > parseInt(currentPiece.row))).sort((a,b) => parseInt(a.getAttribute('data-row')) - parseInt(b.getAttribute('data-row'))); // sort them from bottom to top
                const havePiece = up.filter(item => item.hasChildNodes())
                if(havePiece.length != 0){
                    for(let i = parseInt(currentPiece.row) + 1 ; i < parseInt(havePiece[0].firstElementChild.getAttribute('data-row')) ; i++ ){
                        markAvailableSpots( i , currentPiece.column )
                    };
                    if(havePiece.length > 1){   // if there is at least 2 pieces in front
                        if(havePiece[1].dataset.color != currentPiece.color)
                        markAvailableSpots(havePiece[1].firstElementChild.getAttribute('data-row'), havePiece[1].firstElementChild.getAttribute('data-column'))
                    };
                }else if(havePiece.length == 0){ // if it is not at the bottom
                    up.forEach(item => {
                        markAvailableSpots(item.getAttribute('data-row'),item.getAttribute('data-column'))
                    })
                }    
            };
            if(currentPiece.row > 1){
                const down = (verticalC.filter( item => parseInt(item.dataset.row) < parseInt(currentPiece.row))).sort((a,b) => parseInt(b.getAttribute('data-row')) - parseInt(a.getAttribute('data-row')) ); // sort them from top to bottom
                const havePiece = down.filter(item => item.hasChildNodes())
                if(havePiece.length != 0){
                    for(let i = parseInt(currentPiece.row) - 1 ; i > parseInt(havePiece[0].firstElementChild.getAttribute('data-row')) ; i-- ){
                        markAvailableSpots( i , currentPiece.column )
                    };
                    if(havePiece.length > 1){   // if there is at least 2 pieces downwards
                        if(havePiece[1].dataset.color != currentPiece.color)
                        markAvailableSpots(havePiece[1].firstElementChild.getAttribute('data-row'), havePiece[1].firstElementChild.getAttribute('data-column'))
                    };
                }else if(havePiece.length == 0){
                    down.forEach(item => {
                        markAvailableSpots(item.getAttribute('data-row'),item.getAttribute('data-column'))
                    })
                }    
            };
            if(currentPiece.column < 9){  // if it is not on the right edge
                const right = (horizontalC.filter( item => parseInt(item.dataset.column) > parseInt(currentPiece.column))).sort((a,b) => parseInt(a.getAttribute('data-column')) - parseInt(b.getAttribute('data-column'))); // sort them from left to right
                const havePiece = right.filter(item => item.hasChildNodes())
                if(havePiece.length != 0){
                    for(let i = parseInt(currentPiece.column) + 1 ; i < parseInt(havePiece[0].firstElementChild.getAttribute('data-column')) ; i++ ){
                        markAvailableSpots( currentPiece.row , i )
                    };
                    if(havePiece.length > 1){   // if there is at least 2 pieces on right
                        if(havePiece[1].dataset.color != currentPiece.color)
                        markAvailableSpots(havePiece[1].firstElementChild.getAttribute('data-row'), havePiece[1].firstElementChild.getAttribute('data-column'))
                    };
                }else if(havePiece.length == 0){ // if it is not at the bottom
                    right.forEach(item => {
                        markAvailableSpots(item.getAttribute('data-row'),item.getAttribute('data-column'))
                    })
                }    
            };
            if(currentPiece.column > 1 ){  // if it is not on the left edge
                const left = (horizontalC.filter( item => parseInt(item.dataset.column) < parseInt(currentPiece.column))).sort((a,b) => parseInt(b.getAttribute('data-column')) - parseInt(a.getAttribute('data-column'))); // sort them from right to left
                const havePiece = left.filter(item => item.hasChildNodes())
                if(havePiece.length != 0){
                    for(let i = parseInt(currentPiece.column) - 1 ; i > parseInt(havePiece[0].firstElementChild.getAttribute('data-column')) ; i-- ){
                        markAvailableSpots( currentPiece.row , i )
                    };
                    if(havePiece.length > 1){   // if there is at least 2 pieces on left
                        if(havePiece[1].dataset.color != currentPiece.color)
                        markAvailableSpots(havePiece[1].firstElementChild.getAttribute('data-row'), havePiece[1].firstElementChild.getAttribute('data-column'))
                    };
                }else if(havePiece.length == 0){ // if it is not at the bottom
                    left.forEach(item => {
                        markAvailableSpots(item.getAttribute('data-row'),item.getAttribute('data-column'))
                    })
                }    
            };
            break;
        case 'knight':
            const upObstacle = document.querySelector(`.square[data-row="${currentPiece.row + 1}"][data-column="${currentPiece.column}"]`)
            const downObstacle = document.querySelector(`.square[data-row="${currentPiece.row - 1}"][data-column="${currentPiece.column}"]`)
            const leftObstacle = document.querySelector(`.square[data-row="${currentPiece.row }"][data-column="${currentPiece.column - 1}"]`)
            const rightObstacle = document.querySelector(`.square[data-row="${currentPiece.row }"][data-column="${currentPiece.column + 1}"]`)

            if(currentPiece.row < 9 && !upObstacle.hasChildNodes() ){
                if(currentPiece.column > 1){
                    markAvailableSpots(currentPiece.row + 2 , currentPiece.column - 1)
                };
                if(currentPiece.column < 9){
                    markAvailableSpots(currentPiece.row + 2 , currentPiece.column + 1)
                }
            };
            if(currentPiece.row > 2 && !downObstacle.hasChildNodes() ){
                if(currentPiece.column > 1){
                    markAvailableSpots(currentPiece.row - 2 , currentPiece.column - 1)
                };
                if(currentPiece.column < 9){
                    markAvailableSpots(currentPiece.row - 2 , currentPiece.column + 1)
                }
            };
            if(currentPiece.column > 2 && !leftObstacle.hasChildNodes()){
                if(currentPiece.row > 1){
                    markAvailableSpots(currentPiece.row - 1 , currentPiece.column - 2)
                };
                if(currentPiece.row < 10){
                    markAvailableSpots(currentPiece.row + 1 , currentPiece.column - 2)
                }
            };
            if(currentPiece.column < 8 && !rightObstacle.hasChildNodes()){
                if(currentPiece.row > 1){
                    markAvailableSpots(currentPiece.row - 1 , currentPiece.column + 2)
                };
                if(currentPiece.row < 10){
                    markAvailableSpots(currentPiece.row + 1 , currentPiece.column + 2)
                }
            };
            break;
    }
    let availableSquare = Array.from(document.querySelectorAll('.square.available'));
    availableSquare.forEach(item => {
        if(item.hasChildNodes()){
            if(item.firstElementChild.dataset.color == currentPiece.color){   // remove the green color if there was a teammate
                item.classList.remove('available');
            };
            if(item.firstElementChild.dataset.color != currentPiece.color){ // if the available move is to capture pieces
                const target = {};
                const king = square.find(sqr => sqr.hasChildNodes() && sqr.firstElementChild.dataset.piece == 'king' && sqr.firstElementChild.dataset.color == currentPiece.color)
                target.piece = item.firstElementChild.dataset.piece;
                target.color = item.firstElementChild.dataset.color;
                target.row = parseInt(item.firstElementChild.dataset.row);
                target.column = parseInt(item.firstElementChild.dataset.column);
                removePiece(target.row, target.column);
                removePiece(currentPiece.row, currentPiece.column)
                createPiece(currentPiece.piece, currentPiece.color,target.row, target.column);     // simulate what happen after the move
                if(currentPiece.piece != 'king'){
                    if(checkDanger(parseInt(king.dataset.row), parseInt(king.dataset.column))){
                        item.classList.remove('available')            // remove the available spots if our king will be captured after the move
                    };
                }else if(currentPiece.piece == 'king'){
                    if(checkDanger(target.row, target.column)){    // if we want to move the king, then the king would be in the new square
                        item.classList.remove('available')
                    };
                }
                removePiece(target.row, target.column);
                createPiece(target.piece, target.color, target.row, target.column);
                createPiece(currentPiece.piece, currentPiece.color, currentPiece.row, currentPiece.column)
            }
        }else if(!item.hasChildNodes()){
            const target = {};
            target.row = parseInt(item.dataset.row);
            target.column = parseInt(item.dataset.column);
            const king = square.find(sqr => sqr.hasChildNodes() && sqr.firstElementChild.dataset.piece == 'king' && sqr.firstElementChild.dataset.color == currentPiece.color)
            removePiece(currentPiece.row, currentPiece.column);
            createPiece(currentPiece.piece, currentPiece.color,target.row, target.column);
            if(currentPiece.piece != 'king'){
                if(checkDanger(parseInt(king.dataset.row), parseInt(king.dataset.column))){
                    item.classList.remove('available')
                };
            }else if(currentPiece.piece == 'king'){
                if(checkDanger(target.row, target.column)){
                    item.classList.remove('available')
                };
            }
            
            removePiece(target.row, target.column);
            createPiece(currentPiece.piece, currentPiece.color, currentPiece.row, currentPiece.column)
        };
    });
}

// read FEN string
const FENinput = document.querySelector('#readFEN')

FENinput.addEventListener('click', function(){
    let FEN = document.querySelector('#FENinput');
    if(FEN.value){
        removeGreenColor();
        removeBlueColor();
        square.forEach(item => {                            //clearing the original pieces
            if(item.hasChildNodes()){
                removePiece(item.dataset.row, item.dataset.column)
            }
        });
        
        const piecesOnBoard = FEN.value.split(/[/]/);
        const lastItem = piecesOnBoard[9].split(' ');
        piecesOnBoard.pop();
        piecesOnBoard.push(lastItem[0])
        // the first item would be row 10
        piecesOnBoard.reverse();
        function isUpperCase(item){
            if(item == item.toUpperCase()){
                return true
            }
        };
        for(let i = 0 ; i <= 9 ; i++){
            const row = piecesOnBoard[i].split('');  // looking up each row
            let columnNumber = 1;
            row.forEach(item => {
                if(isNaN(item)){        // if the item is not a number, i.e. it is a piece
                    if(isUpperCase(item)){ // if it is in uppercase, i.e. it is red
                        switch(item){
                            case 'C' :
                                createPiece('cannon','red',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'R' :
                                createPiece('rook','red',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'N' :
                                createPiece('knight','red',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'P' :
                                createPiece('pawn','red',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break; 
                            case 'A' :
                                createPiece('advisor','red',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'B' :
                                createPiece('bishop','red',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'K' :
                                createPiece('king','red',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                        }
                    }else{
                        switch(item){
                            case 'c' :
                                createPiece('cannon','black',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'r' :
                                createPiece('rook','black',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'n' :
                                createPiece('knight','black',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'p' :
                                createPiece('pawn','black',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break; 
                            case 'a' :
                                createPiece('advisor','black',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'b' :
                                createPiece('bishop','black',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                            case 'k' :
                                createPiece('king','black',parseInt(i+1),columnNumber);
                                columnNumber+=1;
                                break;
                        }
                        // console.log('lowercase piece',item)
                    }
                }else{
                    if(columnNumber + parseInt(item) <= 9){
                        columnNumber = columnNumber + parseInt(item);
                    }
                }
            })
        };
    
        if(lastItem[1] == 'w' || !lastItem[1]){
            isRed = true
            currentTurn = (isRed ? 'red' : 'black');
            if(lastItem[5]){
                showTurn.textContent =  `Round ${parseInt(lastItem[5])+1} : ${currentTurn} to move`;
                counter = parseInt(lastItem[5])*4;
            }else{
                showTurn.textContent =  `Round 1 : ${currentTurn} to move`;
            }
    
        }else{
            isRed = false
            currentTurn = (isRed ? 'red' : 'black');
            if(lastItem[5]){
                showTurn.textContent =  `Round ${lastItem[5]} : ${currentTurn} to move`;
                counter = (parseInt(lastItem[5])+1)*4 - 2;
            }else{
                showTurn.textContent =  `Round 1 : ${currentTurn} to move`;
            }
        };
        FEN.value = '';
    }

});

// output the FEN of the board
const genFEN = document.querySelector('#genFEN')
genFEN.addEventListener('click',function(){
    const rowFEN = {};
    function extractPiece(piece,color){
        const name = piece.split('');
        if(piece == 'knight'){
            if(color == 'red'){
                return name[1].toUpperCase();

            }else{
                return name[1]

            }
        }else{
            if(color == 'red'){
                return name[0].toUpperCase();

            }else{
                return name[0]

            }
        }
    }
    for(let i = 10 ; i > 0 ; i--){
        rowFEN[`row${i}`] = []
    };
    rowFEN.info = [];
    square.forEach(item => {
        let itemRow = rowFEN[`row${parseInt(item.dataset.row)}`];
            if(item.hasChildNodes()){
                itemRow.push(extractPiece(item.firstElementChild.dataset.piece,item.firstElementChild.dataset.color))
            }else{
                if(typeof itemRow[itemRow.length - 1] != "number"){
                    itemRow.push(1)
                }else if(typeof itemRow[itemRow.length - 1] == "number"){
                    itemRow[itemRow.length - 1] += 1;
                }
            }
    })
    let FEN = [];
    for(let i = 10 ; i > 0 ; i --){
        rowFEN[`row${i}`] = [rowFEN[`row${i}`].join('')];
        FEN.push(rowFEN[`row${i}`])
    };
    if(currentTurn == 'red'){
        rowFEN.info.push(' w');
        FEN[9] = [FEN[9] + ' w']
    }else if(currentTurn == 'black'){
        rowFEN.info.push(' b');
        FEN[9] = [FEN[9]+ ' b']
    }
    FEN = FEN.join('/')
    prompt('Copy the FEN below',FEN);
});

//game record
const record = document.querySelector('#record');
const move = [];
function printGameRecord(){
    let str = "";
    const genStraightLineMove = piece => {
        if(currentPiece.color == 'red'){
            move[Math.floor(counter/4) - 1] = [];
            if(currentPiece.row < destination.row){      // forward for red
                move[Math.floor(counter/4) - 1].push([`${piece.toUpperCase()}${10 - currentPiece.column}+${Math.abs(parseInt(destination.row)-currentPiece.row)}`]) ;
            }else if(currentPiece.row > destination.row){ // backward for red
                move[Math.floor(counter/4) - 1].push([`${piece.toUpperCase()}${10 - currentPiece.column}-${Math.abs(parseInt(destination.row)-currentPiece.row)}`]) ;
            }else if(currentPiece.row == destination.row){
                move[Math.floor(counter/4) - 1].push([`${piece.toUpperCase()}${10 - currentPiece.column}=${10 - destination.column}`]);
            }
        }else{
            if(currentPiece.row < destination.row){      // backward for black
                move[Math.floor(counter/4) - 1].push([`${piece}${currentPiece.column}-${Math.abs(parseInt(destination.row)-currentPiece.row)}`]) ;
            }else if(currentPiece.row > destination.row){ // forward for black
                move[Math.floor(counter/4) - 1].push([`${piece}${currentPiece.column}+${Math.abs(parseInt(destination.row)-currentPiece.row)}`]) ;
            }else if(currentPiece.row == destination.row){
                move[Math.floor(counter/4) - 1].push([`${piece}${currentPiece.column}=${destination.column}`]);
            }
        }
    };
    const genDiagonalMove = piece => {
        if(currentPiece.color == 'red'){
            move[Math.floor(counter/4) - 1] = [];
            if(currentPiece.row < destination.row){      // forward for red
                move[Math.floor(counter/4) - 1].push([`${piece.toUpperCase()}${10 - currentPiece.column}+${10 - destination.column}`]) ;
            }else if(currentPiece.row > destination.row){ // backward for red
                move[Math.floor(counter/4) - 1].push([`${piece.toUpperCase()}${10 - currentPiece.column}-${10 - destination.column}`]) ;
            }
        }else{
            if(currentPiece.row < destination.row){      // backward for black
                move[Math.floor(counter/4) - 1].push([`${piece}${currentPiece.column}-${destination.column}`]) ;
            }else if(currentPiece.row > destination.row){ // forward for black
                move[Math.floor(counter/4) - 1].push([`${piece}${currentPiece.column}+${destination.column}`]) ;
            }
        }
    };
        switch(currentPiece.piece){
            case 'cannon' :
                genStraightLineMove('c');
                break;
            case 'rook' :
                genStraightLineMove('r');
                break;
            case 'king' :
                genStraightLineMove('k');
                break;
            case 'pawn' :
                genStraightLineMove('p');
                break;
            case 'bishop' :
                genDiagonalMove('e');
                break;
            case 'advisor' :
                genDiagonalMove('a');
                break;
            case 'knight' :
                genDiagonalMove('h');
                break;   
        }
        if(move.length != 0){
            move.forEach((item, index) => {
                str += `<li> ${index + 1}.  ${item.join(' ')} </li>`;
            })
                
            
            record.innerHTML = str
        }
        }
// moves in cc bridge format
const convertBtn = document.querySelector('button.ccbridge')

function convertChinese(){
    const chinese = []
    let chineseStr = ""
    if(move.length > 0){
        move.forEach((item,index) => {
            if(item.length > 0){
                const step = item[0][0].split('')
                switch(step[0]){
                    case 'C':
                        step[0] = '炮'
                        break;
                    case 'R':
                        step[0] = '車';
                        break;
                    case 'K':
                        step[0] = '帥';
                        break;
                    case 'P':
                        step[0] = '兵';;
                        break;
                    case 'E':
                        step[0] = '相';
                        break;
                    case 'A':
                        step[0] = '仕';
                        break;
                    case 'H':
                        step[0] = '馬';
                        break;
                };
                switch(step[1]){
                    case '1':
                        step[1] = '一'
                        break;
                    case '2':
                        step[1] = '二';
                        break;
                    case '3':
                        step[1] = '三';
                        break;
                    case '4':
                        step[1] = '四';
                        break;
                    case '5':
                        step[1] = '五';
                        break;
                    case '6':
                        step[1] = '六';
                        break;
                    case '7':
                        step[1] = '七';
                        break;
                    case '8':
                        step[1] = '八';
                        break;                    
                    case '9':
                        step[1] = '九';
                        break;                
                };
                switch(step[2]){
                    case '+':
                        step[2] = '進'
                        break;
                    case '-':
                        step[2] = '退';
                        break;
                    case '=':     
                        step[2] = '平';
                        break;         
                };
                switch(step[3]){
                    case '1':
                        step[3] = '一'
                        break;
                    case '2':
                        step[3] = '二';
                        break;
                    case '3':
                        step[3] = '三';
                        break;
                    case '4':
                        step[3] = '四';
                        break;
                    case '5':
                        step[3] = '五';
                        break;
                    case '6':
                        step[3] = '六';
                        break;
                    case '7':
                        step[3] = '七';
                        break;
                    case '8':
                        step[3] = '八';
                        break;                    
                    case '9':
                        step[3] = '九';
                        break;                
                };
                const redStep = [step.join('')]
                chinese[index] = []
                chinese[index].push(redStep)
            };
            if(item.length == 2){
                const step = item[1][0].split('');
                switch(step[0]){
                    case 'c':
                        step[0] = '炮'
                        break;
                    case 'r':
                        step[0] = '車';
                        break;
                    case 'k':
                        step[0] = '將';
                        break;
                    case 'p':
                        step[0] = '卒';
                        break;
                    case 'e':
                        step[0] = '象';
                        break;
                    case 'a':
                        step[0] = '士';
                        break;
                    case 'h':
                        step[0] = '馬';
                        break;
                };
                switch(step[2]){
                    case '+':
                        step[2] = '進'
                        break;
                    case '-':
                        step[2] = '退';
                        break;
                    case '=':     
                        step[2] = '平';
                        break;         
                };
                const blackStep = [step.join('')]
                chinese[index].push(blackStep)
            }
        })
    }
    chinese.forEach((item,index) => {
        chineseStr += `${index + 1}. ${item.join(' ')} `
    })
    prompt('Copy this and paste it to CC Bridge', chineseStr)
}
convertBtn.addEventListener('click',convertChinese)




function init() {
    removeGreenColor();
    removeBlueColor();
    square.forEach(item => {
        if(item.hasChildNodes()){
            removePiece(item.dataset.row, item.dataset.column)
        }
    });
    createPiece('rook', 'red', 1, 1);
    createPiece('rook', 'red', 1, 9);
    createPiece('rook', 'black', 10, 1);
    createPiece('rook', 'black', 10, 9);
    createPiece('knight', 'red', 1, 2)
    createPiece('knight', 'red', 1, 8)
    createPiece('knight', 'black', 10, 2)
    createPiece('knight', 'black', 10, 8)
    createPiece('pawn','red',4,1)
    createPiece('pawn','red',4,3)
    createPiece('pawn','red',4,5)
    createPiece('pawn','red',4,7)
    createPiece('pawn','red',4,9)
    createPiece('pawn','black',7,1)
    createPiece('pawn','black',7,3)
    createPiece('pawn','black',7,5)
    createPiece('pawn','black',7,7)
    createPiece('pawn','black',7,9)
    createPiece('cannon','red',3,2)
    createPiece('cannon','red',3,8)
    createPiece('cannon','black',8,2)
    createPiece('cannon','black',8,8)
    createPiece('bishop','red',1,3)
    createPiece('bishop','red',1,7)
    createPiece('bishop','black',10,3)
    createPiece('bishop','black',10,7)
    createPiece('advisor','red',1,4)
    createPiece('advisor','red',1,6)
    createPiece('advisor','black',10,4)
    createPiece('advisor','black',10,6)
    createPiece('king','red',1,5)
    createPiece('king','black',10,5)
    counter = 4;
    isRed = true;
    currentTurn = (isRed ? 'red' : 'black');
    showTurn.textContent =  `Round ${Math.floor(counter/4)} : ${currentTurn} to move`
    record.innerHTML = ""
}

init();
const initButton = document.querySelector('#startPos');

initButton.addEventListener('click',init);
