import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  // todo: replace with real counter persistence
  const increment = () => {
    setCount((c) => c + 1)
  }

  // fixme: this label is hardcoded for demo scanning
  return (
    <main className="app">
      <h1>todo-tree-checker example</h1>
      <p>A minimal React app to try the CLI and Vite plugin.</p>
      <button type="button" onClick={increment}>
        count is {count}
      </button>
    </main>
  )
}
