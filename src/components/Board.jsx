import { useState, useEffect } from 'react'; // Hooks
import Tile from './Tile.jsx'; // Component

import { NUMBER_OF_TILES, GRID_SIZE, useBoardSize  } from '../ContentSize.jsx';

// Functions
import { shuffle, canSwap, swap, isSolved, getMatrixPosition, swapMany, getIndex, swapManyReverse } from '../GameFunctions.jsx';

// Sound-effects
import swapSoundEffect from '../assets/soundEffects/happy-pop-2-185287.mp3';
import cantSwapSoundEffect from '../assets/soundEffects/mixkit-gate-latch-click-1924.wav';
import winSoundEffect from '../assets/soundEffects/cute-level-up-3-189853.mp3';

// Other effects
import confetti from "https://cdn.skypack.dev/pin/canvas-confetti@v1.9.2-Tii8YtZuR6hfhzG218v7/mode=imports/optimized/canvas-confetti.js"

// Icons
import 'bootstrap-icons/font/bootstrap-icons.css';


function Board(){

    const BOARD_SIZE = useBoardSize();
    // An array is created with index 0 - 15
    // const[tiles, setTiles] = useState([...Array(NUMBER_OF_TILES).keys()]);
    const [tiles, setTiles] = useState([]);
      // This effect runs whenever NUMBER_OF_TILES changes
      useEffect(() => {
        // Generate new tiles based on the updated NUMBER_OF_TILES
        const newTiles = [...Array(NUMBER_OF_TILES).keys()];
        setTiles(newTiles);
        setIsStarted(false)
    }, []);

    const [isStarted, setIsStarted] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

    //Sound-effects
    const swapSound = isSoundEnabled ? new Audio(swapSoundEffect) : null;
    const cantSwapSound = isSoundEnabled ? new Audio(cantSwapSoundEffect) : null;

    const shuffleTiles = () => {
        const shuffledTiles = shuffle(tiles)
        setTiles(shuffledTiles)
    }

    // Function for when clicking a tile to make it swap places
    const swapTiles = (tileIndex) => {
        // Index for the empty tile to compare if it's on the same row as the clicked tile.
        const emptyTileIndex = tiles.indexOf(tiles.length - 1);
        const { row: emptyRow, col: emptyCol } = getMatrixPosition(emptyTileIndex);
        const { row: clickedRow, col: clickedCol } = getMatrixPosition(tileIndex);

        let tilesToSwap = []

        // searching for the number(index) 15 in the list because it's the last, empty tile.
        if(canSwap(tileIndex, tiles.indexOf(tiles.length - 1))){
            const swappedTiles = swap(tiles, tileIndex, tiles.indexOf(tiles.length -1 ))
            setTiles(swappedTiles)
            swapSound.play()
        }
        // Change position for multiple tiles in a row.
        else if(emptyRow === clickedRow ) {


            if(emptyCol< clickedCol){

                tilesToSwap.push(emptyTileIndex)

                for(let i = emptyCol; i< clickedCol ; i++){
                     tilesToSwap.push(getIndex(clickedRow, i))
                }

                tilesToSwap.push(tileIndex)

                const swapped = swapManyReverse(tiles, tilesToSwap)
                setTiles(swapped)
                swapSound.play()
            }

            else if(clickedCol < emptyCol){

                for(let i = clickedCol; i< emptyCol ; i++){
                     tilesToSwap.push(getIndex(clickedRow, i))
                }
                tilesToSwap.push(emptyTileIndex)

                const swapped = swapMany(tiles, tilesToSwap)
                setTiles(swapped)
                swapSound.play()
            }
        }
        // Change position for multiple tiles in a column.
        else if(emptyCol === clickedCol ) {

            if(emptyRow< clickedRow){

                tilesToSwap.push(emptyTileIndex)
                for(let i = emptyRow; i< clickedRow ; i++){

                     tilesToSwap.push(getIndex(i, clickedCol))

                }
                tilesToSwap.push(tileIndex)

                const swapped = swapManyReverse(tiles, tilesToSwap)
                setTiles(swapped)
                swapSound.play()
            }
            else if(clickedRow< emptyRow){

              for(let i = clickedRow; i< emptyRow ; i++){

                     tilesToSwap.push(getIndex( i, clickedCol))

                }
                tilesToSwap.push(emptyTileIndex)
                const swapped = swapMany(tiles, tilesToSwap)
                setTiles(swapped)
                swapSound.play()
            }

        }
        else{
            cantSwapSound.play();
        }

    }

// This function is triggered upon clicking a tile and updates the tiles by swapping the tile at the given index.
const handleTileClick = (index) => {
    if(isStarted){
        swapTiles(index)
    }

};

// This function will run when the shuffle button is clicked
const handleShuffleClick = () => {
    shuffleTiles()
};

// Shuffles all tiles on start and sets variabel to true.
const handleStartClick = () =>{
    shuffleTiles()
    setIsStarted(true)
};

// Turn off or on the sound-effects
const toggleSound = () =>{
    setIsSoundEnabled(!isSoundEnabled)
};


// Calculate the size of each tile based on the board size
    let placeWidth = Math.round(BOARD_SIZE / GRID_SIZE);
    let placeHeight = Math.round(BOARD_SIZE / GRID_SIZE);
    const style = {
        width: BOARD_SIZE,
        height: BOARD_SIZE
    };

    const hasWon = isSolved(tiles)

    useEffect(() => {
        if (hasWon && isStarted) {
            confetti();
            const winning = isSoundEnabled ? new Audio(winSoundEffect): null;
            winning.play();
        }
    }, [hasWon, isStarted, isSoundEnabled]);

    return(
        <>
        <div className='board-wrapper'>
           <div className='puzzle-solved-container'>
                {hasWon && isStarted && <p>Puzzle solved</p>}</div>
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
                  {/* If puzzle is started and won then this div is visible */}
            </ul>
            </div>
                <div className='button-container'>
                    {!isStarted ?
                        (<div><button onClick={handleStartClick}>Start Game</button></div>) :
                        (<button onClick={handleShuffleClick}>Restart Game</button>)
                    }
                <button onClick={toggleSound}>{isSoundEnabled ?
                    <i className="bi bi-volume-up-fill"></i> :
                    <i className="bi bi-volume-mute-fill"></i>}
                </button>
            </div>
        </>
    )
}

export default Board
