import { ISearchResult } from "common/model-booking";
import React from 'react';

export interface PropsReinstateRSVN{
    data: ISearchResult[],
    setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>
}