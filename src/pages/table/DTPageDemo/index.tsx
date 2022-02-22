import DynamicTable from '@/components/DynamicTable';
import React from 'react';

export default (): React.ReactNode => {
  return (
    <DynamicTable tableName="t_m_test"
                  options={{
                    // createAble: false,
                    // deleteAble: false,
                    // searchAble: false,
                    // importExcelAble: false
                  }}/>
  );
};
