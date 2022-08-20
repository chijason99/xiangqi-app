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
}
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

function init() {
    removeGreenColor();
    removeBlueColor();
    square.forEach(item => {
        if(item.hasChildNodes()){
            removePiece(item.dataset.row, item.dataset.column)
        }
    })
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
    counter = 4
    showTurn.textContent =  `Round ${Math.floor(counter/4)} : ${currentTurn} to move`
}

init();

const initButton = document.querySelector('#startPos');

initButton.addEventListener('click',init);

//movement of pieces
function setCurrentPieceInfo(piece){  // record the data for the first click
    currentPiece.piece = piece.dataset.piece;
    currentPiece.color = piece.dataset.color;
    currentPiece.row = parseInt(piece.dataset.row) ;
    currentPiece.column = parseInt(piece.dataset.column);
    removeBlueColor();
    document.querySelector(`.square[data-row="${currentPiece.row}"][data-column="${currentPiece.column}"]`).classList.add('current')
}
function setDestinationInfo(piece){ // record the data for second click
    destination.row = piece.dataset.row;
    destination.column = piece.dataset.column;
}
function removePiece(row,column){ // remove the piece from the square
    const target = document.querySelector(`img[data-row = "${row}"][data-column = "${column}" ]`)
    target.remove();
}
function markAvailableSpots(row,column){ // mark the square green if it is available for the piece
    document.querySelector(`.square[data-row="${row}"][data-column="${column}"]`).classList.add('available')
}
function removeAvailableSpots(row,column){ // mark the square green if it is available for the piece
    document.querySelector(`.square[data-row="${row}"][data-column="${column}"]`).classList.remove('available')
}

const currentPiece = {}
const destination = {}
function movePieces(){
        square.forEach(sqr => {
            sqr.addEventListener('click',function(e1){
                    if(counter % 2 == 0 && (e1.target.dataset.color == currentTurn)){
                        if(sqr.hasChildNodes()){                   //first time clicking on pieces
                            // console.log(e1.target);
                            setCurrentPieceInfo(e1.target);
                            setAvailablePath(currentPiece.piece)
                            counter+=1;                          // mark down there has already been a click on the board
                        }
                    }else if(counter % 2 != 0){                   // On the second click
                        if(sqr.hasChildNodes()){                  // if the second target has a piece
                            if(sqr.firstElementChild.dataset.color == currentPiece.color){    //if selecting the piece with the same color
                                removeGreenColor();
                                setCurrentPieceInfo(e1.target);
                                setAvailablePath(currentPiece.piece);
                            }else if(sqr.classList.contains('available')){        // capturing opponent pieces
                                setDestinationInfo(e1.target);
                                removePiece(currentPiece.row,currentPiece.column);  // remove original piece
                                removePiece(destination.row,destination.column);    // remove piece at destination(capture)
                                createPiece(currentPiece.piece,currentPiece.color,destination.row,destination.column)
                                removeGreenColor(); 
                                removeBlueColor();
                                counter+=1; 
                                setNextTurn();
                            }
                        }else if(!sqr.hasChildNodes() && sqr.classList.contains('available')){ // if there is no piece and the square is available
                            setDestinationInfo(e1.target);
                            removePiece(currentPiece.row,currentPiece.column);  // remove original piece
                            createPiece(currentPiece.piece,currentPiece.color,destination.row,destination.column);
                            removeGreenColor();
                            removeBlueColor();
                            counter+=1; 
                            setNextTurn();
                        }else if(!sqr.hasChildNodes() && !sqr.classList.contains('available')){
                            removeGreenColor();
                            removeBlueColor();
                            counter-=1;
                        }
                    }
                

            })
        })
    }
    
