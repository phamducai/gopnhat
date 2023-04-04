import React from 'react'
import Modal from './CModal'

interface ModalRangePickerProps {
    isVisible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    handleOk(): void,
    title: string,
    children: React.ReactNode,
    isLoading: boolean
}
const ModalRangePicker = ({ isVisible, setVisible, handleOk, title, children, isLoading }: ModalRangePickerProps): JSX.Element => {
    return (
        <Modal
            title={title}
            isLoading={isLoading}
            visible={isVisible}
            onOk={handleOk}
            onCancel={() => setVisible(false)}
            content={<>{children}</>}
        />
    )
}

export default ModalRangePicker