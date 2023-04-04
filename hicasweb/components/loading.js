import React from "react"

const LoadingComponent = ({ children, visible, ...props }) => {
  if (!children && !visible) {
    return null
  }
  return (
    <div {...props} className={`full ${props.className ?? ""}`}>
      {visible ? (
        <div
          className={`loading absolute inset-0 m-auto flex flex-row justify-center items-center text-center pointer-events-auto`}
        >
          <div className={`animationDelay1`} />
          <div className={`animationDelay2`} />
          <div className={`animationDelay3`} />
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}
export default LoadingComponent
