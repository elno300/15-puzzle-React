import { useState, useEffect } from 'react';
import Tile from './Tile.jsx';
import { NUMBER_OF_TILES, GRID_SIZE, useBoardSize  } from './ContentSize.jsx';
import { shuffle, canSwap, swap, isSolved, getMatrixPosition, swapMany, getIndex, swapManyReverse } from './GameFunctions.jsx';
import swapSoundEffect from './assets/soundEffects/happy-pop-2-185287.mp3';
import winSoundEffect from './assets/soundEffects/cute-level-up-3-189853.mp3';
import 'bootstrap-icons/font/bootstrap-icons.css';
import confetti from "https://cdn.skypack.dev/pin/canvas-confetti@v1.9.2-Tii8YtZuR6hfhzG218v7/mode=imports/optimized/canvas-confetti.js"


function Board(){
   
    const BOARD_SIZE = useBoardSize();
    // An array is created with index 0 - 15
    const[tiles, setTiles] = useState([...Array(NUMBER_OF_TILES).keys()]);
    const [isStarted, setIsStarted] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    const shuffleTiles = () => {
        const shuffledTiles = shuffle(tiles)
        setTiles(shuffledTiles)
    }

    // Function that plays sound effects if isSoundEnabled is true
    const playSwapSound = () => {
        if(isSoundEnabled){
            const swapSound = new Audio(swapSoundEffect);
            swapSound.play();
        }
    }

    // Function for when clicking a tile to make it swap places
    const swapTiles = (tileIndex) => {
        // Index for the empty tile to compare if it's on the same row as the clicked tile.
        const emptyTileIndex = tiles.indexOf(tiles.length - 1);
        const { row: emptyRow, col: emptyCol } = getMatrixPosition(emptyTileIndex);
        const { row: clickedRow, col: clickedCol } = getMatrixPosition(tileIndex);
        // const emptyTileVisualIndex = getIndex(emptyRow, emptyCol);
        // const clickedTileVisualIndex = getIndex(clickedRow, clickedCol)
        let tilesToSwap = []

        // searching for the number(index) 15 in the list because it's the last, empty tile.
        if(canSwap(tileIndex, tiles.indexOf(tiles.length - 1))){
           const swappedTiles = swap(tiles, tileIndex, tiles.indexOf(tiles.length -1 ))
           playSwapSound();
           setTiles(swappedTiles)
        }
        // Change position for multiple tiles in a row.
        else if(emptyRow === clickedRow ) {
            playSwapSound();

            if(emptyCol< clickedCol){

                tilesToSwap.push(emptyTileIndex)

                for(let i = emptyCol; i< clickedCol ; i++){
                     tilesToSwap.push(getIndex(clickedRow, i))

                }

                tilesToSwap.push(tileIndex)

                const swapped = swapManyReverse(tiles, tilesToSwap)
                setTiles(swapped)
            }

            else if(clickedCol < emptyCol){

                for(let i = clickedCol; i< emptyCol ; i++){
                     tilesToSwap.push(getIndex(clickedRow, i))
                }
                tilesToSwap.push(emptyTileIndex)

                const swapped = swapMany(tiles, tilesToSwap)
                setTiles(swapped)
            }
        }
        // Change position for multiple tiles in a column.
        else if(emptyCol === clickedCol ) {

            playSwapSound();

            if(emptyRow< clickedRow){

                tilesToSwap.push(emptyTileIndex)
                for(let i = emptyRow; i< clickedRow ; i++){

                     tilesToSwap.push(getIndex(i, clickedCol))

                }
                tilesToSwap.push(tileIndex)

                const swapped = swapManyReverse(tiles, tilesToSwap)
                setTiles(swapped)
            }
            else if(clickedRow< emptyRow){

              for(let i = clickedRow; i< emptyRow ; i++){

                     tilesToSwap.push(getIndex( i, clickedCol))

                }
                tilesToSwap.push(emptyTileIndex)
                const swapped = swapMany(tiles, tilesToSwap)
                setTiles(swapped)
            }

        }

    }

// This is the first function that will be called once the tile is clicked
// This function will run when a tile is clicked
const handleTileClick = (index) => {
    // Update tiles
    swapTiles(index)

};

// This function will run when the shuffle button is clicked
const handleShuffleClick = () => {
    shuffleTiles()
};

const handleStartClick = () =>{
    shuffleTiles()
    setIsStarted(true)
};

const toggleSound = () =>{
    setIsSoundEnabled(!isSoundEnabled)
};

// Calculate the size of each tile based on the board size
    const placeWidth = Math.round(BOARD_SIZE / GRID_SIZE);
    const placeHeight = Math.round(BOARD_SIZE / GRID_SIZE);
    const style = {
        width: BOARD_SIZE,
        height: BOARD_SIZE
    };

    const hasWon = isSolved(tiles)

    useEffect(() => {
        if (hasWon && isStarted) {
            // Call the confetti if game is solved and started
            confetti();
           if(isSoundEnabled){
            const winSound = new Audio(winSoundEffect);
            winSound.play();
           }
        }
    }, [hasWon, isStarted, isSoundEnabled]);

    return(
        <>
            <ul style= {style} className="board">
                {tiles.map((tile, index) => (
                    <Tile
                        key={tile}
                        index={index}
                        tile={tile}
                        width={placeWidth}
                        height={placeHeight}
                        handleTileClick={handleTileClick}
                        />
                ))}
            </ul>
            {/* If puzzle is started and won then this div is visible */}
            <div className='puzzle-solved-container'>
            {hasWon && isStarted && <p>Puzzle solved</p>}</div>
            <div className='button-container'>
                <button>Menu</button>
                {!isStarted ?
                    (<div><button onClick={handleStartClick}>Start Game</button></div>) :
                    (<button onClick={handleShuffleClick}>Restart Game</button>)
                }
            <button onClick={toggleSound}>{isSoundEnabled ? <i className="bi bi-volume-up-fill"></i> : <i className="bi bi-volume-mute-fill"></i>}</button>
            </div>
        </>
    )
}

export default Board
