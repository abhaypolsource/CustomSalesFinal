import { LightningElement, wire, track, api } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent'

//Import list of Sobjects from apex method
import getObjects from "@salesforce/apex/ConversionMappingController.getObjects";

//Import source, acccount, contact and selected third destination object fields
import getFields from "@salesforce/apex/ConversionMappingController.getFields";

//Import save method to store mapping
import onSave from "@salesforce/apex/ConversionMappingController.onSave";

export default class ObjectMaping extends LightningElement {

    @track sourceObject;
    @track compatibleDataTypeObject;
    @track destinationObject;
    @track destinationObjectLabel;
    @track sourceObjectLabel;
    @api objects = [];
    @api fields = [];
    @track childObjectMapping = [];
    @api relatedObjects = [];
    @track isShowObjects = false;
    @track isShowFields = false;
    @track isShowRelatedObjects = false;
    @track error;
    @track isSpinnerDisplay;
    @track objectMapping = {
        sourceObjectLabel : '',
        sourceObjectApiName : '',
        destinationObjectLabel : '',
        destinationObjectApiName : ''
    }
    @track fieldMapping = [];

    @wire(getObjects)
    wiredObjects({error, data}){
        this.isSpinnerDisplay = true;
        if(data){
            this.isSpinnerDisplay = false;
            this.objects = data.objectDetailsInfo;
            
            if(data.mappedObjectDetails){
                this.sourceObject = data.mappedObjectDetails.sourceObjectApiName;
                this.sourceObjectLabel = data.mappedObjectDetails.sourceObjectLabel;
                this.destinationObject = data.mappedObjectDetails.destinationObjectApiName;
                this.destinationObjectLabel = data.mappedObjectDetails.destinationObjectLabel;
            }
            
            this.isShowObjects = true;
            if(this.sourceObject && this.destinationObject)
                    this.describeFields();
        }else if(error){ 
            this.isSpinnerDisplay = false;
            this.error = error;
        }
    }

    handleSourceObjectChange(event) {

        this.sourceObject = event.detail.selectedValue;
        this.sourceObjectLabel = event.detail.selectedLabel;
        if(this.sourceObject && this.destinationObject)
            this.describeFields();
    }

    handleDestinationObjectChange(event) {
        this.destinationObject = event.detail.selectedValue;
        this.destinationObjectLabel = event.detail.selectedLabel;
        if(this.sourceObject && this.destinationObject)
            this.describeFields();
    }

