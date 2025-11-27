import React from 'react'

const authLayout = ({children}: {children:React.ReactNode}) => {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>{children}</div>
  )
}

export default authLayout