import { LightningElement, track, api } from 'lwc';

export default class SelectCombobox extends LightningElement {

    @api options;
    @api sourcetype = '';
    @api compatibledatatype = {};
    @api selectedvalue;
    @api selectedValues = [];
    @api fieldmapping;
    @api label;
    @api minChar = 2;
    @api disabled = false;
    @api multiSelect = false;
    @api value;
    @api index = 0;
    @track values = [];
    @track optionData;
    @track searchString;
    @track message;
    @track showDropdown = false;
 
    connectedCallback() {
        this.showDropdown = false;
        var optionData = this.options ? (JSON.parse(JSON.stringify(this.options))) : null;
        var value = this.selectedvalue ? (JSON.parse(JSON.stringify(this.selectedvalue))) : null;
        var values = this.selectedValues ? (JSON.parse(JSON.stringify(this.selectedValues))) : null;
		if(value || values) {
            var searchString;
        	var count = 0;
            for(var i = 0; i < optionData.length; i++) {
                if(this.multiSelect) {
                    if(values.includes(optionData[i].value)) {
                        optionData[i].selected = true;
                        count++;
                    }  
                } else {
                    if(optionData[i].value == value) {
                        searchString = optionData[i].label;
                    }
                }
            }
            if(this.multiSelect)
                this.searchString = count + ' Option(s) Selected';
            else
                this.searchString = searchString;
        }
        this.value = value;
        this.values = values;
        this.optionData = optionData;
    }
 
    filterOptions(event) {
        this.searchString = event.target.value;
        if( this.searchString && this.searchString.length > 0 ) {
            this.message = '';
            if(this.searchString.length >= this.minChar) {
                var flag = true;
                for(var i = 0; i < this.optionData.length; i++) {
                    if(this.optionData[i].label.toLowerCase().trim().startsWith(this.searchString.toLowerCase().trim())) {
                        this.optionData[i].isVisible = true;
                        flag = false;
                    } else {
                        this.optionData[i].isVisible = false;
                    }
                }
                if(flag) {
                    this.message = "No results found for '" + this.searchString + "'";
                }
            }
            this.showDropdown = true;
        } else {
            this.showDropdown = false;
        }
	}
 
    selectItem(event) {
        var selectedVal = event.currentTarget.dataset.id;
        if(selectedVal) {
            var count = 0;
            var options = JSON.parse(JSON.stringify(this.optionData));
            for(var i = 0; i < options.length; i++) {
                if(options[i].value === selectedVal) {
                    if(this.multiSelect) {
                        if(this.values.includes(options[i].value)) {
                            this.values.splice(this.values.indexOf(options[i].value), 1);
                        } else {
                            this.values.push(options[i].value);
                        }
                        options[i].selected = options[i].selected ? false : true;   
                    } else {
                        this.value = options[i].value;
                        this.searchString = options[i].label;
                    }
                }
                if(options[i].selected) {
                    count++;
                }
            }
            this.optionData = options;
            if(this.multiSelect)
                this.searchString = count + ' Option(s) Selected';
            if(this.multiSelect)
                event.preventDefault();
            else
                this.showDropdown = false;
        }

        // Creates the event with the data.
        const selectedEvent = new CustomEvent("valuechange", {
            detail:{
                'selectedValue' : event.currentTarget.dataset.id,
                'selectedLabel' : event.currentTarget.dataset.label,
                'selectedIndex' : this.index
            } 
            
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    @api changeFieldMapping(fieldMap){
        this.fieldmapping = fieldMap;
    }
 
    showOptions() {
        if(this.disabled == false && this.options) {
            this.message = '';
            this.searchString = '';
            var options = JSON.parse(JSON.stringify(this.optionData));

            var typeOptions = [];
            if(this.compatibledatatype && this.sourcetype){
                var compatibleDataList = this.compatibledatatype[this.sourcetype];
                console.log('compatibleDataList----'+JSON.stringify(compatibleDataList));
                if(this.fieldmapping && this.fieldmapping.length>0){
                    for(var i = 0; i < options.length; i++){
                        var mappingAlreadyExists = false;
                        for(var j = 0; j < this.fieldmapping.length; j++){
                            if(compatibleDataList.includes(options[i].type) && (options[i].value == this.fieldmapping[j].accountFieldApiName || options[i].value == this.fieldmapping[j].contactFieldApiName || options[i].value == this.fieldmapping[j].destinationFieldApiName)){
                                mappingAlreadyExists = true;
                                break;
                            }
                        }
                        if(mappingAlreadyExists == false){
                            typeOptions.push(options[i]);
                        }
                    }
                }
                else{
                    for(var i = 0; i < options.length; i++){
                        if(compatibleDataList.includes(options[i].type)){
                            typeOptions.push(options[i]);
                        }
                        /*if(options[i].type == this.sourcetype || options[i].type == 'TEXTAREA' || options[i].type == 'STRING'){
                            typeOptions.push(options[i]);
                        }*/
                    }
                }
                
                for(var i = 0; i < typeOptions.length; i++) {
                    typeOptions[i].isVisible = true;
                }
                if(typeOptions.length > 0) {
                    this.showDropdown = true;
                }
                this.optionData = typeOptions;
            }else{
                for(var i = 0; i < options.length; i++) {
                    options[i].isVisible = true;
                }
                if(options.length > 0) {
                    this.showDropdown = true;
                }
                this.optionData = options;
            }
            
            /*for(var i = 0; i < options.length; i++) {
                options[i].isVisible = true;
            }
            if(options.length > 0) {
                this.showDropdown = true;
            }
            this.optionData = options;*/
        }
	}
 
    removePill(event) {
        var value = event.currentTarget.name;
        var count = 0;
        var options = JSON.parse(JSON.stringify(this.optionData));
        for(var i = 0; i < options.length; i++) {
            if(options[i].value === value) {
                options[i].selected = false;
                this.values.splice(this.values.indexOf(options[i].value), 1);
            }
            if(options[i].selected) {
                count++;
            }
        }
        this.optionData = options;
        if(this.multiSelect)
            this.searchString = count + ' Option(s) Selected';
    }
 
    blurEvent() {
        var previousLabel;
        var count = 0;
        for(var i = 0; i < this.optionData.length; i++) {
            if(this.optionData[i].value === this.value) {
                previousLabel = this.optionData[i].label;
            }
            if(this.optionData[i].selected) {
                count++;
            }
        }
        if(this.multiSelect)
        	this.searchString = count + ' Option(s) Selected';
        else
        	this.searchString = previousLabel;
        
        this.showDropdown = false;
 
        this.dispatchEvent(new CustomEvent('select', {
            detail: {
                'payloadType' : 'multi-select',
                'payload' : {
                    'value' : this.value,
                    'values' : this.values
                }
            }
        }));
    }
}