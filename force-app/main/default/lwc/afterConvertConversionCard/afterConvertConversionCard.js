import { LightningElement,wire,track,api } from 'lwc';
import getAcountRecord from '@salesforce/apex/ConvertRecord.getAcountRecord';
import getAccounts from '@salesforce/apex/AccountSearchController.getAccounts';
import getContacts from '@salesforce/apex/ContactSearchController.getContactList';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getSourceObjInfo from '@salesforce/apex/SearchController.getSourceObjInfo';
import insertAccContOpp from '@salesforce/apex/SearchController.insertAccContOpp';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Convertsource1 extends LightningElement {
    @api objectApiName;   //value is fetched from aura component
    @api recordId;
    @track mainhead=true;
    @track activeSections="A";
    @track secAfield=false;
    @track secBfield=true;
    @track showSearchedValues=true;
    @track secAfieldcopy=false;
    @track secCfield=true;
    //@track accountname="";
    //deafultAccName = "";
    @track existAcc=false;
    @track newAcc=true;
    @track existCon=false;
    @track newCon=true;
    @track OpenSections="";
    showAccSearchBar = true;
    showConSearchBar = true;
    defaultAccValue;
    defaultContValue;
    selectedAccId;
    selectedConId;
    accountName = '';
    deafaultAccName = '';
    contactName = '';
    deafultContName = '';
    destinationName = '';
    rec = [];
    hide =true;;
    isModalOpen = false;
    objectLabel = '';

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo({ data, error }) {
        if (data) {
            console.log('data :::', data);
            console.log('apiName'+this.objectApiName);
            this.objectLabel = data.label;
            getSourceObjInfo({ objectName: this.objectApiName, recordId: this.recordId })
                .then(result => {
                    console.log('result of source object:::', result);
                    if (result) {
                        let parsedResult = JSON.parse(result);
                        this.accountName = parsedResult.accountName;
                        this.contactName = parsedResult.contactName;
                        this.destinationName = parsedResult.destinationName;
                    }
                })
                .catch(error => {
                    console.log('error in source object:::', error);
                });
        } else if (error) {
            console.log('error :::', error);
        }
    }


    firstsection(){
        this.activeSections="A";
        if(this.activeSections ==="A" && this.OpenSections.length !== 0){
            this.secAfield=false;
            this.secBfield=true;
        }else{
                this.secAfield=true;
            }
    }
    secondsection(){
        this.activeSections="B";
        if(this.activeSections==="B" && this.OpenSections.length !== 0){
            this.secBfield=false
            this.secAfield=true;
        }else{
            this.secBfield=true;
        }
    }
    thirdsection(){
        this.activeSections="C";
        console.log("the value of active section",this.activeSections)
        if(this.activeSections=="C"){
            this.secBfield=true;
            this.secAfield=true;
        }
    
    }
       optionHandler(event){
        if(event.target.name == 'existAcc'){
            this.existAcc = true;
            this.newAcc = false;
            this.activeSections="A";
            this.secAfield=false;
            this.showAccSearchBar = true;
           
        }else if(event.target.name == 'newAcc'){
            this.existAcc = false;
            this.newAcc = true;
            this.showAccSearchBar = false;
           
        }else if(event.target.name == 'existCon'){
            this.existCon = true;
            this.newCon = false;
            this.activeSections="B";
            this.secAfield = true;
            this.showConSearchBar = true;
           if(this.existAcc ==true){
            //    let ExistAccount= this.template.querySelector('.existacc');
                if(! this.selectedAccId){
                 console.log("Please Fill The Existing Account Field");
                }else{
                    console.log("No error with exist account")
                }
               
                
            }
         
        }else if(event.target.name == 'newCon'){
            this.existCon = false;
            this.newCon = true;
            this.showConSearchBar = false;
          
        }
    }
    handleToggleSection(event){
        this.OpenSections = event.detail.openSections;
    }
    handleAccRecSelect(event) {
        console.log('selected record id from child component :::',  event.detail.Id);
        //console.log('eventDetail'+event.detail.id);
        this.defaultAccValue = event.detail.all;
        this.selectedAccId = event.detail.Id;
    }

    handleConRecSelect(event) {
        console.log('selected record id from child component :::', event.detail);
        this.defaultContValue = event.detail.all;
        this.selectedConId = event.detail.Id;
    }

    modalclose(event){
        const auramodalclose = new CustomEvent('closemodal')
        this.dispatchEvent(auramodalclose);
    }

    
    handleNewRecInput(event) {
        switch (event.target.name) {
            case 'accName':
                this.accountName = event.target.value;
                this.deafaultAccName = event.target.value;
                break;
            case 'conName':
                this.contactName = event.target.value;
                this.deafultContName = event.target.value;
                break;
            case 'desName':
                this.destinationName = event.target.value;
                break;
        }
        console.log('this.accountName :::', this.accountName);
        console.log('this.contactName :::', this.contactName);
        console.log('this.destinationName :::', this.destinationName);
    }


    onsubmit(){
        if(this.newAcc == true){
            let NewAccount = this.template.querySelector('.newacc');
            if(!NewAccount.value){
                NewAccount.setCustomValidity("Please Fill The New Account Field");
            }else{
                NewAccount.setCustomValidity("");
            }
            NewAccount.reportValidity();
        }else if(this.existAcc == true){
            if(! this.selectedAccId){
                alert("Please choose the existing account");
            }
        }
        
        if(this.newCon == true){
            let NewContact= this.template.querySelectorAll(".newcontact");
            NewContact.forEach(function(cons){
                if(!cons.value){
                    cons.setCustomValidity("Please Fill The New Contact Field");
                    console.log("Errorr of new contact")
                }else{
                    cons.setCustomValidity("");
                }
                cons.reportValidity();
            })
        }else if(this.existCon == true){
            if(!this.selectedConId){
                alert("Please Chooose The Existing Contact");
            }
        }
    }

    convertData() {
        console.log('accId'+this.selectedAccId);
        console.log('conId'+this.selectedConId);
        console.log('accName'+this.accountName);
        console.log('contName'+this.contactName);
        var accExist = this.showAccSearchBar ? this.selectedAccId : this.accountName;
        var contExist = this.showConSearchBar ? this.selectedConId : this.contactName;
        var opp = this.destinationName;

        var recData = {
            'Accounts': accExist,
            'Contacts': contExist,
            'opportunity': opp
        }

        console.log('rec'+JSON.stringify(recData));
        insertAccContOpp({conversionDataMap : recData,
                          currntRecordId : this.recordId,
                          objApiName : this.objectApiName})
        .then(result => {
            console.log('result'+result);
            this.message = result;
            this.error = undefined;
            console.log('msgg'+this.message);
            console.log('err'+this.error);
            if(this.message !== undefined) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Conversion Successful',
                        variant: 'success',
                    }),
                );
                //this.isModalOpen = true;
                //this.hide = false;
                /*const closeModalEvent = new CustomEvent('closemodal');
                this.dispatchEvent(closeModalEvent);*/
            }
           /* flag = true;
            const valueChangeEvent = new CustomEvent("valuechange", {
                detail: { flag }
              });
              // Fire the custom event
              this.dispatchEvent(valueChangeEvent);*/
            
            this.isModalOpen = true;
            this.mainhead=false;
            console.log('resultStringify',JSON.stringify(result));
            console.log("result", this.message);
        })
        .catch(error => {
            console.log('inside error');
            this.message = undefined;
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
            console.log("error", JSON.stringify(this.error));
        });

    }
    /*get accountOptions(){
        return [
                {label:'Create New',value:'newAcc'},
                {label:'Choose Existing',value:'existingAcc'}
            ];
    }
    get contactOptions(){
        return [
                {label:'Create New',value:'newCon'},
                {label:'Choose Existing',value:'existingCon'}
            ];
    }
    get destinationOptions(){
        return [
                {label:'Create New',value:'newDes'}
            ];
    }*/



