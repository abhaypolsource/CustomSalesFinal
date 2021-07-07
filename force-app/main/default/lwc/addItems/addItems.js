import { LightningElement, track, api } from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import getItems from '@salesforce/apex/AddItemsCtrl.getItems';
import updateItems from '@salesforce/apex/AddItemsCtrl.updateRecords';
import CreateDealItems from '@salesforce/apex/AddItemsCtrl.CreateDealItems';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddItems extends LightningElement {
    @api recordId;
    @track data
    @track error
    @track itemName
    @track selectedItem = 0
    @track showSave = false
    @track pagenumber
    @track firstPage
    @track secondPage
    @track thirdpage
    @track itemCode
    @track restateData 
    //@track saveDraftValues = [];
    @track title
    @track message
    @track variant
    
    @track saveDraftValues = [];
    @track selectedDate 
    @track recurl
    
    @track columns = [
        {label: 'Item name', fieldName: 'itemName', type: 'text', sortable: true },
        {label: 'Item Code', fieldName: 'itemCode', type: 'text', sortable: true},
        {label: 'Unit Price', fieldName: 'unitPrice', type: 'Decimal', sortable: true},
        {label: 'Item Description', fieldName: 'itemDescription', type: 'text', sortable: true},
        {label:'Item Family', fieldName:'itemFamily', type:'picklist', sortable: true} 
    ];

    /*@track selectedvalues = [
        {label: 'Item name', fieldName: 'itemName', type: 'text', sortable: true, required:true },        
       
        {label: 'Item Code', fieldName: 'itemCode', type: 'text', sortable: true,editable:true},
        {label: 'Unit Price', fieldName: 'unitPrice', type: 'Decimal', sortable: true, editable:true},
        
       
        {
            label: "Servicedate",
            fieldName: "DueDate",
            type: "date-local", editable :true ,
            typeAttributes:{
                month: "2-digit",
                day: "2-digit"
            }
        }, 
        
      
        {label: 'Item Description', fieldName: 'itemDescription', type: 'text', sortable: true },
        
        { 
            type: 'button-icon',
         typeAttributes:
            {
        iconName: 'utility:delete',
        name: 'delete',
        iconClass: 'slds-icon-text-error'
            }
        }
       
    ];*
    /*On initialization of component*/
    connectedCallback() {
        this.firstPage = true;
        getItems().then (result => {
            this.data = result;
        }).catch (error => {
            this.error = error;
        });
        this.SaveOrnext = 'Next';

       
        
    }
    /*Capture change in input*/
    handleNumberChange(event) {
        this.itemName = event.target.value;
    }
    /*get number of selected row count*/
    getSelectedName(event) {
        
        let selectedRow = event.detail.selectedRows;
        this.selectedItem = selectedRow.length;
        this.showSave = this.selectedItem;
        this.restateData = [];
        this.itemCode = []
        for (let i=0; i< selectedRow.length ; i++) {
            var obj = {
                itemCode : selectedRow[i].itemCode,
                itemDescription : selectedRow[i].itemDescription,
                unitPrice : selectedRow[i].unitPrice,
                itemName : selectedRow[i].itemName,
                ItemId: selectedRow[i].ItemId
            }
            this.itemCode.push (selectedRow[i].itemCode);
            this.restateData.push (obj);
        }

        this.restateData.forEach(function(item){
            item.Url = '/' + item.ItemId;
        }
        );
    }

    
    /*handle onclick of Next button*/
    handleNext() {
        this.firstPage = false;
        this.secondPage = true;
       
        
    }
    removeRow({target :{dataset:{id}}}) {
        this.restateData.splice(id,1);
    }

    handleBack(event){
    
        this.firstPage = true;
        this.secondPage = false;
       //this.data= this.restateData;;

    }

    handletext(event){
        let selectedtextvalue=event.target.value;
        let selectedTextvalueid=event.target.dataset.id;
        this.restateData[selectedTextvalueid].itemDescription=selectedtextvalue;
    }

    handledate(event){
        let selectedDatevalue=event.target.value;
        let selectedDatevalueid=event.target.dataset.id;
     
        console.log( 'testvalue'+selectedDatevalue);
       
       this.restateData[selectedDatevalueid].servicedate=selectedDatevalue;

        
    }
    handlecode(event){
        let selectedCodevalue=event.target.value;
        let selectedCodevalueid=event.target.dataset.id;
        this.restateData[selectedCodevalueid].itemCode=selectedCodevalue;

    }
    handleprice(event){
        let selectedPricevalue=event.target.value;
        let selectedPricevalueid=event.target.dataset.id;
        this.restateData[selectedPricevalueid].unitPrice=selectedPricevalue;

    }
    handleSave(event) {
           
      let itemcodecmp = this.template.querySelectorAll(".itemvalue");
      let upricecmp = this.template.querySelectorAll(".uprice");
     
      
      for(let i=0;i<itemcodecmp.length;i++){
        if(!itemcodecmp[i].value){
            itemcodecmp[i].setCustomValidity("Complete This Field");
        }else {
            itemcodecmp[i].setCustomValidity(""); // clear previous value
           }
           itemcodecmp[i].reportValidity();
        }


        for(let i=0;i<upricecmp.length;i++){
            if(!upricecmp[i].value){
                upricecmp[i].setCustomValidity("Complete This Field");
            }else {
                upricecmp[i].setCustomValidity(""); // clear previous value
               }
               upricecmp[i].reportValidity();
            }

       // var selectedlistvalues=JSON.stringify(this.restateData);
        console.log(JSON.stringify(this.restateData));        
           
        CreateDealItems({recordId:this.recordId, datavalue :this.restateData}).then(result => {
            const evt = new ShowToastEvent({
                title: 'SUCESSFULL UPDATE',
                message: 'Your records has been updated successfully',
                variant: 'success',
            });
            this.dispatchEvent(evt);

            this.closeAction();
        }).catch (error => {
            const evt = new ShowToastEvent({
                title: 'ERROR IN UPDATE',
                message: 'Error Occured',
                variant: 'error',
            });
        });
  

        /*updateItems({unitCode : this.itemCode, recordId : this.recordId}).then(result => {
            const evt = new ShowToastEvent({
                title: 'SUCESSFULL UPDATE',
                message: 'Your records has been updated successfully',
                variant: 'success',
            });
            this.dispatchEvent(evt);

            this.closeAction();
        
            
        }).catch (error => {
            const evt = new ShowToastEvent({
                title: 'ERROR IN UPDATE',
                message: 'Error Occured',
                variant: 'error',
            });
        });*/
    }
   /* handleRowAction(event) {
    
    this.restateData=this.restateData.splice(this.restateData.findIndex(row => row.Id === event.detail.row.id), 1);
      
        
    }*/
    /*handleSave(event) {
        this.saveDraftValues = event.detail.draftValues;
        console.log('--'+ event.detail.draftValues);
    }*/

    /*handle onclick of close button*/
    closeAction(){
        this.dispatchEvent(new CloseActionScreenEvent());
        

    }


}