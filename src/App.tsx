import { Suspense } from "react"
import { Loader } from "./components/loader"

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Loader />
      </Suspense>
    </div>
  )
}

export default App
