import { ISearchResult } from "common/model-booking";
import React from 'react';

export interface PropsAddShared {
    isVisbleAddShared: boolean;
    setIsVisbleAddShared: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRows: ISearchResult[];
    isApplyGroup: boolean;
}