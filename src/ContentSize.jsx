import { useState, useEffect } from 'react';

// How many tiles there are in the rows and columns
export const GRID_SIZE = 3; // <--- Change grid_size to change the number of rows and columns
export const NUMBER_OF_TILES = GRID_SIZE*GRID_SIZE;

export function useBoardSize() {
    const [boardSize, setBoardSize] = useState(0);

    const handleResize = () => {
        const windowWidth = window.innerWidth;
        let newSize;

        if (windowWidth < 400) {
            newSize = windowWidth * 0.9; // 90vw
        }
        else if(windowWidth < 700){
            newSize = 390
        }
        else if(windowWidth < 800){
            newSize = windowWidth * 0.55; // 50vw
        }
        else{
            newSize = 440
        }

        setBoardSize(newSize);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return boardSize;
}
