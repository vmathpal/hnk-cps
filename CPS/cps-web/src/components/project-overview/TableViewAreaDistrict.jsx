import React from 'react'

const TableViewAreaDistrict = (props) => {
  return (
    <>
       <table className='classic stripped'>
            <tbody>
                <tr>
                    <th>Channel</th>
                    <th>Area</th>
                    <th>District</th>
                </tr>
               {props?.areaDistrict?.length?props?.areaDistrict?.map((product, index) => (
               <React.Fragment key={++index}>
               <tr>
               <td>{product?.Channel?.name}</td>
               <td>{product?.Arium?.name}</td>
               <td>{product?.District?.name}</td>

               </tr></React.Fragment>
              )):'No Data Found'}
            </tbody>
        </table>
    </>
  )
}

export default TableViewAreaDistrict