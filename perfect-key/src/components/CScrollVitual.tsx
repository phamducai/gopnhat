/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList as ListWindow, ListChildComponentProps, ListItemKeySelector } from 'react-window';
import { createStyles, ThemeDefine, useStyleTheme } from 'theme';

interface ScrollListType extends Props {
    dataSource: any[];
    sizeItem: number;
    itemKey?: ListItemKeySelector;
    marginTop?: number;
    itemRender: React.FunctionComponent<any>;
}

function ItemHOC (Comp: React.FunctionComponent, marginTop: number): React.FunctionComponent<ListChildComponentProps> {
    const HOC = ({ data, index, style }: ListChildComponentProps): JSX.Element => (
        <div style={style}>
            <Comp {...data[index]} />
        </div>
    );
    return HOC;
}

const rootStyles = createStyles((theme: ThemeDefine) => ({
    root: {
        backgroundColor: theme.palette.background,
        overflow: 'hidden !important',
        '&:hover': {
            overflow: 'overlay !important',
        }
    },
}));

const ScrollList = ({dataSource, itemRender, sizeItem, itemKey, marginTop = 8}: ScrollListType, ref: any): JSX.Element => {
    const classes = useStyleTheme(rootStyles);
    const [dimScrollList, updateDimScrollList] = useState<{width: number, height: number}>({
        width: 0,
        height: 0
    });
    const refContainer = useRef<HTMLElement>();
    
    useEffect(() => {
        if (refContainer?.current) {
            const elementBouding = refContainer.current.parentNode?.parentNode as HTMLElement;
            if (elementBouding) {
                updateDimScrollList({width: elementBouding.clientWidth, height: elementBouding.clientHeight - 3});
            }
        }
    }, [refContainer]);

    return (
        <ListWindow 
            className={`${classes.root} custom-scrollbar`}
            ref={ref}
            innerRef={refContainer} 
            itemCount={dataSource.length} 
            itemSize={sizeItem + marginTop} 
            height={dimScrollList.height} 
            width={dimScrollList.width} 
            itemKey={itemKey}
            itemData={dataSource}>
            {ItemHOC(itemRender, marginTop)}
        </ListWindow>
    )
};

const CScrollVirtual = React.forwardRef<ListWindow, ScrollListType>(ScrollList);
export default CScrollVirtual;