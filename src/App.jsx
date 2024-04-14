import Board from "./Board.jsx"
import Intro from "./Intro.jsx"
import Menu from "./Menu.jsx"

function App() {

  return(
    <div className="app">
      <Intro/>
      <Menu/>
      <h1>React 15-puzzle</h1>
      <Board/>
    </div>
  )
}

export default App
