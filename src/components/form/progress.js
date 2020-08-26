import React from "react"

const ProgressBar = ({value, max}) => {
  const steps = Array(max).fill(1).map((x, y) => x + y);
  return (
    <div className="progress-bar-segmented" role="progressbar"
      aria-valuenow={value} aria-valuemin="0" aria-valuemax={max} tabIndex="0">
      { steps.map((step) => (
        <div
          key={step}
          className={`progress-segment ${
            value >= step ? 'progress-segment-complete' : ''
          }`}
        />
      ))}
    </div>
  )
}

export default ProgressBar
