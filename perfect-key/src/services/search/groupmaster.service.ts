import { ISearchResult } from 'common/model-booking';
class GroupMasterService{
    static converComment(selectedRows: ISearchResult, isSetGroupMaster: boolean) : string{
        let newComment = "";
        if(isSetGroupMaster){
            newComment = "master," + (selectedRows.comments.name === null ? " " : selectedRows.comments.name);
        }
        if(selectedRows.comments.name !== null && !isSetGroupMaster){
            newComment = selectedRows.comments.name.replace("master,","");
        }
        return newComment;
    }
}
export default GroupMasterService;