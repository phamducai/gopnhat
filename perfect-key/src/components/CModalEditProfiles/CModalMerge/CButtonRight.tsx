/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useStyleTheme } from 'theme';
import { editProfilesStyle } from '../styles/editProfiles'

interface CButtonRightProps {
    children: JSX.Element,
    handleHistory(check: boolean): void
    handleHistoryYear(): void
    handleOpenProfile(): void
    handleMerge(): void,
    selectedRow: any,
    checkGuest: boolean
}

const CButtonRight = (props: CButtonRightProps): JSX.Element => {
    const { children, handleHistory, handleHistoryYear, handleOpenProfile, handleMerge, selectedRow, checkGuest } = props
    const classes = useStyleTheme(editProfilesStyle);

    const disableGuestSelection = () =>  {
        if(checkGuest && selectedRow.length > 0){
            return true
        }else if(!checkGuest) 
            return true
        else 
            return false
    }
    
    return (
        <div className=" col-span-3">
            <div
                onClick={() => handleHistory(false)}
                className={`${classes.bigButton} px-10 rounded mx-2 text-base font-semibold cursor-pointer flex justify-center`}>
                History
            </div>
            <div
                onClick={handleHistoryYear}
                className={`${classes.bigButton} px-10 rounded mx-2 text-base font-semibold cursor-pointer flex justify-center`}>
                History Year
            </div>
            {children}
            <div
                onClick={handleOpenProfile}
                className={`${classes.smallButton} px-5 rounded mx-2 text-base cursor-pointer flex justify-center`}>
                Profile
            </div>
            <div className={`${classes.smallButton} px-5 rounded mx-2 text-base flex justify-center opacity-50`}>
                Folio
            </div>
            <button
                onClick={handleMerge}
                disabled={disableGuestSelection() ? false : true}
                className={`${classes.smallButton} px-5 rounded mx-2 text-base cursor-pointer flex justify-center ${disableGuestSelection() ? "" : "opacity-50"}`}>
                Merge
            </button>
        </div>
    );
}

export default CButtonRight;