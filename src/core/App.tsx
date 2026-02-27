import { useState } from 'react'
import reactLogo from '../assets/vite.svg'
import viteLogo from '../assets/react.svg'
import './App.css'
import BurButt from '../components/BurButt.tsx'
import BurList from '../components/BurList.tsx'
import CartButtons from '../components/CartButtons.tsx'

function App() {
  const [count, setCount] = useState(0)
  //const [isClicked, setIsClicked] = useState(false); //nah nah - doesn`t work, because  async state upd

  return (
    <>
      <div>
        <CartButtons />
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1 onClick={() => alert('Ну от нашо так тикати(')}>Vite + Bur</h1>
      <div className="card">
        <button onClick={() => {
          const isClicked = confirm("Точно бажаєте клікнути??!!!")
          //setIsClicked()
          if (isClicked) 
            setCount((count) => count + 1);
        }}>
          bur count is {count}
        </button>
        <BurButt />
        <p>
          Edit <code>BURRR</code> and save to test BUUUURRRR
        </p>
      </div>
      <BurList />
      <p className="read-the-docs">
        чомусь взагалі не воркає, і шо це за діла
      </p>
    </>
  )
}

export default App
