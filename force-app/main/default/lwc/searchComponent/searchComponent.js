import { api, LightningElement } from 'lwc';

export default class SearchComponent extends LightningElement {
    searchKey;
    @api objectName;
    
    handleChange(event){
        const searchKey = event.target.value;
        const searchEvent = new CustomEvent('change',{detail:searchKey});
        this.dispatchEvent(searchEvent);
    }
}