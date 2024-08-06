import { useState } from 'react'
import AnimationFrameScroll from './components/AnimationFrameScroll'
const directions = ['top', 'bottom', 'left', 'right']

function App() {
  const [direction, setDirection] = useState('top')

  return (
    <div>
      {directions.map(direction => (
        <button key={direction} onClick={() => setDirection(direction)}>
          {direction}
        </button>
      ))}
      <AnimationFrameScroll
        scrollDirection={direction}
        // isHoverStop={false}
        style={{ maxHeight: 'calc(100vh - 80px)', maxWidth: '100vw' }}
        // style={{ width: 500, height: 500, marginTop: 24 }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              height: '50px',
              width: '80px',
              border: '1px solid black',
            }}
          >
            滚动元素{i}
          </div>
        ))}
      </AnimationFrameScroll>
    </div>
  )
}

export default App
