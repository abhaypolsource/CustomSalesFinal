import { LightningElement,api } from 'lwc';

export default class RecordListComponent extends LightningElement {
    @api record;
    @api iconname;
    @api fieldname;
    handleSelect(){
        console.log('record from the list is selected',this.record.Id);
        this.dispatchEvent(new CustomEvent('select',{
            detail:this.record.Id
        }));
    }
}