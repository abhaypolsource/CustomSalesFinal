import { LightningElement, api, track, wire } from 'lwc';
import getAcountRecord from '@salesforce/apex/ConvertRecord.getAcountRecord';
import getContactRecord from '@salesforce/apex/ConvertRecord.getContactRecord';

let i = 0;

export default class ConvertSourceRecord extends LightningElement {




    options = [
        { 'label': 'Create New', 'value': 'option1' },
        { 'label': 'Choose Existing', 'value': 'option2' }
    ];

    account;
    contact;
    destinationObject;

    @api sourceObjectApiName;
    @api recordId;
    @track currenObjectName;

    @api existingAccount;
    @api existingContact;
    @track companyName;
    get existingAccountRecords() {
        var returnOptions = [];
        if (this.existingAccounts.data) {
            this.existingAccounts.data.forEach(element => {
                returnOptions.push({ label: element.Name, value: element.id });
            });
        }
        console.log(JSON.stringify(returnOptions));
       
        return returnOptions;

    }
    get companyNameMethod() {
        var returnOptions;
        if (this.existingAccounts.data) {
            this.existingAccounts.data.forEach(element => {
                returnOptions= element.Name;
            });
        }
        console.log(JSON.stringify(returnOptions));
       
        return returnOptions;
        
    }

    @wire(getAcountRecord, { recordId: '$recordId', sourceObjectApiName: '$sourceObjectApiName' })
    existingAccounts



    get existingContactRecords() {
        var returnOptions = [];
        if (this.existingContacts.data) {
            this.existingContacts.data.forEach(element => {
                returnOptions.push({ label: elelemente.Name, value: element.id });
            });
        }
        console.log(JSON.stringify(returnOptions));
        return returnOptions;

    }

    @wire(getContactRecord, { recordId: '$recordId', sourceObjectApiName: '$sourceObjectApiName' })
    existingContacts



    /*
    ({ data, error }) {
    if (data) {
        for (i = 0; i < data.length; i++) {
            console.log('id=' + data[i].Id, 'name=' + data[i].Name);
            this.existingAccountRecords = [...this.existingAccountRecords, { value: data[i].Id, label: data[i].Name }];
        }
        //this.existingAccountRecords = JSON.parse(data);
    } else if (error) {
        window.console.log('Error in wiredValues');
        window.console.log(error);
        this.existingAccountRecords = undefined;
    }
};
*/





}