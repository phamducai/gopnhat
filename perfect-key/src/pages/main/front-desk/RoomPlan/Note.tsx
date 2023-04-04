import React from 'react'

interface NoteProps {
    short: string,
    info: string
}
const Note = (props: NoteProps) => {
    return (
        <div>{props.short}: <strong>{props.info}</strong></div>
    )
}

export default React.memo(Note);