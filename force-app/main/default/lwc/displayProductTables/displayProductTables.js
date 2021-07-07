import { LightningElement, track} from 'lwc';
import getProduct from '@salesforce/apex/displayProductTableCtrl.getProducts'


export default class DisplayProductTables extends LightningElement {
    @track error
    @track data
    @track selectedItem = 0
    @track prodctName
    @track columns = [{
            label: 'Product name',
            fieldName: 'productName',
            type: 'text',
            sortable: true
        },
        {
            label: 'Product Code',
            fieldName: 'productCode',
            type: 'text',
            sortable: true
        },
        {
            label: 'List Price',
            fieldName: 'listPrice',
            type: 'Decimal',
            sortable: true
        },
        {
            label: 'Product Description',
            fieldName: 'prdctDscrption',
            type: 'text',
            sortable: true
        },
        {
            label: 'Product Family',
            fieldName: 'productFamily',
            type: 'text',
            sortable: true
        }
    ];
    /*On initialization of component*/
    connectedCallback() {
        getProduct({ name :''}).then (result => {
            this.data = result;
        }).catch (error => {
            this.error = error;
        });
    }
    /*get number of selected row count*/
    getSelectedName(event) {
        let selectedRow = event.detail.selectedRows;
        this.selectedItem = selectedRow.length;
    }
    /*Handle input value */
    handleNumberChange(event) {
        this.prodctName = event.target.value;
    }
    /*handle serach with product Name*/
    onTextChange(event) {
        if (event.keyCode == 13) {
            this.data = [];
            getProduct({ name : this.prodctName }).then (result => {
                this.data = result;
            }).catch (error => {
                this.error = error;
            });
        }
    }
}