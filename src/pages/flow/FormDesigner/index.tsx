import React, {useRef} from 'react'
// @ts-ignore
import {DesignForm, DesignFormRef} from 'react-form-create'
import 'antd/dist/antd.css'
import 'react-form-create/dist/style.css'

export default (): React.ReactNode => {
  const ref = useRef<DesignFormRef>(null)

  console.log(ref);

  return (
    <div style={{height: 1000}}>
      <DesignForm ref={ref}/>
    </div>
  )
}
