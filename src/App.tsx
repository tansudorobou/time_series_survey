import { Suspense } from "react"
import { TypeLoader } from "./components/view/loader"

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <TypeLoader />
      </Suspense>
    </div>
  )
}

export default App
