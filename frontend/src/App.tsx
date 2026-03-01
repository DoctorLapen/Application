import { useDispatch, useSelector } from "react-redux"
import { increment, decrement } from "./store/slices/counterSlice"
import type { RootState } from "./store/store"

function App() {
 
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white shadow-lg rounded-xl p-8 text-center space-y-4">

        <h1 className="text-3xl font-bold">
          Counter: {count}
        </h1>

        <div className="flex gap-4 justify-center">

          <button
            onClick={() => dispatch(increment())}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +
          </button>

          <button
            onClick={() => dispatch(decrement())}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -
          </button>

        </div>

      </div>

    </div>
  
  )
}

export default App
