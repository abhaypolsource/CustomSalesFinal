import { LightningElement,wire,track,api } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getSourceObjInfo from '@salesforce/apex/SearchController.getSourceObjInfo';
import fetchDestination from '@salesforce/apex/SearchController.fetchDestination';
import fetchRecordType from '@salesforce/apex/SearchController.fetchRecordType';
import validateAccountRelatedContact from '@salesforce/apex/SearchController.validateAccountRelatedContact';
import insertAccContOpp from '@salesforce/apex/SearchController.insertAccContOpp';
import mapRequiredFieldValidator from '@salesforce/apex/RequiredFieldValidator.mapRequiredFieldValidator';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CustomImage from '@salesforce/resourceUrl/convertImage';
import { NavigationMixin } from 'lightning/navigation';

export default class Convertsource1 extends NavigationMixin(LightningElement){
    @api objectApiName;   //value is fetched from aura component
    @api recordId;
    contactLastName;
    contactFirstName;
    accRecordType=[];
    contRecordType=[];
    destRecordType=[];
    selectOptions = [];
    selectOptions1 = [];
    selectOptions2 = [];
    checkBoxDest=false;
    AccRecordDisable=false;
    DesRecordDisable=false;
    ConRecordDisable=false;
    conTitle;
    errorlogo = CustomImage;
    contFirstName;
    contLastName;
    contactTotalName;
    @track mainhead=true;
    @track activeSections="A";
    @track secAfield=false;
    @track secBfield=true;
    @track showSearchedValues=true;
    @track secAfieldcopy=false;
    @track secCfield=true;
    @track accountname="";
    @track existAcc=false;
    @track newAcc=true;
    @track existCon=false;
    @track newCon=true;
    @track OpenSections="";
    DestinationValue;
    showAccSearchBar = false;
    showConSearchBar = false;
    desvar=false;
    showDestSearchBar = false;
    defaultAccValue;
    defaultContValue;
    defaultDestVal;
    selectedAccId;
    selectedConId;
    selectedDestId;
    selectedDestName="";
    selectedRecordId;
    accountName = '';
    contactName = '';
    destinationLabelName = '';
    accountLabelName="Account";
    contactLabelName="Contact";
    destinationName = '';
    selectedAccName="";
    selectedConName="";
    rec = [];
    hide =true;;
    isModalOpen = false;
    objectLabel = '';
    @track error=false;
    @track Asectionerror = false;
    @track Conrequiredvalue = false;
    @track ashu = true;
    existDes=false;
    newDes=true;
    errorBC=false;
    errorAC=false;
    Thirdaccordian="Destination";
    desdisable=false;
    validateAccRecord = false;
    validateContRecord = false;
    validateDestRecord = false;
    validateRecord=false;
    AccRecordValue="";
    AccRecord=false;
    AccRecordDisableName="Select Record";
    ConRecordDisableName="Select Record";
    DesRecordDisableName="Select Record";
    ConRecordValue="";
    ConRecord=false;
    DesRecord=false;
   
    DesRecordValue='';
    errorA=false;

    requiredFieldResult;
    isLoading = false;
    disableConvertDest=true;

    convertAccName;
    convertAccOwnerName;
    showAccountId;
    convertAccPhone;
    convertAccType;
    convertAccWebsite;
    convertAccSite;
    sourceApiName;
   
    convertOppName;
    convertOppOwnerName;
    convertOppDate;
    convertOppAmount;
    convertOppId;

    convertContMPhone;
    convertContAccName;
    convertContPhone;
    convertContEmail;
    convertContAccId;
    convertContId;
    convertContName;
    convertContOwnerName;
    convertContTitle;

    disableConvertNotOpp=false;
    destinationApiName;
    accContValidation;
    validateACcCont = true;

    connectedCallback(){
        mapRequiredFieldValidator()
        .then(result => {
            console.log('result==>'+result);
            this.requiredFieldResult = result;
            this.error = undefined;
            console.log('checkREQValueField'+this.requiredFieldResult);
            if(result != ''){
              this.isLoading =true;
              this.mainhead = false;
            console.log("Sinpper is working")
            }
        })
        .catch(error => {
            this.error = error;
            this.contacts = undefined;
        });
    }

