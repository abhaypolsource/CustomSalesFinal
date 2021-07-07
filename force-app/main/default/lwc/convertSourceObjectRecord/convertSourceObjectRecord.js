import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getSourceObjInfo from '@salesforce/apex/SearchController.getSourceObjInfo';
import insertAccContOpp from '@salesforce/apex/SearchController.insertAccContOpp';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class ConvertSourceObjectRecord extends NavigationMixin(LightningElement) {
    @api objectApiName;   //value is fetched from aura component
    @api recordId;        //value is fetched from aura component  
    rec = [];
    hide =true;;
    defaultAccValue;
    defaultContValue;
    newAcc = false;
    isModalOpen = false;
    existAcc = true;
    newCon = false;
    existCon = true;
    showAccSearchBar = true;
    showConSearchBar = true;
    accountName = '';
    contactName = '';
    destinationName = '';
    objectLabel = '';
    selectedAccId;
    selectedConId;
    URL;
    URL = 'https://salesprocess2-dev-ed.lightning.force.com/lightning/n/Conversion_Mapping';

    //accValue='newAcc';
    //conValue='newCon';
    //desValue = 'newDes';

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

    optionHandler(event) {
        console.log('showAccSearchBar'+ this.showAccSearchBar);
        if (event.target.name == 'existAcc') {
            this.existAcc = true;
            this.newAcc = false;
            this.showAccSearchBar = true;
         } else if (event.target.name == 'newAcc') {
            this.existAcc = false;
            this.newAcc = true;
            this.showAccSearchBar = false;
        } else if (event.target.name == 'existCon') {
            this.existCon = true;
            this.newCon = false;
            this.showConSearchBar = true;
        } else if (event.target.name == 'newCon') {
            this.existCon = false;
            this.newCon = true;
            this.showConSearchBar = false;
        }

        /*if(event.target.name == 'accRadioGroup'){
            this.showAccSearchBar = event.target.value == 'existingAcc' ? true : false;
            this.accValue = event.target.value;
        }else if(event.target.name == 'conRadioGroup'){
            this.showConSearchBar = event.target.value == 'existingCon' ? true : false;
            this.conValue = event.target.value;
        }*/
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

    closeModal() {
        const closeModalEvent = new CustomEvent('closemodal');
        this.dispatchEvent(closeModalEvent);
    }

    handleNewRecInput(event) {
        switch (event.target.name) {
            case 'accName':
                this.accountName = event.target.value;
                break;
            case 'conName':
                this.contactName = event.target.value;
                break;
            case 'desName':
                this.destinationName = event.target.value;
                break;
        }
        console.log('this.accountName :::', this.accountName);
        console.log('this.contactName :::', this.contactName);
        console.log('this.destinationName :::', this.destinationName);
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

    @api tabName;
    @api label;
    label = 'Next Link';
    navigateNext() {
        console.log('inside tab00');
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Conversion_Mapping',
            }
        });
    }

    navigateToListView() {
        // Navigate to the Contact object's Recent list view.
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Prospect__c',
                actionName: 'list'
            },
            state: {
                // 'filterName' is a property on the page 'state'
                // and identifies the target list view.
                // It may also be an 18 character list view id.
                filterName: 'Recent' // or by 18 char '00BT0000002TONQMA4'
            }
        });
    }

    navigateToRecordViewPage() {
        // View a custom object record.
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '0015g00000ByyFmAAJ',
                objectApiName: 'account', // objectApiName is optional
                actionName: 'view'
            }
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

}