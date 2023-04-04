/* eslint-disable */
import { Dictionary } from "@reduxjs/toolkit";
import { SearchResultsTreeTables, SEARCH_RESULTS_DEFAULT } from "common/search/TableSearchResults";
import { cloneDeep, groupBy } from "lodash"
import { GroupTag } from "pages/main/booking/searchResults/TableSearchResults"


class GroupByViewer{
    static convertToGroupedData = (data: SearchResultsTreeTables[], column: any, groupedHeaderTable: GroupTag[]) => {
        console.log(data)
        let result: any;
        return GroupByViewer.groupingData(data, column, groupedHeaderTable, result);
    }

    static groupingData = (data: any, column: any, groupedHeaderTable: GroupTag[], result: any): SearchResultsTreeTables[] | undefined | null => {
        // console.log(data)
        // let results = cloneDeep(data);
        // let tmp;
        const groupData = cloneDeep(data);
        const results: Dictionary<any> = {};
        const converter: SearchResultsTreeTables = cloneDeep(SEARCH_RESULTS_DEFAULT)
        if(groupedHeaderTable.length > 0){
            results['results'] = groupBy(groupData, x => x[column[groupedHeaderTable[0].index].dataIndex]?.props?.children)
            console.log(column)
            converter.children && GroupByViewer.realGroup(column, groupedHeaderTable, results['results'], 1, converter.children, "");
            console.log('Res:')
            console.log(results)
            console.log('Converter')
            console.log(converter)
        }
        //let tmp: any = results.results;
        // while(!Array.isArray(tmp)){
        //     for(const key in tmp){

        //     }
        // }
        return converter.children;
        // groupedHeaderTable.forEach(item => {
        //     groupData = groupBy(groupData, x => x[column[item.index].dataIndex]?.props?.children)
        //     results['results'] = groupData;
        //     for(const key in groupData){
        //         groupData[key]
        //     }
        // })
    }

    static realGroup = (column: any, groupedHeaderTable: GroupTag[], result: any, index: number, converter: SearchResultsTreeTables[], privateKey: string) => {
        // console.log(data)
        // let results = cloneDeep(data);
        // let tmp;
        if(index < groupedHeaderTable.length){
            let i = 1
            for(const key in result){
                const tmp = cloneDeep(SEARCH_RESULTS_DEFAULT)
                const mainKey = privateKey + key
                tmp.key = mainKey
                tmp.fullName = key
                result[key] = tmp.children && GroupByViewer.realGroup(column, groupedHeaderTable, groupBy(result[key], x => x[column[groupedHeaderTable[index].index].dataIndex]?.props?.children), index+1, tmp.children, mainKey);
                converter.push(tmp)
                i++;
            }
        }
        if(index === groupedHeaderTable.length){
            for(const key in result){
                const tmp = cloneDeep(SEARCH_RESULTS_DEFAULT)
                const mainKey = privateKey + key
                tmp.key = mainKey
                tmp.fullName = key
                tmp.children = result[key].map((item: SearchResultsTreeTables, index: number) => {
                    return {
                        ...item,
                        key: mainKey + index.toString()
                    }
                })
                converter.push(tmp);
            }
            //converter.push(cloneDeep(result))
        }
        return result;
        // else{
        //     return groupBy(result, x => x[column[groupedHeaderTable[index].index].dataIndex]?.props?.children)
        // }
    }

    // static convertToTableData = (groupedData: any, res: SearchResultsTreeTables) => {
    //     const tmp = cloneDeep(SEARCH_RESULTS_DEFAULT);
    //     for(const key in groupedData){
    //         GroupByViewer.convertToTableData(groupedData[key]);
    //     }
    //     return res;
    // }
}

export default GroupByViewer