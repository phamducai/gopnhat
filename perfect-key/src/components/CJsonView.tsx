import React from 'react';

export interface IClassBox extends Props {
    title?: string,
}

const CJsonView = (props:Props): JSX.Element => {
    //eslint-disable-next-line
    const getJsonIndented = (obj:any) => JSON.stringify(obj, null, 4).replace(/["{[,\}\]]/g, "")
    return (
        <pre style={{height:"50vh"}}>{getJsonIndented(props.children)}</pre>
    )
};

export default React.memo(CJsonView);