movePieces();

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
                const sameColumn = Array.from(document.querySelectorAll(`.square[data-column="${currentPiece.column}"]`));
                const aboveRedKing = sameColumn.filter(item => parseInt(item.dataset.row) > currentPiece.row).sort((a,b) => parseInt(a.getAttribute('data-row')) - parseInt(b.getAttribute('data-row')));
                const piecesAboveRedKing = aboveRedKing.filter(item => item.hasChildNodes())
                if(piecesAboveRedKing.length == 1 && piecesAboveRedKing[0].firstElementChild.dataset.piece == 'king'){
                    markAvailableSpots(piecesAboveRedKing[0].firstElementChild.dataset.row, piecesAboveRedKing[0].firstElementChild.dataset.column)
                }else if(piecesAboveRedKing.length > 1 && piecesAboveRedKing[0].firstElementChild.dataset.piece == 'king'){
                    markAvailableSpots(piecesAboveRedKing[0].firstElementChild.dataset.row, piecesAboveRedKing[0].firstElementChild.dataset.column)
                }
            }else if(currentPiece.color == 'black'){
                if(currentPiece.row < 10){  // if the king is at 1st or 2nd floor
                    //move upwards
                    markAvailableSpots(currentPiece.row+1, currentPiece.column)
                };
                if(currentPiece.row > 8){  // if the king is at 2nd or 3rd floor
                    //move downwards
                    markAvailableSpots(currentPiece.row-1, currentPiece.column)
                };
                const sameColumn = Array.from(document.querySelectorAll(`.square[data-column="${currentPiece.column}"]`));
                const belowBlackKing = sameColumn.filter(item => parseInt(item.dataset.row) < currentPiece.row).sort((a,b) => parseInt(b.getAttribute('data-row')) - parseInt(a.getAttribute('data-row')));
                const piecesBelowBlackKing = belowBlackKing.filter(item => item.hasChildNodes())
                if(piecesBelowBlackKing.length == 1 && piecesBelowBlackKing[0].firstElementChild.dataset.piece == 'king'){
                    markAvailableSpots(piecesBelowBlackKing[0].firstElementChild.dataset.row, piecesBelowBlackKing[0].firstElementChild.dataset.column)
                }else if(piecesBelowBlackKing.length > 1 && piecesBelowBlackKing[0].firstElementChild.dataset.piece == 'king'){
                    markAvailableSpots(piecesBelowBlackKing[0].firstElementChild.dataset.row, piecesBelowBlackKing[0].firstElementChild.dataset.column)
                }
            };
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
                    // if(havePiece[0].firstElementChild.getAttribute('data-color') != currentPiece.color){
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
                console.log(left,havePiece)
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
            }
    }
    let availableSquare = Array.from(document.querySelectorAll('.square.available'))     // remove the green color if there was a teammate
    availableSquare.forEach(item => {
        if(item.hasChildNodes()){
            if(item.firstElementChild.dataset.color == currentPiece.color){
                item.classList.remove('available');
            }
        }
    });
}

// read FEN string
const FENinput = document.querySelector('#generateFEN')

FENinput.addEventListener('click', function(){
    removeGreenColor();
    removeBlueColor();
    square.forEach(item => {                            //clearing the original pieces
        if(item.hasChildNodes()){
            removePiece(item.dataset.row, item.dataset.column)
        }
    });
    let FEN = document.querySelector('#FEN');
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
                            console.log(columnNumber)
                            break;
                        case 'K' :
                            createPiece('king','red',parseInt(i+1),columnNumber);
                            columnNumber+=1;
                            break;
                    }
                    // console.log('Uppercase piece',item)
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
                    console.log('number',columnNumber,parseInt(item))
                }
            }
        })
    };

    if(lastItem[1] == 'w'){
        isRed = true
        currentTurn = (isRed ? 'red' : 'black');
        showTurn.textContent =  `Round ${lastItem[5]} : ${currentTurn} to move`;
        counter = parseInt(lastItem[5])*4 + 2;
    }else{
        isRed = false
        currentTurn = (isRed ? 'red' : 'black');
        showTurn.textContent =  `Round ${lastItem[5]} : ${currentTurn} to move`;
        counter = (parseInt(lastItem[5])+1)*4 - 2;
    };
    FEN.value = '';
});
