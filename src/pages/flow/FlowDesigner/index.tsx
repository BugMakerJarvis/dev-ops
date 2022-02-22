import styles from './index.less';
import Bpmn from '@/components/Bpmn';
import React from 'react';
import {useHistory} from "umi";
// import BpmnDesigner from "@/components/BpmnDesigner";

export default (): React.ReactNode => {

  const history = useHistory();
  const search = history.location.search;
  let deployId = null;
  if (search) {
    deployId = search.substring(1).split("=")[1];
  }

  return (
    <div className={styles.title}>
      <Bpmn deployId={deployId}/>
    </div>
  );
};

// export default (): React.ReactNode => {
//   return (
//     <div>
//       <BpmnDesigner/>
//     </div>
//   )
// }
