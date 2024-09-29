import React from 'react'

const NoData = ({message}) => {
  return (
    <div className='no-data'>
        {message ?? "There's no data available"}
    </div>
  )
}

export default NoData