    navigateNext() {
        console.log('inside tab00');
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Conversion_Mapping',
            }
        });
    }
  

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
                        this.contFirstName = parsedResult.FirstName;
                        this.contLastName = parsedResult.LastName;
                      
                        //this.destinationLabelName = parsedResult.destinationLabelName;
                        if(this.contFirstName=="null" && this.contLastName=='null' && this.contactName != 'null'){
                            let FullContact = this.contactName.split(" ");
                            console.log("After Split",FullContact);
                       //     console.log("Contact Last Name and First Name", FullContact.toString(),FullContact.splice(1).join(" ").toString());
                       if(FullContact.length==1){
                           console.log("Inside Single contact NAme")
                           this.contactFirstName ="";
                           this.contactLastName=FullContact[0].toString();
                           this.contactTotalName = this.contactFirstName+" "+this.contactLastName;

                       }else{
                            this.contactFirstName=FullContact[0].toString();
                            console.log("FIrst Name",FullContact[0].toString());
                            this.contactLastName= FullContact.splice(1).join(" ").toString();
                            console.log("Last NAme",FullContact.splice(1).join(" ").toString())
                            this.contactTotalName = this.contactFirstName+" "+this.contactLastName;
                       }
                        }else if(this.contFirstName!= 'null' && this.contLastName != 'null' && this.contactName == "null"){
                         
                            this.contactFirstName=this.contFirstName;
                            this.contactLastName= this.contLastName;
                            this.contactTotalName = this.contactFirstName+" "+this.contactLastName;
                        }else if(this.contFirstName!= 'null' && this.contLastName == 'null' && this.contactName == "null"){
                            this.contactFirstName=this.contFirstName;
                            this.contactLastName= "";
                            this.contactTotalName = this.contactFirstName+" "+this.contactLastName;   
                        }else if(this.contFirstName== 'null' && this.contLastName != 'null' && this.contactName == "null"){
                            this.contactFirstName="";
                            this.contactLastName= this.contLastName;
                            this.contactTotalName = this.contactFirstName+" "+this.contactLastName;   
                        }
                    }
                })
                .catch(error => {
                    console.log('error in source object:::', error);
                });
        } else if (error) {
            console.log('error :::', error);
        }
    }

    @wire(fetchDestination)
    fetchDestinationData({ data, error}) {
        if(data) {
            console.log('data :::', data);
            fetchDestination()
            .then(result => {
                console.log('result of destination:::', result);
                if(result){
                    let parsedResult = JSON.parse(result);
                    this.destinationLabelName = parsedResult.destinationLabelName; 
                    this.destinationApiName=parsedResult.destinationAPiName;
                    this.sourceApiName = parsedResult.sourceApiName;
                    console.log('this.destinationLabelName'+this.destinationLabelName);
                }
            })
            .catch(error => {
                console.log('error in source object:::', error);
            });
       } else if (error) {
        console.log('error :::', error);
         }
        
    }

  @wire(fetchRecordType)
    fetchRelatedRecordType({data, error}){
        if(data) {
            console.log('Data recordType:::', data);
            fetchRecordType()
            .then(result => {
                console.log('Result of RecordType:::', result);
                if(result){
                    //let parsedResult = JSON.parse(result);
                    var fetchResult = result;
                    console.log('fetchRecordType',fetchResult);
                    this.accRecordType = fetchResult[0];
                    this.contRecordType=fetchResult[1];
                    this.destRecordType=fetchResult[2];
                    console.log("New value of desrecord",this.destRecordType);
                    console.log('O index',this.accRecordType);
                    console.log('index 1='+JSON.stringify(fetchResult[1]));
                    console.log('index2'+JSON.stringify(fetchResult[2]));
                    //this.destinationLabelName = parsedResult.destinationLabelName; 
                    //console.log('this.destinationLabelName'+this.destinationLabelName);
                  
                   
                    if(this.accRecordType.length==1){
                        this.AccRecordValue=this.accRecordType[0].Id;
                        this.AccRecordDisableName = this.accRecordType[0].Name;
                        this.AccRecord = true;
                        this.AccRecordDisable=true;
                        console.log("By default Acc Record Id",this.AccRecordValue);
                    }
                    else if(this.accRecordType.length>1){
                        this.AccRecord=true;
                        this.AccRecordDisable=false;
                    }


                    if(this.contRecordType.length==1){
                        this.ConRecordValue=this.contRecordType[0].Id;
                        this.ConRecordDisableName = this.contRecordType[0].Name;
                        this.ConRecord=true;
                        this.ConRecordDisable=true;
                        console.log("default con record value",this.ConRecordValue)
                    }else if(this.contRecordType.length>1){
                        this.ConRecord=true;
                        this.ConRecordDisable=false;
                    }


                    if(this.destRecordType.length==1){
                        this.DesRecordValue=this.destRecordType[0].Id;
                        this.DesRecordDisableName=this.destRecordType[0].Name;
                        this.DesRecord = true;
                        this.DesRecordDisable=true;
                    }else if(this.destRecordType.length>1 ){
                        this.DesRecord=true;
                        this.DesRecordDisable=false;
                    }

                     console.log("Destination record id",this.DesRecordValue);

                   // let option;
                    //let option1;
                    //let option2= [];
                    for(const list of fetchResult[2]){
                        console.log("List of dest ",list);
                       const  option2 = {
                            label: list.Name,
                            value: list.Id,
                        };
                         this.selectOptions2.push(option2);
                        
                    }

                    for(const list of fetchResult[0]){
                        console.log("List of acc ",list);
                        const option= {
                            label: list.Name,
                            value: list.Id,
                        };
                         this.selectOptions.push(option);
                        
                    }

                    for(const list of fetchResult[1]){
                        console.log("List of cont ",list);
                        const option1 = {
                            label: list.Name,
                            value: list.Id,
                        };
                        this.selectOptions1.push(option1);
                       
                    }
                    console.log('option2'+JSON.stringify(this.selectOptions1));
                    this.contRecordType = this.selectOptions1;
                    this.accRecordType = this.selectOptions;
                    this.destRecordType = this.selectOptions2;
                    console.log('this.contRecd'+this.contRecordType);
                  }


            })
            .catch(error => {
                console.log('error in source object recordType:::', error);
            });
       } else if (error) {
        console.log('error recordType:::', error);
         }
        
    } 

    firstsection(event){

        const accerror = this.template.querySelector(".accerrormsg")
        if(this.newAcc == true){
            accerror.classList.remove("error_msg");
            accerror.style.display = "none";
            let NewAccount = this.template.querySelector('.newacc');
            if(!NewAccount.value){
                NewAccount.setCustomValidity("Please Fill The New Account Field");
                this.activeSections="A";
                event.stopPropagation();
              
                console.log("active section of A with new account error",this.activeSections,this.OpenSections.join(""));
               if(this.activeSections=="A" && this.OpenSections.join("") == ""){
                  this.secBfield=true;
                    this.activeSections="";
                    this.secCfield=true;
                    this.secAfield=false;
                    console.log("Inside Error SEction of A with new acc",this.OpenSections.join(""));
                    this.errorA=true;
                    this.errorAB=false;
                    this.errorAC=false;
                    this.error=false;
                }else{
                    this.secBfield=true;
                    console.log("Inside Error SEction of A with new acc Else Part",this.OpenSections.join(""));
                    
                }

            }else{
                this.errorA=false;
                this.errorAB=false;
                this.errorAC=false;
                this.error=false;
                NewAccount.setCustomValidity("");
                this.activeSections="A";
                console.log("active section of A without Error in New acc",this.activeSections)
                if(this.activeSections ==="A" && this.OpenSections.length !== 0){
                    this.secAfield=false;
                    this.secBfield=true;
                    this.secCfield=true;
                   
                }else{
                        this.secAfield=true;
                        console.log("active section of A without Error in New acc of else part",this.activeSections)
                    }
                
            }
            NewAccount.reportValidity();
        }else if(this.existAcc == true){
            if(! this.selectedAccId){
         /*     accerror.style.display = "block";
              accerror.classList.add("ashu");
              console.log("apply set timout")
              setTimeout(()=>{
                accerror.style.display = "none";
              },5000) */
              accerror.classList.add("error_msg");
              accerror.style.display = "block";
                this.secBfield=true;
                this.activeSections="";
                this.secCfield=true;
                this.errorA=true;
                this.errorAB=false;
                this.errorAC=false;
                this.error=false;
                this.secAfield=false;
            }else{
                accerror.classList.remove("error_msg");
                accerror.style.display="none";
                this.errorA=false;
                this.errorAB=false;
                this.errorAC=false;
                this.error=false;
                this.activeSections="A";
                if(this.activeSections ==="A" && this.OpenSections.length !== 0){
                    this.secAfield=false;
                    this.secBfield=true;
                    this.secCfield=true;
                   
                }else{
                        this.secAfield=true;
                    }

            }
        }

     
  

            
    }
   
    secondsection(){
      
        if(this.newCon == true || this.existCon==true){
            if(this.newAcc == true){
                let NewAccount = this.template.querySelector('.newacc');
                if(!NewAccount.value){
                    NewAccount.setCustomValidity("Please Fill The New Account Field");
                    this.activeSections="A";
                  
                    console.log("This active section of B with new acc Error ",this.activeSections,this.OpenSections.join(""));
             //      if(this.activeSections=="A" && this.OpenSections.join("") == "AB"){
                      this.secBfield=true;
                        this.activeSections="";
                        this.secCfield=true;
                        this.secAfield=false;
                        this.error=true;
                        this.errorA=false;
                        this.errorAC=false;
                        this.errorAB=false;
               //     }else{
            //            this.secBfield=true;
               //     }

                }else{
                    this.error=false;
                    this.errorA=false;
                    this.errorAC=false;
                    this.errorAB=false;
                    NewAccount.setCustomValidity("");
                  this.activeSections="B";
                    console.log("Active section of B with New Acc without Error",this.activeSections)
                    if(this.activeSections==="B" && this.OpenSections.length !== 0){
                        this.secBfield=false
                        this.activeSections="B";
                        this.secAfield=true;
                        console.log("B section without new acc error inside if part")
                        this.secCfield=true;
                    }else{
                        this.secBfield=true;
                        this.secAfield=true;
                        this.activeSections="B"
                        this.secCfield=true;
                        console.log("B section without new acc error inside  else part")

                    }
                }
                NewAccount.reportValidity();
            }else if(this.existAcc == true){
                const accerror = this.template.querySelector(".accerrormsg")
                if(! this.selectedAccId){
         /*         accerror.style.display = "block";
                  console.log("apply set timout")
                  setTimeout(()=>{
                    accerror.style.display = "none";
                  },5000)*/
                  accerror.classList.add("error_msg");
                  accerror.style.display = "block";
                    this.secBfield=true;
                    this.activeSections="";
                    this.secCfield=true;
                    this.error=true;
                    this.errorA=false;
                    this.errorAC=false;
                    this.errorAB=false;
                }else{
                    accerror.classList.remove("error_msg");
                    accerror.style.display="none";
                    this.error=false;
                    this.errorA=false;
                    this.errorAC=false;
                    this.errorAB=false;
                    this.activeSections="B";
                    if(this.activeSections==="B" && this.OpenSections.length !== 0){
                        this.secBfield=false
                        this.secAfield=true;
                        this.secCfield=true;
                    }else{
                        this.secBfield=true;
                        this.secAfield=true;
                        this.secCfield=true;
                    }

                }
            }
          
        }

    }
    thirdsection(){
        if(this.newDes==true||this.existDes){

            if(this.newAcc == true){
                let NewAccount = this.template.querySelector('.newacc');
                if(!NewAccount.value){
                    NewAccount.setCustomValidity("Please Fill The New Account Field");
                    this.activeSections="A";
                  
                    console.log("On Click of Section C on NewACC error",this.activeSections,this.OpenSections.join(""));
                   if(this.activeSections=="A" && this.OpenSections.join("") == "AC"){
                    //  this.secBfield=true;
                        this.activeSections="";
                        this.errorAC=true;
                        this.error=false;
                        this.errorA=false;
                        this.secCfield=true;
                        this.secBfield=true;
                        this.secAfield=false;
                        
                    }else{
                      //  this.secBfield=true;
                      console.log("Else part of New Account Error in section C in Here itself",this.activeSections,this.OpenSections.join(""))
                    }

                }else{
                    this.errorAC=false;
                    this.error=false;
                    this.errorA=false;
                    NewAccount.setCustomValidity("");
                    console.log("Else part of new acc in sec C")
                    if(this.newCon == true){
                        const NameContact = this.template.querySelector('.newcontact2')
                    if(!NameContact.value){
                        NameContact.setCustomValidity("Please Fill The Last Name");
                        this.activeSections="B";
                          
                            console.log("This active section C error when new contact is empty",this.activeSections,this.OpenSections.join(""));
                           if(this.activeSections=="B" && this.OpenSections.join("") == "BC"){
                            //  this.secBfield=true;
                                this.activeSections="";
                                this.errorBC=true;
                                this.secAfield=true;
                                this.secBfield=false;
                                this.secCfield=true;
                                console.log("inside Section C of new contact")
                            }else{
                              //  this.secBfield=true;
                            }
        
                        }else{
                            this.errorBC=false;
                            this.error=false;
                            this.errorA=false;
                            NameContact.setCustomValidity("");
                            this.activeSections="C";
                            console.log("else part of new contact active section C",this.activeSections)
                            if(this.activeSections==="C" && this.OpenSections.length !== 0){
                                this.secBfield=true;
                                this.secAfield=true;
                                this.secCfield=false;
                                console.log("Inside else of new con sec c")
                            }else{
                                this.secCfield=true;
                            }
                        }
                        NameContact.reportValidity();
                    }else if(this.existCon == true){
                        const ExistContact = this.template.querySelector('.conerrormsg')
                   if(!this.selectedConId){
                  /*      ExistContact.style.display = "block";
                        setTimeout(()=>{
                            ExistContact.style.display = "none";
                        },6000);*/
                        ExistContact.style.display = "block";
                        ExistContact.classList.add("error_msg");
                       //     this.secBfield=true;
                            this.activeSections="";
                            this.errorBC=true;
                            this.secAfield=true;
                            this.secBfield=false;
                            this.secCfield=true;
                        }else{
                            ExistContact.style.display="none";
                            ExistContact.classList.remove("error_msg");
                            this.errorBC=false;
                            this.activeSections="C";
                console.log("the value of active section C",this.activeSections)
                if(this.activeSections==="C" && this.OpenSections.length !== 0){
                    this.secBfield=true;
                    this.secAfield=true;
                    this.secCfield=false;
                }else{
                    this.secCfield=true;
                }
                        }
                    }
                }
                NewAccount.reportValidity();
            }else if(this.existAcc == true){
                const accerror = this.template.querySelector(".accerrormsg")
                if(! this.selectedAccId){
         /*         accerror.style.display = "block";
                  console.log("apply set timout")
                  setTimeout(()=>{
                    accerror.style.display = "none";
                  },5000)*/
                  accerror.classList.add("error_msg");
                  accerror.style.display = "block";
               //     this.secBfield=true;
                    this.activeSections="";
                    this.secBfield=true;
                    this.secCfield=true;
                    this.secAfield=false;
                    this.errorAC=true;
                    this.error=false;
                    this.errorA=false
                }else{
                    accerror.classList.remove("error_msg");
                    accerror.style.display="none";
                    this.errorAC=false;
                    this.error=false;
                    this.errorA=false
        if(this.newCon == true){
            const NameContact = this.template.querySelector('.newcontact2')
        if(!NameContact.value){
            NameContact.setCustomValidity("Please Fill The Last Name");
            this.activeSections="B";
              
                console.log("This active section C",this.activeSections,this.OpenSections.join(""));
               if(this.activeSections=="B" && this.OpenSections.join("") == "BC"){
                //  this.secBfield=true;
                    this.activeSections="";
                    this.errorBC=true;
                    this.secBfield=false;
                    this.secAfield=true;
                    this.secCfield=true;
                    console.log("inside Section C")
                }else{
                  //  this.secBfield=true;
                }

            }else{
                this.errorBC=false;
                NameContact.setCustomValidity("");
                this.activeSections="C";
                console.log("the value of active section C",this.activeSections)
                if(this.activeSections==="C" && this.OpenSections.length !== 0){
                    this.secBfield=true;
                    this.secAfield=true;
                    this.secCfield=false;
                    console.log("Inside else of new con sec c")
                }else{
                    this.secCfield=true;
                }
            }
            NameContact.reportValidity();
        }else if(this.existCon == true){
            const ExistContact = this.template.querySelector('.conerrormsg')
        if(!this.selectedConId){
      /*      ExistContact.style.display = "block";
            setTimeout(()=>{
                ExistContact.style.display = "none";
            },6000);*/
            ExistContact.style.display = "block";
            ExistContact.classList.add("error_msg");
            
           //     this.secBfield=true;
                this.activeSections="";
                this.errorBC=true;
                this.secAfield=true;
                this.secBfield=false;
                this.secCfield=true;
            }else{
                ExistContact.style.display="none";
                ExistContact.classList.remove("error_msg");
                this.errorBC=false;
                this.activeSections="C";
    console.log("the value of active section C",this.activeSections)
    if(this.activeSections==="C" && this.OpenSections.length !== 0){
        this.secBfield=true;
        this.secAfield=true;
        this.secCfield=false;
    }else{
        this.secCfield=true;
    }
            }
        }
                }
            }

        }
    
    }
     optionHandler(event){
        if(event.target.name == 'existAcc'){
            this.existAcc = true;
            this.newAcc = false;
            this.activeSections="A";
            this.secAfield=false;
            this.secBfield=true;
            this.secCfield=true;
            this.showAccSearchBar = true;
            if(this.error==true){
                this.activeSections="A";
            }
            if(this.activeSections==="A" && this.OpenSections.join(" ")==""){
                this.secAfield=true;
            }

            let NewAccount = this.template.querySelector('.newacc');
            NewAccount.setCustomValidity("");
            
            NewAccount.reportValidity();
           
        }else if(event.target.name == 'newAcc'){
            console.log('chck option');
            this.existAcc = false;
            this.newAcc = true;
            this.activeSections="A";
            this.secAfield=false;
            this.secBfield=true;
            this.secCfield=true;
            this.selectedAccId = '';
            this.validateACcCont = true;
            console.log('selectedacc'+this.selectedAccId);
            this.showAccSearchBar = false;
            if(this.error==true){
                this.activeSections="A";
            }
            if(this.activeSections==="A" && this.OpenSections.join(" ")==""){
                this.secAfield=true;
            }
            const accerror = this.template.querySelector(".accerrormsg")
              accerror.style.display = "none";
              accerror.classList.remove("error_msg");
           
        }else if(event.target.name == 'existCon'){
            this.existCon = true;
        //    this.Conrequiredvalue = false;

            this.newCon = false;
            this.showConSearchBar = true;

            const NameContact = this.template.querySelector('.newcontact2')
            NameContact.setCustomValidity("");
            NameContact.reportValidity();

         //  let ExistAccount= this.template.querySelector('.existacc');
            if(this.newAcc == true){
                let NewAccount = this.template.querySelector('.newacc');
                if(!NewAccount.value){
                    NewAccount.setCustomValidity("Please Fill The New Account Field");
                    this.activeSections ="A";
                    this.secAfield=false;
                }else{
                    NewAccount.setCustomValidity("");
                    this.activeSections="B";
                    this.secBfield=false
                    this.secAfield=true;
                    this.secCfield=true;
                    console.log("here active section in existing contact and toggle section ",this.activeSections,this.OpenSections.join(" "));
                    if(this.activeSections==="B" && this.OpenSections.join(" ")==""){
                        this.secBfield=true;
                    }
                 /*   if(this.activeSections==="B" && this.OpenSections.length !== 0){
                        this.secBfield=false
                        this.secAfield=true;
                        this.secCfield=true;
                    }else{
                        this.secBfield=true;
                    }*/
                }
                NewAccount.reportValidity();
            } if(this.existAcc == true){
                const accerror = this.template.querySelector(".accerrormsg")
                if(! this.selectedAccId){
        /*            accerror.style.display = "block";
                    setTimeout(()=>{
                        accerror.style.display = "none";
                      },5000)*/
                      accerror.classList.add("error_msg");
                      accerror.style.display = "block";
                    this.activeSections="A";
                }else{
                    accerror.style.display = "none";
                    accerror.classList.remove("error_msg");
                    this.activeSections="B";
                    this.secBfield=false
                    this.activeSections="B"
                    this.secAfield=true;
                    console.log("here active section in existing contact",this.activeSections)
                    if(this.activeSections==="B" && this.OpenSections.join(" ")==""){
                        this.secBfield=true;
                    }
                /*    if(this.activeSections=="B" && this.OpenSections.length !== 0){
                        this.secBfield=false
                        this.activeSections="B"
                        this.secAfield=true;
                    }else{
                        this.secBfield=true;
                
                    }*/
                }
            }    
        }else if(event.target.name == 'newCon'){
            this.existCon = false;
            this.newCon = true;
            this.showConSearchBar = false;
              //  this.Conrequiredvalue = true;

              const ExistContact = this.template.querySelector('.conerrormsg')
              ExistContact.style.display = "none";
              ExistContact.classList.remove("error_msg");
          
            if(this.newAcc == true){
                let NewAccount = this.template.querySelector('.newacc');
                if(!NewAccount.value){
                    NewAccount.setCustomValidity("Please Fill The New Account Field");
                    this.activeSections ="A";
                    this.secAfield=false;
                }else{
                    this.activeSections="B";
                    this.secBfield=false
                    this.secAfield=true;
                    this.secCfield=true;
                    console.log("here active section in existing contact and Toggle Section",this.activeSections,this.OpenSections.join(" "));
                    if(this.activeSections==="B" && this.OpenSections.join(" ")==""){
                        this.secBfield=true;
                    }
            /*        if(this.activeSections==="B" && this.OpenSections.length !== 0){
                        this.secBfield=false
                        this.secAfield=true;
                        this.secCfield=true;
                    }else{
                        this.secBfield=true;
                    }*/
                }
                NewAccount.reportValidity();
            } if(this.existAcc == true){
                const accerror = this.template.querySelector(".accerrormsg")
                if(! this.selectedAccId){
      /*              accerror.style.display = "block";
                    setTimeout(()=>{
                        accerror.style.display = "none";
                      },5000)*/
                      accerror.classList.add("error_msg");
                      accerror.style.display = "block";
                    this.activeSections="A";
                }else{
                    accerror.style.display = "none";
                    accerror.classList.remove("error_msg");
                    this.activeSections="B";
                    this.secBfield=false
                    this.secAfield=true;
                    this.secCfield=true;
                    console.log("here active section in existing contact",this.activeSections)
                    if(this.activeSections==="B" && this.OpenSections.join(" ")==""){
                        this.secBfield=true;
                    }
           /*         if(this.activeSections=="B" && this.OpenSections.length !== 0){
                        this.secBfield=false
                        this.secAfield=true;
                    }else{
                        this.secBfield=true;
                    }*/
                }
            } 
           
        }else if(event.target.name=="newDes"){
            const Deserror = this.template.querySelector(".Deserrormsg")
            Deserror.classList.remove("error_msg");
            Deserror.style.display = "none";
            this.existDes=false;
            this.newDes=true;
            this.showDestSearchBar = false;

        } else if(event.target.name=="existDes"){
            this.existDes=true;
            this.newDes=false;
            this.showDestSearchBar = true;
            const NameDes= this.template.querySelector('.desContact')
            NameDes.setCustomValidity("");
            NameDes.reportValidity();

            if(this.newAcc == true){
                let NewAccount = this.template.querySelector('.newacc');
                if(!NewAccount.value){
                    NewAccount.setCustomValidity("Please Fill The New Account Field");
                    this.activeSections ="A";
                    this.secAfield=false;
                }else{
                    NewAccount.setCustomValidity("");
                    if(this.newCon == true){
                        const NameContact = this.template.querySelector('.newcontact2')
                    if(!NameContact.value){
                        NameContact.setCustomValidity("Please Fill The Last Name");
                        this.activeSections="B";
                        this.secBfield=false;

                        }else{
                        
                            NameContact.setCustomValidity("");
                            this.activeSections="C";
                            console.log("the value of active section C",this.activeSections)
                            this.secBfield=true;
                            this.secAfield=true;
                            this.secCfield=false;
                            if(this.activeSections==="C" && this.OpenSections.join(" ")==""){
                                this.secCfield=true;
                            }
                     /*       if(this.activeSections==="C" && this.OpenSections.length !== 0){
                                this.secBfield=true;
                                this.secAfield=true;
                                this.secCfield=false;
                                console.log("Inside else of new con sec c")
                            }else{
                                this.secCfield=true;
                            }*/
                        }
                        NameContact.reportValidity();
                    }else if(this.existCon == true){
                        const ExistContact = this.template.querySelector('.conerrormsg')
                    if(!this.selectedConId){
                /*       ExistContact.style.display = "block";
                        setTimeout(()=>{
                            ExistContact.style.display = "none";
                        },6000);*/
                        ExistContact.classList.add("error_msg");
                        ExistContact.style.display = "block";
                       //     this.secBfield=true;
                            this.secAfield=true;
                            this.activeSections="B"
                            this.secCfield=true;
                            this.secBfield=false;
                        }else{
                            ExistContact.style.display="none";
                            ExistContact.classList.remove("error_msg");
                            this.activeSections="C";
                            this.secBfield=true;
                            this.secAfield=true;
                            this.secCfield=false;
                console.log("the value of active section C",this.activeSections)
                if(this.activeSections==="C" && this.OpenSections.join(" ")==""){
                    this.secCfield=true;
                }

          /*      if(this.activeSections==="C" && this.OpenSections.length !== 0){
                    this.secBfield=true;
                    this.secAfield=true;
                    this.secCfield=false;
                }else{
                    this.secCfield=true;
                }*/
                        }
                    }
                }
                NewAccount.reportValidity();
       }
    
            if(this.existAcc == true){
                const accerror = this.template.querySelector(".accerrormsg")
                if(! this.selectedAccId){
          /*          accerror.style.display = "block";
                    setTimeout(()=>{
                        accerror.style.display = "none";
                      },5000)*/
                      accerror.classList.add("error_msg");
                      accerror.style.display = "block";
                    this.activeSections="A";
                }else{
                    accerror.style.display = "none";
                    accerror.classList.remove("error_msg");
                  
                    if(this.newCon == true){
                        const NameContact = this.template.querySelector('.newcontact2')
                    if(!NameContact.value){
                        NameContact.setCustomValidity("Please Fill The Last Name");
                        this.activeSections="B";
                        this.secBfield=false;

                        }else{
                        
                            NameContact.setCustomValidity("");
                            this.activeSections="C";
                            this.secBfield=true;
                                this.secAfield=true;
                                this.secCfield=false;
                            console.log("the value of active section C",this.activeSections)
                            if(this.activeSections==="C" && this.OpenSections.join(" ")==""){
                                this.secCfield=true;
                            }
              /*              if(this.activeSections==="C" && this.OpenSections.length !== 0){
                                this.secBfield=true;
                                this.secAfield=true;
                                this.secCfield=false;
                                console.log("Inside else of new con sec c")
                            }else{
                                this.secCfield=true;
                            }*/
                        }
                        NameContact.reportValidity();
                    }else if(this.existCon == true){
                        const ExistContact = this.template.querySelector('.conerrormsg')
                    if(!this.selectedConId){
               /*            ExistContact.classList.add("error_msg");
                        setTimeout(()=>{
                            ExistContact.style.display = "none";
                        },6000);*/
                        ExistContact.classList.add("error_msg");
                        ExistContact.style.display = "block";
                       //     this.secBfield=true;
                            this.secAfield=true;
                            this.activeSections="B"
                            this.secCfield=true;
                            this.secBfield=false;
                        }else{
                            ExistContact.style.display="none";
                            ExistContact.classList.remove("error_msg");
                            this.activeSections="C";
                            this.secBfield=true;
                            this.secAfield=true;
                            this.secCfield=false;
                console.log("the value of active section C",this.activeSections)
                if(this.activeSections==="C" && this.OpenSections.join(" ")==""){
                    this.secCfield=true;
                }
        /*        if(this.activeSections==="C" && this.OpenSections.length !== 0){
                    this.secBfield=true;
                    this.secAfield=true;
                    this.secCfield=false;
                }else{
                    this.secCfield=true;
                }*/
                        }
                    }
            }    
        }
        }
    }
    handleToggleSection(event){
        this.OpenSections = event.detail.openSections;
        console.log("On toggle",this.OpenSections.join(''));
        if(this.error==true){
            this.activeSections="A";
            console.log("On toggle of AB",this.OpenSections.join(''));
        }

        if(this.errorA==true){
            this.activeSections = "A";
            console.log("On toggle of A",this.OpenSections.join(''));
        }
          
        if(this.errorBC==true){
            this.activeSections="B"
            console.log("On toggle of BC",this.OpenSections.join(''));
        }
         if(this.errorAC==true){
             this.activeSections="A";
             console.log("On toggle of AC",this.OpenSections.join(''));
         }
    }

  /*  Thirdaccordian(){
        this.accordianName="Destination";
    }*/

    handleAccRecSelect(event) {
        console.log('selected record id from child component :::',  event.detail.Id);
        //console.log('eventDetail'+event.detail.id);
        this.defaultAccValue = event.detail.all;
        this.selectedAccId = event.detail.Id;
       this.selectedAccName=this.defaultAccValue.Name;
    }

    handleConRecSelect(event) {
        console.log('selected record id from child component :::', event.detail);
        this.defaultContValue = event.detail.all;
        this.selectedConId = event.detail.Id;
        this.selectedConName= this.defaultContValue.Name;
        console.log("contact name",this.selectedConName);
        console.log('inside cont'+this.selectedAccId);
        validateAccountRelatedContact({contactRcrdId :  this.selectedConId})
        .then(result => {
        console.log('Result'+result);
        this.accContValidation = result;
        this.error = undefined;
        console.log('msgg'+JSON.stringify(this.accContValidation));
        console.log('err'+this.error);
        if(this.accContValidation !== undefined){
          console.log('chkvalidation'+this.accContValidation[0].AccountId);
          if(this.selectedAccId != undefined){
            if(this.accContValidation[0].AccountId !== this.selectedAccId){
                console.log('ckAccidss');
                this.validateACcCont = false;
            }
          }
        }
    })
  .catch(error => {
        console.log('inside error');
        this.accContValidation = undefined;
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

    handleUserRecSelect(event){
       console.log("User",event.detail);
       this.selectedRecordId = event.detail.Id;
    }

    handleDestiRecSelect(event){
        console.log('Destination');
        this.defaultDestVal = event.detail.all;
        this.selectedDestId = this.defaultDestVal.Id;
        this.selectedDestName = this.defaultDestVal.Name;
        console.log('Desti name'+this.selectedDestName);
    }
    handleChangeOfAccRecord(event){
        this.AccRecordValue = event.detail.value;
        console.log("Onchange Acc Record Value",this.AccRecordValue);
    }
    handleChangeOfConRecordType(event){
        this.ConRecordValue = event.detail.value;
        console.log('On change Con Record value'+ this.ConRecordValue);
    }

     handleChangeOfDesRecordType(event){
        this.DesRecordValue = event.detail.value;
        console.log('DesRcrdType'+this.DesRecordValue);
    }


    modalclose(event){
        const auramodalclose = new CustomEvent('closemodal')
        this.dispatchEvent(auramodalclose);
    }
    
    closeModel(event){
        const auramodalclose = new CustomEvent('closemodal')
        this.dispatchEvent(auramodalclose);
    }
    
    handleNewRecInput(event) {
      
        switch (event.target.name) {
            case 'accName':
                console.log("Onchange Working")
                this.accountName = event.target.value;
                let NewAccount = this.template.querySelector('.newacc');
                if(NewAccount.value){
                    NewAccount.setCustomValidity("");
                }else{
                    NewAccount.setCustomValidity("Please Fill The New Account Field")
                }
                NewAccount.reportValidity();
                
                break;

             case 'totalName':
                 this.contactTotalName = this.contactFirstName +" "+ this.contactLastName;
                 console.log("Total Name",this.contactTotalName)
                 break;   

             case 'conTitle':
             this.conTitle = event.target.value;

             case 'conFirstName':
             this.contactFirstName=event.target.value;
             console.log("First NAme",this.contactFirstName);
             this.contactTotalName =this.contactFirstName +' '+this.contactLastName;
             console.log("Total Name of first",this.contactTotalName)

                 break;
            case 'conName':
                this.contactLastName = event.target.value;
                console.log('Last Name ',this.contactLastName);
                this.contactTotalName = this.contactFirstName+' '+this.contactLastName;
                console.log("Total Name last name",this.contactTotalName)
            const NameContact = this.template.querySelector('.newcontact2')
            if(!NameContact.value){
                NameContact.setCustomValidity("Please Fill The Last Name");
                this.activeSections="B";
            }else{
                NameContact.setCustomValidity("");
            }
            NameContact.reportValidity();
                break;
            case 'desName':
                this.destinationName = event.target.value;
                const NameDes = this.template.querySelector('.desContact')
                if(!NameDes.value){
                    NameDes.setCustomValidity("Please Fill The Last Name");
                    this.activeSections="C";
                }else{
                    NameDes.setCustomValidity("");
                }
                NameDes.reportValidity();
                
                break;
        }
        console.log('this.accountName :::', this.accountName);
        console.log('this.contactName :::', this.contactName);
        console.log('this.destinationName :::', this.destinationName);
    }


    disabledes(event){
        var checkbox = this.template.querySelector('.checkbox-D')
        console.log("onchange of des",checkbox)
        if(checkbox.hasAttribute('checked',"")){
            checkbox.removeAttribute('checked');
            this.desdisable=false;
            console.log("des not disable");
            this.desvar= false;
        }else{
            checkbox.setAttribute('checked','');
            this.desdisable=true;
            console.log("des disable")
            this.desvar= true;
        }
    }

    convertData(event) {
        console.log('accId'+this.selectedAccId);
        console.log('conId'+this.selectedConId);
        console.log('accName'+this.accountName);
        console.log('contName'+this.contactName);
        console.log('desName',this.destinationName);
        console.log('totalName',+this.contactTotalName)
        console.log('desId',this.selectedDestId)
        console.log("REcordId",this.selectedRecordId);
        var accVal = this.showAccSearchBar ? this.selectedAccId : this.accountName;
        var conVal = this.showConSearchBar ? this.selectedConId :  this.contactTotalName;
        if(this.desvar){
            this.DestinationValue = "";
            this.checkBoxDest=true;
            console.log("passing blank value")
        }else{
            this.DestinationValue = this.showDestSearchBar ? this.selectedDestId : this.destinationName ;
            console.log("Passing some value there")
            this.checkBoxDest=false;
        }
        console.log("The account data to move forward"+accVal);
        console.log("The contact data to move forward",accVal);


        if(this.newAcc == true){
            const NewAccount = this.template.querySelector('.newacc');
            if(!NewAccount.value){
                NewAccount.setCustomValidity("Please Fill The New Account Field");
                this.validateAccRecord = false;
            }else{
                NewAccount.setCustomValidity('');
                if(this.accRecordType.length>0){
                    let AccountRecord=this.template.querySelector(".accRecordClass");
                    if(! this.AccRecordValue){
                       AccountRecord.setCustomValidity("Please fill the Account Record Box");
                       this.validateAccRecord = false;
                       console.log("Error Occure at Account Record at convert",this.AccRecordValue)
                    }else{
                        AccountRecord.setCustomValidity("");
                        this.validateAccRecord = true;
                        console.log("Error Not Occure at Account Record at convert",this.AccRecordValue)
                    }
                    AccountRecord.reportValidity();
                }else{
                    this.validateAccRecord= true;
                }

            }
            NewAccount.reportValidity();
        }

        if(this.existAcc == true){
            const accerror = this.template.querySelector(".accerrormsg")
            if(! this.selectedAccId){
        /*      accerror.style.display = "block";
              console.log("apply set timout")
              setTimeout(()=>{
                accerror.style.display = "none";
              },5000)*/
              accerror.classList.add("error_msg");
              accerror.style.display = "block";
              this.validateAccRecord = false;
            }else{
                this.validateAccRecord=true;
            }
        }
    
  
        
        if(this.newCon==true){
            console.log('inside new con');
            this.validateACcCont = true;
            const NameContact = this.template.querySelector('.newcontact2')
            if(!NameContact.value){
                NameContact.setCustomValidity("Please Fill The Last Name");
                this.validateContRecord = false;
            }else{
                NameContact.setCustomValidity("");
                
        if(this.contRecordType.length>0){
            let ContactRecord = this.template.querySelector(".contRecordClass")
            if(! this.ConRecordValue){
               ContactRecord.setCustomValidity("Please fill the Contact Record Box")
               this.validateContRecord = false;   
               console.log("Error Occure at contact Record at convert",this.ConRecordValue)
               this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please Select The Contact Record Type',
                    variant: 'error',
                }),
            );

            }else{
                ContactRecord.setCustomValidity("")
                this.validateContRecord = true;
                console.log("Error Not Occure at contact Record at convert",this.ConRecordValue)
            }
            ContactRecord.reportValidity();
    }else{
        this.validateContRecord=true;
    }
            }
            NameContact.reportValidity();

        }

        if(this.existCon==true){
            console.log('exist cont');
            let ContactRecord = this.template.querySelector(".contRecordClass")
            ContactRecord.setCustomValidity("")
            ContactRecord.reportValidity();
            const ExistContact = this.template.querySelector('.conerrormsg')
            if(!this.selectedConId){
          /*      ExistContact.style.display = "block";
                setTimeout(()=>{
                    ExistContact.style.display = "none";
                },6000)*/
                ExistContact.classList.add("error_msg");
                ExistContact.style.display = "block";
                this.validateContRecord = false;
            }
            else{
                this.validateContRecord = true;
            }
            if(!this.validateACcCont){
                console.log('inside toast');
                const evt = new ShowToastEvent({
                    title: 'Specified Contact must be parented by specified Account',
                    message: '',
                    variant: 'error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);
            }
        }

       
        if(this.newDes==true){
            console.log('inside new Des');
            const NameDes= this.template.querySelector('.desContact')
            if(!NameDes.value){
                NameDes.setCustomValidity("Please Fill The Last Name");
                this.validateDestRecord = false;
            }else{
                NameDes.setCustomValidity("");
                if(this.destRecordType.length>0){
                    let DestRecord = this.template.querySelector(".destRecordClass")
                    if(! this.DesRecordValue){
                        DestRecord.setCustomValidity("Please fill the Destination Record Box");
                        this.validateDestRecord = false;
                        console.log("Error Occure at Destonation Record at convert",this.DesRecordValue)
                    }else{
                        DestRecord.setCustomValidity("");
                        this.validateDestRecord = true;
                        console.log("Error Not Occure at Destonation Record at convert",this.DesRecordValue)
                    }
                    DestRecord.reportValidity();
                }else{
                    this.validateDestRecord=true;
                }
            }
            NameDes.reportValidity();

         
        }

        if(this.existDes== true){
            const Deserror = this.template.querySelector(".Deserrormsg")
            if(! this.selectedDestId){
          /*    Deserror.style.display = "block";
              console.log("apply set timout")
              setTimeout(()=>{
                Deserror.style.display = "none";
              },5000)*/
              Deserror.classList.add("error_msg");
              Deserror.style.display = "block";
              this.validateDestRecord = false;
            }else{
                this.validateDestRecord=true;
                Deserror.classList.remove("error_msg");
                Deserror.style.display = "none";
            }
        }

     

        if(!this.selectedRecordId){
            const Record = this.template.querySelector('.Recorderrormsg')
    /*        Record.style.display = "block";
            setTimeout(()=>{
                Record.style.display = "none";
            },6000)*/
            Record.classList.add("error_msg");
            Record.style.display = "block";
            this.validateRecord = false;
        }
        else{
            const Record = this.template.querySelector('.Recorderrormsg')
            this.validateRecord = true;
            Record.classList.remove("error_msg");
            Record.style.display = "none";
        }
       

        console.log('validate'+this.validateRecord);
        console.log("validate record value ",this.validateAccRecord,this.validateContRecord,this.validateDestRecord)
        if(this.validateAccRecord && this.validateContRecord && this.validateDestRecord && this.validateRecord && this.validateACcCont){
            console.log('inside validate');
        var recData = {
            'Accounts': accVal,
            'Contacts': conVal,
            'Destination': this.DestinationValue,
            'AccRecordType':this.AccRecordValue,
            'ContRecordType':this.ConRecordValue,
            'DesRecordType':this.DesRecordValue,
            'RecordOwnerId' : this.selectedRecordId,
              'checkBoxDest' : this.checkBoxDest
        }

        console.log('rec'+JSON.stringify(recData));
        insertAccContOpp({conversionDataMap : recData,
                          currntRecordId : this.recordId,
                          objApiName : this.objectApiName})
        .then(result => {
            console.log('Result'+result);
            this.message = result;
            this.error = undefined;
            console.log('msgg'+JSON.stringify(this.message));
            console.log('err'+this.error);
            if(this.message !== undefined){
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
            console.log("Outside If");
            if(result != '' || result != undefined){
                console.log("Insdie If Of Convert")
        /*       console.log('result'+JSON.stringify(result[0]));
            
             
                AccNam.put(result[0].accObj);
                console.log('acccsd'+JSON.stringify(AccNam.Name));
                console.log("This name Outsideeeeee Name",this.convertAccName);
              
                console.log('acccsd'+JSON.stringify(AccNam));
                console.log('chck deploy');
                console.log('12=>'+AccNam.Name);
                var dummyAccData;
                for(var nr in result){
                    console.log('nrr'+nr);
                   // console.log('resds'+JSON.stringify(result[nr]));
                    console.log('accObj'+JSON.stringify(result[nr].accObj));
                    dummyAccData=JSON.stringify(result[nr].accObj);
                    console.log("Data of Acc Convert",dummyAccData);
                    break;

                    //console.log('destObj'+JSON.stringify(result[nr].contObj.Name));
                    //console.log('destObj'+JSON.stringify(result[nr].DestObj.Name));
                }
                console.log("Dummy aCcount before",dummyAccData);
                this.newConvertAccData = dummyAccData.Name;
                console.log("Dummy data value",this.newConvertAccData);
                for(var nv in result){
                    console.log('dataContact');
                    console.log('Cont'+JSON.stringify(result[nv].contObj));
                }
                for(var nd in result){
                    console.log('dest');
                    console.log('destObj'+JSON.stringify(result[nd].DestObj));
                  }
                     */

                  result.forEach((item)=>{
                    for(let key in item){

               var AccNam;
               var ContNam;
              

               AccNam = result[0].accObj;
               ContNam = result[1].contObj;
                        console.log("Keys",key);
                        if(key=="accObj"){
                            console.log("Inner Object",this.convertAccName);
                            console.log("Inside Acc")
                            for(let i in AccNam){
                      
                      console.log("Inner Keys of Acc",i);
                      //console.log("This name Outside Name",this.convertAccName);
                      console.log('chk deploy');
                      if(i=="Id"){
                          console.log('show Id');
                        this.showAccountId = AccNam.Id;
                      }
                      else if(i=="Name"){
                          console.log("inside name if");
                         
                        this.convertAccName=AccNam.Name; 
                           var accConvertName =AccNam.Name 
                           this.convertAccName=accConvertName;
                           console.log("This Name",this.convertAccName);
                         console.log("AccNAme");
                         console.log("Name Value",accConvertName);
                       }else if(i=="MobilePhone"){
                          this.convertAccPhone=AccNam.MobilePhone;
                       }else if(i=="Type"){
                              this.convertAccType =AccNam.Type; 
                       }else if(i=="Website"){
                           this.convertAccWebsite = AccNam.Website;
                       }else if(i=="Owner"){
                           this.convertAccOwnerName=AccNam.Owner.Name;
                           console.log("AccOwnername")
                       }else if(i=="Account Site"){
                          this.convertAccSite = AccNam.Site;
                       } 
                    }
                 }
                   if(key="contObj"){
                       console.log("Inside Contact")
                       for(let b in ContNam){ 
                           console.log("Inner Keys of contact",b)
                       if(b=="MobilePhone"){
                             this.convertContMPhone = ContNam.MobilePhone;
                         }
                         else if(b=="Id"){
                             this.convertContId = ContNam.Id;
                         }
                         else if(b == "Email"){
                             this.convertContEmail = ContNam.Email;
                         }else if(b=="Title"){
                             this.convertContTitle=ContNam.Title;
                         }else if(b=="Owner"){
                           this.convertContOwnerName=ContNam.Owner.Name;
                         }else if(b=="Phone"){
                             this.convertContPhone =ContNam.Phone;
                         }else if(b=="Name"){
                             this.convertContName=ContNam.Name; 
                         }else if(b=="Account"){
                             this.convertContAccName = ContNam.Account.Name;
                             this.convertContAccId = ContNam.Account.Id;
                         }
                       }
                   }
               if(this.desvar == false){
                 if(result[3].destinationName =="Opportunity"){  
                   if(key="DestObj"){
                     console.log("Inside of dest")
                     var DestNam;
                     DestNam = result[2].DestObj;
                     console.log("Destination", JSON.stringify(DestNam))
                     this.disableConvertDest = true;
                     this.disableConvertNotOpp=false;
                       for(let c in DestNam){
                           console.log("Ineer keys of dest",c)
                         if(c=="Owner"){
                             this.convertOppOwnerName=DestNam.Owner.Name;
                         }else if(c=="CloseDate"){
                             this.convertOppDate = DestNam.CloseDate;
                         }else if(c=="Amount"){
                             this.convertOppAmount = DestNam.Amount;
                         }else if(c=="Name"){
                             this.convertOppName=DestNam.Name;
                         }else if(c=="Id"){
                            this.convertOppId = DestNam.Id;
                         }
                       }
                   }
                }else{
                    if(key="DestObj"){
                        console.log("Inside of dest when not opportunity")
                        var DestNam;
                        DestNam = result[2].DestObj;
                        console.log("Destination", JSON.stringify(DestNam))
                        this.disableConvertDest = false;
                        this.disableConvertNotOpp=true;
                          for(let c in DestNam){
                              console.log("Ineer keys of dest",c)
                            if(c=="Owner"){
                                this.convertOppOwnerName=DestNam.Owner.Name;
                            }else if(c=="Name"){
                                this.convertOppName=DestNam.Name;
                            }else if(c=="Id"){
                                this.convertOppId = DestNam.Id;
                             }
                          }
                      }

                }
                }else{
                    this.disableConvertDest = false;
                }
          

            }
                }) 
       /*
                for(let key in result){
                if(key == "Contact"){
                    this.convertContName=result.Contact[0].Name;  
                  let contact = result.Contact[0];
                  console.log("contact Data",contact)
                 for(let key in contact){
                      if(key=="MobilePhone"){
                          this.convertContMPhone = result.Contact[0].MobilePhone;
                      }else if(key == "Email"){
                          this.convertContEmail = result.Contact[0].Email;
                      }else if(key=="Title"){
                          this.convertContTitle=result.Contact[0].Title;
                      }else if(key=="Owner"){
                        this.convertContOwnerName=result.Contact[0].Owner.Name;
                      }else if(key=="Phone"){
                          this.convertContPhone =result.Contact[0].Phone;
                      }
                  }
                }
                 if(key=="Account"){
                    this.convertAccName=result.Account[0].Name;   
                  let account = result.Account[0];
                  console.log("Account Data",account);
                  for(let key in account){
                     if(key=="MobilePhone"){
                          this.convertAccPhone=result.Account[0].MobilePhone;
                }else if(key=="Type"){
                       this.convertAccType = result.Account[0].Type; 
                }else if(key=="Website"){
                    this.convertAccWebsite= result.Account[0].Website;
                }
                else if(key=="Owner"){
                    this.convertAccOwnerName=result.Account[0].Owner.Name;
                }else if(key=="Account Site"){
                   this.convertAccSite = result.Account[0].Site;
                }
                  }
                }
             //    console.log("Index three",...result);
                if(key == "destinationObj"){
                    this.disableConvertDest = true;
                    this.convertOppName=result.destinationObj[0].Name;
                    let opp = result.destinationObj[0];
                    console.log("Opp Data",opp)

                    for(let key in opp){

                        if(key=="Owner"){
                            this.convertOppOwnerName=result.destinationObj[0].Owner.Name;
                        }else if(key=="Date"){
                            this.convertOppDate = result.destinationObj[0].Date;
                        }else if(key=="Account"){
                            this.convertOppAccount = result.destinationObj[0].Account;
                        }
                    }
                
                }else{
                    this.disableConvertDest = false;
                } 
            }
            
    */       


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

    }
    navigateToListView() {
        // Navigate to the Contact object's Recent list view.
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectApiName,
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
    navigateToAccRecordViewPage() {
        // View a custom object record.
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.showAccountId,
                objectApiName: 'account', // objectApiName is optional
                actionName: 'view'
            }
        });
    }

    navigateToContRecordViewPage() {
        // View a custom object record.
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.convertContId,
                objectApiName: 'contact', // objectApiName is optional
                actionName: 'view'
            }
        });
    }



    navigateToContAccRecordViewPage() {
        // View a custom object record.
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.convertContAccId,
                objectApiName: 'account', // objectApiName is optional
                actionName: 'view'
            }
        });
    }


    navigateToDestRecordViewPage() {
        // View a custom object record.
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.convertOppId,
                objectApiName: this.destinationApiName, // objectApiName is optional
                actionName: 'view'
            }
        });
    }

    navigateToNewTaskPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Task',
                actionName: 'new'
            }
        });
    }

}