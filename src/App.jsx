import Board from "./components/Board.jsx"
import Intro from "./components/Intro.jsx"

function App() {

  return(
    <div className="app">
      <Intro/>
      <h1>React 15-puzzle</h1>
      <Board/>
    </div>
  )
}

export default App