    describeFields(){
        this.isSpinnerDisplay = true;
        this.isShowFields = false;
        this.isShowRelatedObjects = false;
        if(this.sourceObject == this.destinationObject){
            this.isSpinnerDisplay = false;
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Please select different Source and Destination Objects.',
                variant:'error'
            });
            this.dispatchEvent(event);
        }else{
            getFields({sourceObject : this.sourceObject, destinationObject : this.destinationObject, isReset: false})
            .then(result => {
                this.error = undefined;

                this.fields = result.fieldWrappers;
                this.compatibleDataTypeObject = result.compatibleDataType;
                this.relatedObjects = result.childObjectsList;
                if(result.childObjectsList && result.childObjectsList.length>0){
                    this.isShowRelatedObjects = true;
                }
                this.isShowFields = true;
                this.isSpinnerDisplay = false;
            })
            .catch(error => {
                this.error = error;
                this.isShowFields = false;
                this.isSpinnerDisplay = false;
            })
        }
    }


    handleAccountChildObjectSelect(event){
        var index;
        
        if(this.childObjectMapping){

            for(let i=0; i<this.childObjectMapping.length; i++){
                if(this.childObjectMapping[i].sourceFieldApiName == this.relatedObjects[event.target.value].value){
                    index = i;
                    //break;
                }
            }
        }
        
        if(index >= 0){
            this.childObjectMapping[index].accountCheckBoxSelect = !this.relatedObjects[event.target.value].isAccountChecked;
        }else{
            
            
            const detail = {sourceFieldLabel : this.relatedObjects[event.target.value].label, 
                            sourceFieldApiName : this.relatedObjects[event.target.value].value,  
                            accountCheckBoxSelect : !this.relatedObjects[event.target.value].isAccountChecked,
                            contactCheckBoxSelect : this.relatedObjects[event.target.value].isContactChecked,
                            destinationCheckBoxSelect : this.relatedObjects[event.target.value].isDestinationChecked,
                            accountReferenceFields : this.relatedObjects[event.target.value].accountReferenceFields,
                            contactReferenceFields : this.relatedObjects[event.target.value].contactReferenceFields,
                            destinationReferenceFields : this.relatedObjects[event.target.value].destinationReferenceFields};
            
            this.childObjectMapping.push(detail);
        }
    }

    handleContactChildObjectSelect(event){
        var index;
        
        
        if(this.childObjectMapping){

            for(let i=0; i<this.childObjectMapping.length; i++){
                if(this.childObjectMapping[i].sourceFieldApiName == this.relatedObjects[event.target.value].value){
                    index = i;
                    //break;
                }
            }
        }
        
        if(index >= 0){
            this.childObjectMapping[index].contactCheckBoxSelect = !this.relatedObjects[event.target.value].isContactChecked;
        }else{
            
            
            const detail = {sourceFieldLabel : this.relatedObjects[event.target.value].label, 
                            sourceFieldApiName : this.relatedObjects[event.target.value].value,  
                            accountCheckBoxSelect : this.relatedObjects[event.target.value].isAccountChecked,
                            contactCheckBoxSelect : !this.relatedObjects[event.target.value].isContactChecked,
                            destinationCheckBoxSelect : this.relatedObjects[event.target.value].isDestinationChecked,
                            accountReferenceFields : this.relatedObjects[event.target.value].accountReferenceFields,
                            contactReferenceFields : this.relatedObjects[event.target.value].contactReferenceFields,
                            destinationReferenceFields : this.relatedObjects[event.target.value].destinationReferenceFields};
            
            this.childObjectMapping.push(detail);
        }
    }

    handleDestinationChildObjectSelect(event){
        var index;
        
        
        if(this.childObjectMapping){

            for(let i=0; i<this.childObjectMapping.length; i++){
                if(this.childObjectMapping[i].sourceFieldApiName == this.relatedObjects[event.target.value].value){
                    index = i;
                    //break;
                }
            }
        }
        
        if(index >= 0){
            this.childObjectMapping[index].destinationCheckBoxSelect = !this.relatedObjects[event.target.value].isDestinationChecked;
        }else{
            
            
            const detail = {sourceFieldLabel : this.relatedObjects[event.target.value].label, 
                            sourceFieldApiName : this.relatedObjects[event.target.value].value,  
                            accountCheckBoxSelect : this.relatedObjects[event.target.value].isAccountChecked,
                            contactCheckBoxSelect : this.relatedObjects[event.target.value].isContactChecked,
                            destinationCheckBoxSelect : !this.relatedObjects[event.target.value].isDestinationChecked,
                            accountReferenceFields : this.relatedObjects[event.target.value].accountReferenceFields,
                            contactReferenceFields : this.relatedObjects[event.target.value].contactReferenceFields,
                            destinationReferenceFields : this.relatedObjects[event.target.value].destinationReferenceFields};
            
            this.childObjectMapping.push(detail);
        }
    }

    handleAccountFieldSelect(event){
        
        var index;
        var alreadyMapped = false;
        if(this.fieldMapping){

            for(let i=0; i<this.fieldMapping.length; i++){
                if(this.fieldMapping[i].sourceFieldApiName == this.fields[event.detail.selectedIndex].sourceFieldApiName){
                    index = i;
                    //break;
                }
                /*if(this.fieldMapping[i].accountFieldApiName == event.detail.selectedValue){
                    alreadyMapped = true;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'This field is already mapped please select another field.',
                        variant:'error'
                    });
                    this.dispatchEvent(event);
                }*/
            }
        }
        //if(!alreadyMapped){
            if(index >= 0){
                this.fieldMapping[index].accountFieldApiName = event.detail.selectedValue;
                this.fieldMapping[index].accountFieldLabel = event.detail.selectedLabel;
                this.template.querySelector("c-select-Combobox").changeFieldMapping(this.fieldMapping);
            }else{
                const detail = {sourceFieldLabel : this.fields[event.detail.selectedIndex].sourceFieldLabel, 
                                sourceFieldApiName : this.fields[event.detail.selectedIndex].sourceFieldApiName,  
                                accountFieldLabel : event.detail.selectedLabel,
                                accountFieldApiName : event.detail.selectedValue, 
                                contactFieldLabel : this.fields[event.detail.selectedIndex].selectedContactFieldLabel, 
                                contactFieldApiName : this.fields[event.detail.selectedIndex].selectedContactFieldApiName, 
                                destinationFieldLabel : this.fields[event.detail.selectedIndex].selectedDestinationFieldLabel, 
                                destinationFieldApiName : this.fields[event.detail.selectedIndex].selectedDestinationFieldApiName};
                this.fieldMapping.push(detail);
            }
        //}
    }

    handleContactFieldSelect(event){
        
        var index;
        if(this.fieldMapping){

            for(let i=0; i<this.fieldMapping.length; i++){
                
                if(this.fieldMapping[i].sourceFieldApiName == this.fields[event.detail.selectedIndex].sourceFieldApiName){
                    index = i;
                    //break;
                }
            }
        }
        if(index >= 0){
            this.fieldMapping[index].contactFieldApiName = event.detail.selectedValue;
            this.fieldMapping[index].contactFieldLabel = event.detail.selectedLabel;
            this.template.querySelector("c-select-Combobox").changeFieldMapping(this.fieldMapping);
        }else{
            const detail = {sourceFieldLabel : this.fields[event.detail.selectedIndex].sourceFieldLabel, 
                            sourceFieldApiName : this.fields[event.detail.selectedIndex].sourceFieldApiName,  
                            accountFieldLabel : this.fields[event.detail.selectedIndex].selectedAccountFieldLabel, 
                            accountFieldApiName : this.fields[event.detail.selectedIndex].selectedAccountFieldApiName, 
                            contactFieldLabel : event.detail.selectedLabel, 
                            contactFieldApiName : event.detail.selectedValue, 
                            destinationFieldLabel : this.fields[event.detail.selectedIndex].selectedDestinationFieldLabel, 
                            destinationFieldApiName : this.fields[event.detail.selectedIndex].selectedDestinationFieldApiName};
            this.fieldMapping.push(detail);
        }
    }

    handleDestinationFieldSelect(event){
        
        var index;
        if(this.fieldMapping){

            for(let i=0; i<this.fieldMapping.length; i++){
                
                if(this.fieldMapping[i].sourceFieldApiName == this.fields[event.detail.selectedIndex].sourceFieldApiName){
                    index = i;
                    //break;
                }
            }
        }
        if(index >= 0){
            this.fieldMapping[index].destinationFieldApiName = event.detail.selectedValue;
            this.fieldMapping[index].destinationFieldLabel = event.detail.selectedLabel;
            this.template.querySelector("c-select-Combobox").changeFieldMapping(this.fieldMapping);
        }else{
            const detail = {sourceFieldLabel : this.fields[event.detail.selectedIndex].sourceFieldLabel, 
                            sourceFieldApiName : this.fields[event.detail.selectedIndex].sourceFieldApiName,  
                            accountFieldLabel : this.fields[event.detail.selectedIndex].selectedAccountFieldLabel, 
                            accountFieldApiName : this.fields[event.detail.selectedIndex].selectedAccountFieldApiName, 
                            contactFieldLabel : this.fields[event.detail.selectedIndex].selectedContactFieldLabel, 
                            contactFieldApiName : this.fields[event.detail.selectedIndex].selectedContactFieldApiName, 
                            destinationFieldLabel : event.detail.selectedLabel, 
                            destinationFieldApiName : event.detail.selectedValue};
            this.fieldMapping.push(detail);
        }
    }

    onSave(event){
        this.isSpinnerDisplay = true;
        if(this.fieldMapping){
            for(let i=0; i<this.fields.length; i++){
                var sourceFieldExists = false;
                for(let j=0; j<this.fieldMapping.length; j++){
                    if(this.fields[i].sourceFieldApiName == this.fieldMapping[j].sourceFieldApiName){
                        sourceFieldExists = true;
                        break;
                    }
                }
                if(!sourceFieldExists && (this.fields[i].selectedAccountFieldApiName || this.fields[i].selectedContactFieldApiName || this.fields[i].selectedDestinationFieldApiName)){
                    const detail = {sourceFieldLabel : this.fields[i].sourceFieldLabel, 
                                    sourceFieldApiName : this.fields[i].sourceFieldApiName,  
                                    accountFieldLabel : this.fields[i].selectedAccountFieldLabel, 
                                    accountFieldApiName : this.fields[i].selectedAccountFieldApiName, 
                                    contactFieldLabel : this.fields[i].selectedContactFieldLabel, 
                                    contactFieldApiName : this.fields[i].selectedContactFieldApiName, 
                                    destinationFieldLabel : this.fields[i].selectedDestinationFieldLabel, 
                                    destinationFieldApiName : this.fields[i].selectedDestinationFieldApiName,
                                    };
                    this.fieldMapping.push(detail);
                }
            }
        }
        if(this.childObjectMapping){
            for(let i=0; i<this.relatedObjects.length; i++){
                var sourceObjectExists = false;
                for(let j=0; j<this.childObjectMapping.length; j++){
                    if(this.relatedObjects[i].value == this.childObjectMapping[j].sourceFieldApiName){
                        sourceObjectExists = true;
                        break;
                    }
                }
                if(!sourceObjectExists && (this.relatedObjects[i].isAccountChecked || this.relatedObjects[i].isContactChecked || this.relatedObjects[i].isDestinationChecked)){
                    const detail = {sourceFieldLabel : this.relatedObjects[i].label, 
                                    sourceFieldApiName : this.relatedObjects[i].value, 
                                    accountCheckBoxSelect : this.relatedObjects[i].isAccountChecked, 
                                    contactCheckBoxSelect : this.relatedObjects[i].isContactChecked,  
                                    destinationCheckBoxSelect : this.relatedObjects[i].isDestinationChecked,
                                    accountReferenceFields : this.relatedObjects[i].accountReferenceFields,
                                    contactReferenceFields : this.relatedObjects[i].contactReferenceFields,
                                    destinationReferenceFields : this.relatedObjects[i].destinationReferenceFields};
                    this.childObjectMapping.push(detail);
                }
            }
        }
        var mappedRequired = false;
        var errorMsg = 'Please map the required Fields of Account: ';
        var accRequiredData = this.fields[0].requiredAccountFields;
        var conRequiredData = this.fields[0].requiredContactFields;
        var destRequiredData = this.fields[0].requiredDestinationFields;
        for(let i=0; i<accRequiredData.length; i++){
            errorMsg += accRequiredData[i].label+',';
            if(i==accRequiredData.length-1){
                errorMsg = errorMsg.slice(0, -1);
            }
        }
        errorMsg += ' Contact: ';
        for(let i=0; i<conRequiredData.length; i++){
            errorMsg += conRequiredData[i].label+',';
            if(i==conRequiredData.length-1){
                errorMsg = errorMsg.slice(0, -1);
            }
        }
        if(destRequiredData && destRequiredData.length>0){
            errorMsg += ' And Destination: ';
            for(let i=0; i<destRequiredData.length; i++){
                errorMsg += destRequiredData[i].label+',';
                if(i==destRequiredData.length-1){
                    errorMsg = errorMsg.slice(0, -1);
                }
            }
        }
        if(this.fieldMapping){
            var allFieldMappedData = [];
            var accFieldMappedData = [];
            var conFieldMappedData = [];
            var destFieldMappedData = [];
            for(let j=0; j<this.fieldMapping.length; j++){
                if(this.fieldMapping[j].accountFieldApiName)
                    accFieldMappedData.push(this.fieldMapping[j].accountFieldApiName);
                if(this.fieldMapping[j].contactFieldApiName)
                    conFieldMappedData.push(this.fieldMapping[j].contactFieldApiName);
                if(this.fieldMapping[j].destinationFieldApiName)
                    destFieldMappedData.push(this.fieldMapping[j].destinationFieldApiName);
            }
            
            var requiredData = this.fields[0].allRequiredFields;
            
            
            
            

            if(!mappedRequired && (accRequiredData && accFieldMappedData)){
                for(let i=0; i<accRequiredData.length; i++){
                    if(!accFieldMappedData.includes(accRequiredData[i].value)){
                        
                        mappedRequired = true;
                        break;
                    }
                }
            }else{
                mappedRequired = true;
            }
            if(!mappedRequired && (conRequiredData && conFieldMappedData)){
                for(let i=0; i<conRequiredData.length; i++){
                    if(!conFieldMappedData.includes(conRequiredData[i].value)){
                        
                        mappedRequired = true;
                        break;
                    }
                }
            }else{
                mappedRequired = true;
            }
            if(!mappedRequired && (destRequiredData && destFieldMappedData)){
                for(let i=0; i<destRequiredData.length; i++){
                    if(!destFieldMappedData.includes(destRequiredData[i].value)){
                        
                        mappedRequired = true;
                        break;
                    }
                }
            }else{
                mappedRequired = true;
            }
        }
        
        this.objectMapping.sourceObjectLabel = this.sourceObjectLabel;
        this.objectMapping.sourceObjectApiName = this.sourceObject;
        this.objectMapping.destinationObjectLabel = this.destinationObjectLabel;
        this.objectMapping.destinationObjectApiName = this.destinationObject;

        const objectMap = JSON.stringify(this.objectMapping);
        const fieldMap = JSON.stringify(this.fieldMapping);
        const relatedObjectMap = JSON.stringify(this.childObjectMapping);

        
        if(mappedRequired){
            this.isSpinnerDisplay = false;
            const event = new ShowToastEvent({
                title: 'Error',
                message: errorMsg,
                variant:'error'
            });
            this.dispatchEvent(event);
        }else{
            this.isShowRelatedObjects = false;
            this.isShowFields = false;
            onSave({objectMapping : objectMap, fieldMapping : fieldMap, relatedChilObjectMapping : relatedObjectMap})
            .then(result => {
                
                this.isSpinnerDisplay = false;
                var resultData = JSON.parse(result);
                this.fields = resultData.fieldWrappers;
                this.relatedObjects = resultData.childObjectsList;
                this.isShowRelatedObjects = true;
                this.isShowFields = true;
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Mapping Successfully Saved',
                    variant:'success'
                });
                this.dispatchEvent(event);
                this.error = undefined;
            })
            .catch(error => {
                this.isShowRelatedObjects = true;
                this.isShowFields = true;
                this.isSpinnerDisplay = false;
                this.error = error;
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: error,
                    variant:'error'
                });
                this.dispatchEvent(event);
                this.isShowFields = false;
            })
        }
    }

    onReset(event){
        this.isShowFields = false;
        this.isShowRelatedObjects = false;
        this.isSpinnerDisplay = true;
        getFields({sourceObject : this.sourceObject, destinationObject : this.destinationObject, isReset: true})
        .then(result => {
			this.error = undefined;
            this.fields = result.fieldWrappers;
            console.log('this.fields Reset---===='+JSON.stringify(this.fields));
            this.relatedObjects = result.childObjectsList;
            if(result.childObjectsList && result.childObjectsList.length>0){
                this.isShowRelatedObjects = true;
            }
            this.fieldMapping = [];
            this.isShowFields = true;
            this.isSpinnerDisplay = false;


            const event = new ShowToastEvent({
                title: 'Success',
                message: 'Fields has been reset',
                variant:'success'
            });
            this.dispatchEvent(event);
		})
		.catch(error => {
			this.error = error;
            console.log("this.error---=="+JSON.stringify(this.error));
            this.isShowFields = false;
            this.isSpinnerDisplay = false;
            const event = new ShowToastEvent({
                title: 'Error',
                message: error,
                variant:'error'
            });
            this.dispatchEvent(event);
		})
        console.log('On Reset');
    }
    
}