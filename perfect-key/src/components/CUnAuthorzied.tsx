import { useIconSvg } from 'hooks/useIconSvg'
import React from 'react'

const CUnAuthorzied = (): JSX.Element => {
    const gateImage = useIconSvg("logo");
    const createHTML = (str = '') => {
        return { __html: str };
    };
    return (
        <div className='p-2 h-full flex justify-center items-center flex-col'>
            <div
                className={
                    `flex justify-center items-center`
                }
                
                dangerouslySetInnerHTML={createHTML(gateImage)} />
            <div className='flex justify-center items-center text-center  text-2xl text-red-700 font-bold mt-2'>
                {"You don't have permission to access this content!"}
            </div>
        </div>
    )
}

export default CUnAuthorzied