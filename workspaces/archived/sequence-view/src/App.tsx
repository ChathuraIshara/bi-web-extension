import { useState } from 'react'
import { SequenceView } from ".."

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SequenceView></SequenceView>
    </>
  )
}

export default App
