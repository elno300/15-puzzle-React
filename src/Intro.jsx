
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function Intro(){

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 2300);

      return () => clearTimeout(timeoutId);
    }, []);

    const textVariants = {
        hidden: { opacity: 0, filter: 'blur(10px)' }, // Lägg till blur-effekt
        visible: { opacity: 1, filter: 'blur(0px)' }, // Ta bort blur-effekt
    };

    return(
        <motion.div
            className="game-intro"
            animate={{ y: isVisible ? 0 : '-100%', }}
            transition={{ duration: 0.7, ease: "easeInOut", type: "forward" }}

            >
               <AnimatePresence>
                {/* {isVisible && ( */}
                    <motion.div
                        className='intro-text-wrapper'
                        initial='hidden'
                        animate='visible'
                        variants={textVariants}
                    >
                        <motion.h1
                        initial = {{ opacity:0 }}
                        variants={textVariants}
                        transition={{delay: 0.2, ease: "easeInOut", duration:1.5}}>Sliding puzzle</motion.h1>
                        <motion.p variants={textVariants}
                        transition={{delay: 0.7, ease: "easeInOut", duration: 1}}>Created by Kajsa  </motion.p>
                    </motion.div>
                {/* )} */}
            </AnimatePresence>
        </motion.div>
    )
}

export default Intro