/*    @track isdisabled=false;
    @track isdisabled2 = false;
    @track accountName = '';
    @track accountList = [];   
    @track accountId; 
    @track contactId;
    @track messageResult=false;
    @track showSearchedValues = false;   
    @track contactName ='';
    @track contactLists= [];  
    @track showSearchedValuesofcontact =false;
    @track showSearchedValues3=false;
    @track contactNameforpickup;
    @track accountNameforpickup;
    @track openpickup = false;
    @track closingorignalpickup = true;

    @wire(getAccounts, {actName:'$accountName'})
    retrieveAccounts ({error, data}){
       this.messageResult=false;
       console.log("account data",data);
       if (data) {
           if(data.length>0){
               this.accountList = data;                
               this.showSearchedValues = true; 
               this.messageResult=false;
           }            
           else if(data.length==0){
               this.accountList = [];                
               this.showSearchedValues = false;
               if(this.accountName!='')
                   this.messageResult=true;               
           }  
               
       } else if (error) {
           // TODO: Data handling
           this.accountId =  '';
           this.accountName =  '';
           this.accountList=[];           
           this.showSearchedValues= false;
           this.messageResult=true;   
       }
   }


    @wire(getContacts,{cntName:'$contactName'})
    wiredContacts({error,data}){
        console.log("This is contact data",data)
        if(data){
           if(data.length>0){
            this.contactLists = data;                
            this.showSearchedValuesofcontact = true; 
            this.messageResult=false;
           }
           else if(data.length==0){
                  this.contactLists =[];
                  this.showSearchedValuesofcontact=false;
                  if(this.contactName!=''){
                      this.messageResult = true;
                  }
           }
        }else if(error){
            this.contactId='';
            this.contactName =  '';
            this.contactLists=[];           
            this.showSearchedValuesofcontact= false;
            this.messageResult=true;  
        }
    }




  handleKeyChange(event){     
    console.log("This is first input data",event.target.value)   
    this.messageResult=false; 
    this.accountName = event.target.value;
  }  
  
  handleOnChangeContact(event){   
    console.log("This is contact event value" ,  event.target.value);
    this.messageResult=false; 
    this.contactName = event.target.value;
    
  }  
  
  falseinputhandler(event){
       this.isdisabled =true;
  }

  //  get options(){
  //      return[
  //          {label:"Existing Account",value:'opt1'},
  //          {label:"New Account",value:"opt2" },
  //      ]
  //  }

  trueinputhandler(event){
      this.isdisabled = false;
  }
  trueinputhandler2(event){
      this.isdisabled2 = false;
  }
  falseinputhandler2(event){
        this.isdisabled2=true;
   }
   fillvalueoninput(event){
       this.accountNameforpickup = event.target.dataset.label;
       this.showSearchedValues=false;
       this.messageResult=false;
       this.openpickup =true;
       this.closingorignalpickup=false;
       this.accountName="";
      
   }
   pickcontacts(event){
    this.contactNameforpickup = event.target.dataset.label;
    this.showSearchedValuesofcontact=false;
    this.messageResult=false;
}
closingpickup(event){
    this.openpickup = false;
    this.closingorignalpickup = true;
}
   modalclose(event){
       const auramodalclose = new CustomEvent('closemodal')
       this.dispatchEvent(auramodalclose);
   }

   */
}