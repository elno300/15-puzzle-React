import { NUMBER_OF_TILES, GRID_SIZE } from "./ContentSize";

// https://codepen.io/unindented/pen/QNWdRQ
// Checks if the puzzle can be solved.
export function isSolvable (tiles) {
    let product = 1
    for (let i = 1, l = NUMBER_OF_TILES - 1; i <= l; i++) {
      for (let j = i + 1, m = l + 1; j <= m; j++) {
        product *= (tiles[i - 1] - tiles[j - 1]) / (i - j)
      }
    }
    return Math.round(product) === 1
  }

// Checks if the puzzle is solved.
export function isSolved (tiles) {
    for (let i = 0, l = tiles.length; i < l; i++) {
      if (tiles[i] !== i) {
        return false
      }
    }
    return true
  }

// Get linear index from a row/col pair
export function getIndex(row, col){
    return parseInt(row, 10) * GRID_SIZE + parseInt(col, 10);
}

// Get the row/ col pair from a linear index.
export function getMatrixPosition(index){
    return{
        row: Math.floor(index / GRID_SIZE),
        col: index % GRID_SIZE,
    };
}

// Calculates the visual position (coordinates) of the tile within the grid,
// and decides where to render the tiles visually on the screen.
export function getVisualPosition(row, col, width, height){
    return{
        x: col * width,
        y: row * height,
    };
}

// Shuffles the tiles
export function shuffle(tiles){
    const shuffledTiles = [
        ...tiles
            .filter((t)=> t !== tiles.length -1)
            .sort(() => Math.random() -0.5),
            tiles.length - 1,
    ];
    return isSolvable(shuffledTiles) && !isSolved(shuffledTiles)
    ? shuffledTiles
    : shuffle(shuffledTiles);
}

// Function that checks if there can be a swap of the tiles
// Returns true if the tiles are next to each other
export function canSwap (src, dest, GRID_SIZE){
  const { row: srcRow, col: srcCol } = getMatrixPosition(src, GRID_SIZE)
  const { row: destRow, col: destCol } = getMatrixPosition(dest, GRID_SIZE);

  return Math.abs(srcRow - destRow) + Math.abs(srcCol - destCol) === 1
;}

// Swap 2 tiles with each other
export function swap(tiles, src, dest){
  const tilesResult = [...tiles];
  [tilesResult[src], tilesResult[dest]] = [tiles[dest], tilesResult[src]]
  return tilesResult;
}

// Swap tiles when the empty tile is last in the row or column.
export function swapMany(tiles, indexArray) {
    // Copies the tiles
    const tilesResult = [...tiles];
    const lastTileIndex = indexArray[indexArray.length - 1];
    const lastTile = tiles[lastTileIndex];

    for (let i = indexArray.length - 1; i > 0; i--) {
      // Retrieve the index of the current tile to be moved.
      const currentIndex = indexArray[i];
      // Retrive the indexet of the previous tile that will get the position of the current tile.
      const prevIndex = indexArray[i - 1];

      // Move the value of the current tile to the position of the previous tile in the new array.
      tilesResult[currentIndex] = tiles[prevIndex];
    }
    // Give the last, empty tile the first tiles position
    const firstIndex = indexArray[0];
    tilesResult[firstIndex] = lastTile;

    // Return the updated array with new (tiles) positions
    return tilesResult;
  }

// This func is called when empty tile is first in the row or col.
  export function swapManyReverse(tiles, indexArray) {

    const tilesResult = [...tiles];
    const firstTileIndex = indexArray[0];
    const firstTile = tiles[firstTileIndex];

    // Loop through indexArray and move each tile to the next position
    for (let i = 1; i < indexArray.length - 1; i++) {
        const currentIndex = indexArray[i];
        const nextIndex = indexArray[i + 1];
        tilesResult[currentIndex] = tiles[nextIndex];
    }

    // Place the first tile at the last position.
    const lastIndex = indexArray[indexArray.length - 1];
    tilesResult[lastIndex] = firstTile;

    return tilesResult;
}
