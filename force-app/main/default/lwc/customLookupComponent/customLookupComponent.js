import { LightningElement,api } from 'lwc';
import findRecords from '@salesforce/apex/SearchController.findRecords';

export default class CustomLookupComponent extends LightningElement {
    records;
    error;
    @api selectedRecord;
    selectedRecordId;
    noRecFoundMsg = '';
    @api iconname;
    @api fieldName;
    @api objectName;
    displayoflookup=false;
    handleOnchange(event){
        event.preventDefault();
        console.log('searchkey value :::',event.detail.value, typeof event.detail.value);
        if(event.detail.value !== undefined && event.detail.value !== 'undefined' && event.detail.value){
            console.log('searchkey change handled1',event.detail.value);
            findRecords({
                searchKey:event.detail.value, 
                objectName:this.objectName,
                searchField:this.fieldName
            }).then(result =>{
                console.log('entry into then',result);
                console.log("user data",this.objectName)
                if(result.length>0){
                 if(this.objectName=="User"){
                   /*    var Recordcss= this.template.querySelector(".recordcss");
                       Recordcss.style.position="relative";
                         console.log("our css working",Recordcss);*/
                         this.displayoflookup=true;
                    }else{
                     /*  Recordcss.style.position="absolute";
                        console.log("our css not working",Recordcss);*/
                        this.displayoflookup=false;
                                        }
                    this.records = result;
                    this.noRecFoundMsg = '';
                    console.log('entry into if',this.records);
                }else if(result.length == 0){
                    this.records=result;
                    this.noRecFoundMsg = 'No Records Found';
                }
                this.error = undefined;
            }).catch(error =>{
                console.log('entry into catch',error);
                this.error = error;
                this.records=undefined;
            });
        }else if(event.detail.value === ''){
            console.log('searchkey is blank:::');
            this.records = undefined;
        }
    }
    handleSelect(event){
        this.selectedRecord = this.records.find(record =>record.Id === event.detail);
        this.selectedRecordId = event.detail;
        console.log('selectedRecord ->',this.selectedRecord,' ',this.selectedRecordId);
        const createEvent = new CustomEvent('recselect',{detail:{'all':this.selectedRecord, 'Id':this.selectedRecordId}});
        this.dispatchEvent(createEvent);
    }
    handleRemove(){
        this.selectedRecord = undefined;
        this.selectedRecordId = undefined;
        this.records= undefined;
        this.error = undefined;
    }
}