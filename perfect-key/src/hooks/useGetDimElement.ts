/* eslint-disable */
import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface DimElement {
    clientWidth: number,
    clientHeight: number
}

export default function useGetDimElement(): any {
    const refElement = useRef<HTMLDivElement>(null)
    const [dimElement, setDimElement] = useState<DimElement>({
        clientWidth: 0,
        clientHeight: 0
    })

    const updateDim = useCallback(() => {
            if (refElement.current) {
                const {clientWidth, clientHeight } = refElement.current
                if (clientHeight && clientWidth) {
                    setDimElement({clientWidth, clientHeight})
                }
            }
        },[],
    )
    useLayoutEffect(() => {
        updateDim()
    }, [updateDim])

    return {
        dimElement,
        refElement,
        updateDim
    }
}