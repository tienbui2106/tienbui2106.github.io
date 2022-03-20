// game settings
let ROW = 3;
let COLUMN = 3;
let BLOCK_WIDTH = Math.floor(600 / ROW);
let BLOCK_HEIGHT = Math.floor(600 / COLUMN);
let imageSource = "url('../images/phone.jpg')";
let blocks = [];
let thisSetup = [];
let emptyBlock = ROW * COLUMN;
let move = 0;
// game settings

// when the document is loaded
$(function () {
    // register onClick for start button
    $("#start").on("click", function (e) {
        window.open("game.html", "_self");
    });

    // register onClick for quit button
    $("#quit").on("click", function (e) {
        window.open("index.html", "_self");
    });

    // register onClick for reset button
    $("#reset").on("click", reset);

    // register onClick for shuffle button
    $("#shuffle").on("click", shufflePuzzle);

    // register onClick for answer button
    $("#answer").on("click", function (e) {
        if ($(this).html() == "Show Answer") {
            showAnswerContainer();
        }
        else {
            hideAnswerContainer();
        }
    })

    // create the answer image
    $("#answer-image").css({
        "background": imageSource,
        "background-size": "cover",
        "width": '300px',
        "height": '300px'
    })

    // initialize the puzzle blocks
    initializeBlocks();
    // shuffle the puzzle blocks
    shufflePuzzle();

    // do you want the easy way,
    // just double click the move counter.
    $("#move-counter").on("dblclick", function (e) {
        blocks.sort((a, b) => a - b);
        updatePuzzle();
    })
});

// initialize the blocks in the puzzle container
function initializeBlocks() {
    let puzzleContainer = $("#puzzle-container");
    for (let i = 0; i < ROW * COLUMN; i++) {
        // block coords
        let coords = indexToCoords(i);
        // block id
        let id = i + 1;
        // block image
        let image = `${-coords.x}px ${-coords.y}px ${imageSource} no-repeat`;
        // create the block with image, id, coords
        let block = createBlock(image, id, coords);
        // append it to the puzzle container
        puzzleContainer.append(block);
        // push the block id into an array to keep track
        blocks.push(id);
    }

    // hide the last block
    if (emptyBlock != 1) {
        let emptyBlockId = "#" + emptyBlock;
        $(emptyBlockId).css({
            "background": "transparent",
            "border": "none"
        });
    }

    // register the onClick for the puzzle blocks
    $(".block").on("click", function () {
        // get the index of this block in the array
        let id = $(this).attr("id").toString();
        let index = blocks.indexOf(parseInt(id));
        // move this block
        moveBlock(index);
    });
}

// hide the answer image
function hideAnswerContainer() {
    $("#left-curtain").css({ "width": "150px" });
    $("#right-curtain").css({ "width": "150px" });
    $("#answer").html("Show Answer");
}

// show the answer image
function showAnswerContainer() {
    $("#left-curtain").css({ "width": "0" });
    $("#right-curtain").css({ "width": "0" });
    $("#answer").html("Hide Answer");
}

// create a block from image, id, and coords
function createBlock(image, id, coords) {
    let block = $('<div>', {
        class: 'block',
        id: id
    });
    block.css({
        "background": image,
        "top": coords.y,
        "left": coords.x,
        "width": BLOCK_WIDTH,
        "height": BLOCK_HEIGHT
    });

    return block;
}

// swap two blocks
function swapBlocks(first, second) {
    let temp = blocks[second];
    blocks[second] = blocks[first];
    blocks[first] = temp;
}

// shuffle the puzzle - play a new game
function shufflePuzzle() {
    // shuffle the puzzle
    for (let i = 0; i < 50; i++) {
        let a = Math.floor(Math.random() * ROW * COLUMN);
        let b = Math.floor(Math.random() * ROW * COLUMN);
        swapBlocks(a, b);
    }
    // store the blocks setup
    thisSetup = Array.from(blocks);
    // set the move counter to 0
    move = 0;
    // update the shuffled puzzle
    updatePuzzle();
    // reset the solve notification
    $("#puzzle-solve").html('');
}

// update the board's appearance
function updatePuzzle() {
    // update the board's appearance
    for (let i = 0; i < blocks.length; i++) {
        // calculate the coords for ith block
        let blockCoords = indexToCoords(i);

        // move the block to its coords
        let currentBlock = "#" + blocks[i];
        $(currentBlock).css({
            "top": blockCoords.y,
            "left": blockCoords.x,
        });
    }
    // update move counter
    $("#move-counter").html("Moves: " + move);
    // check if the puzzle is solved
    setTimeout(checkPuzzleSolved, 500);
}

// move block at this index
function moveBlock(index) {
    // a block is moveable if it adjacent to the empty block
    // get the empty block index in the array
    let emptyBlockIndex = blocks.indexOf(emptyBlock);
    // check if the current block is adjacent to the empty block
    if (isAdjacentBlock(index, emptyBlockIndex)) {
        // swap the two blocks
        swapBlocks(index, emptyBlockIndex);
        // increase the move counter
        move++;
        // update the puzzle
        updatePuzzle();
    }
}

// check if two blocks are adjacent to one another
function isAdjacentBlock(firstIndex, secondIndex) {
    let fBlockCoords = indexToCoords(firstIndex);
    let sBlockCoords = indexToCoords(secondIndex);
    let isHorizontalAlign = (fBlockCoords.y == sBlockCoords.y) &&
        (Math.abs(fBlockCoords.x - sBlockCoords.x) == BLOCK_WIDTH);
    let isVerticalAlign = (fBlockCoords.x == sBlockCoords.x) &&
        (Math.abs(fBlockCoords.y - sBlockCoords.y) == BLOCK_HEIGHT);
    return isHorizontalAlign || isVerticalAlign;
}

// get the coords of the block with this index
function indexToCoords(index) {
    // calculate the coords for ith block
    let x = (index % ROW) * BLOCK_WIDTH;
    let y = Math.floor(index / ROW) * BLOCK_HEIGHT;
    let coords = {
        x: x,
        y: y
    }
    return coords;
}

// check if the puzzle board is solved
function checkPuzzleSolved() {
    // if the blocks array is not sorted, then return
    for (let i = 0; i < blocks.length - 1; i++) {
        if (blocks[i] + 1 != blocks[i + 1])
            return;
    }
    // else, notify that the puzzle is solved
    $("#puzzle-solve").html(`Congratulations! You solve the puzzle in ${move} moves.
    \nIf you want to play again, hit shuffle`);
}

// reset the puzzle to the starting point
function reset() {
    // restore this board setup
    blocks = Array.from(thisSetup);
    // restore move to 0
    move = 0;
    // update the board
    updatePuzzle();
    // some weird effects
    $("#puzzle-solve").html('');
    $("#nyan-cat").css({
        "transition": "all 5s linear",
        "display": "block",
        "left": '100%'
    })
    setTimeout(() => {
        $("#nyan-cat").css({
            "left": "-100px",
            "transition": "none"
        })
    }, 5500);
}