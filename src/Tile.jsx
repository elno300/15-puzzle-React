import { getMatrixPosition, getVisualPosition } from "./GameFunctions";
import { NUMBER_OF_TILES, GRID_SIZE } from "./ContentSize";
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

function Tile(props) {
    const { tile, index, width, height, handleTileClick } = props;

    const { row, col } = getMatrixPosition(index);
    const visualPos = getVisualPosition(row, col, width, height);

    const tileStyle = {
        width: `calc(100% / ${GRID_SIZE})`,
        height: `calc(100% / ${GRID_SIZE})`,
    };

    return (
        <motion.li
            className="tile"
            style={{
                ...tileStyle,
                transform: `translate3d(${visualPos.x}px, ${visualPos.y}px, 0)`,
                opacity: tile === NUMBER_OF_TILES - 1 ? 0 : 1,
            }}
            onClick={() => handleTileClick(index)}
            animate={{ x: visualPos.x, y: visualPos.y }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {tile + 1}
        </motion.li>
    );
}

Tile.propTypes = {
    tile: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    handleTileClick: PropTypes.func,
};

export default Tile;
