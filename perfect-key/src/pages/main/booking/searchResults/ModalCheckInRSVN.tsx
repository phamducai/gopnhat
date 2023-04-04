import React from "react"
import CModel from "components/CModal"


const ModalCheckInRSVN = () : JSX.Element => {
    return (
        <CModel 
            title="Reinstate Reservations"
            visible={true}
            width={"80%"}
            zIndex={1}
            onOk={() => 1}
            onCancel={() => 1}
            content={
                // renderMenu()
                <div></div>
            }
        />
    )
}

export default ModalCheckInRSVN