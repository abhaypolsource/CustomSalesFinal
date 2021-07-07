/**
 * Description		:	This is a controller class of conversionMapping LWC page.
 * 
 * Created Date		:	17th May 2021
 * 
 * Created By		:	Saurabh Kumar
 * */
public class ConversionMappingController {
	
    /**
     * 	Description		:	This method is to invoke on init and get list of sobjects.
     * 
     *  @args			:
     * 
     *  @return			:	List of sobjects
     * 
     *  Revision Log	:	V1.0 Created by Saurabh Kumar
     * */
    @AuraEnabled(cacheable=true)
    public static ObjectandMappingDetails getObjects(){
        
        List<ObjectDetails> listOfObjectDetails = new List<ObjectDetails>();
        List<Object_Detail__c> objectDetailsList = Object_Detail__c.getAll().values();
        ObjectWrapperDetails mapDetailsFromCustSeting = new  ObjectWrapperDetails();
        if(objectDetailsList != null && objectDetailsList.size()>0 && objectDetailsList.size() == 1){
            mapDetailsFromCustSeting.destinationObjectApiName = objectDetailsList[0].Destination_Object_Api_Name__c;
            mapDetailsFromCustSeting.destinationObjectLabel = objectDetailsList[0].Destination_Object_Label__c;
            mapDetailsFromCustSeting.sourceObjectApiName = objectDetailsList[0].Sourcce_Object_Api_Name__c;
            mapDetailsFromCustSeting.sourceObjectLabel = objectDetailsList[0].Source_Object_Label__c;
        }
        for(Schema.DescribeSObjectResult describedObjectResult : MetaDataUtilities.objectsDescribe(false).values()){
            
            if(MetaDataUtilities.isObjectAccessible(describedObjectResult))
                listOfObjectDetails.add(new ObjectDetails(describedObjectResult.getLabel(), describedObjectResult.getName()));
        }
        System.debug(listOfObjectDetails);
        ObjectandMappingDetails objectMapDetail = new ObjectandMappingDetails();
        objectMapDetail.objectDetailsInfo = new List<ObjectDetails>();
        objectMapDetail.objectDetailsInfo.addAll(listOfObjectDetails);
        objectMapDetail.mappedObjectDetails = mapDetailsFromCustSeting;
        return objectMapDetail;
    }
    
    /**
     * 	Description		:	This method is to describe fields acccording to selected source and destination objects.
     * 
     *  @args			:	String sourceObjecct, String thirdDestinationObject
     * 
     *  @return			:	List of sobjects
     * 
     *  Revision Log	:	V1.0 Created by Saurabh Kumar
     * */
    @AuraEnabled(cacheable=true)
    public static FieldWrapperDetail getFields(String sourceObject, String destinationObject, Boolean isReset){

        List<Field_Detail__c> fieldDetailsList = new List<Field_Detail__c>();
        List<Object_Detail__c> objectDetailsList = Object_Detail__c.getAll().values();
        if(objectDetailsList != null && String.isNotBlank(sourceObject) && String.isNotBlank(destinationObject) && objectDetailsList.size()>0 && objectDetailsList.size() == 1 && objectDetailsList[0].Sourcce_Object_Api_Name__c.containsIgnoreCase(sourceObject) && objectDetailsList[0].Destination_Object_Api_Name__c.containsIgnoreCase(destinationObject)){
            fieldDetailsList = Field_Detail__c.getAll().values();
        }else{
            isReset = true;
        }
        Map<String, Field_Detail__c> fieldSourceKeyDetailMap = new Map<String, Field_Detail__c>();
        if(fieldDetailsList != null && fieldDetailsList.size()>0){
            for(Field_Detail__c fldInfo : fieldDetailsList){
                fieldSourceKeyDetailMap.put(fldInfo.Source_Field_Api_Name__c, fldInfo);
            }
        }
        
        if(String.isBlank(sourceObject) || String.isBlank(destinationObject) || sourceObject == destinationObject)
            return null;
        
        FieldWrapperDetail fwd = new FieldWrapperDetail();
        
        //List to hold field details to show on UI
        fwd.fieldWrappers = new List<FieldWrapper>();
        
        //Map to hold list of fields as per source,account,contact & deatination object
        Map<String, List<Schema.DescribeFieldResult>> describedFieldResultsByObjectName = new Map<String, List<Schema.DescribeFieldResult>>();
        
        //Describe Source, Account, Contact and third Destination object fields and fill in the map.
        for(String objectName : new Set<String> {Constants.SOBJECT_NAME_ACCOUNT, Constants.SOBJECT_NAME_CONTACT, destinationObject, sourceObject}){
        	
            for(Schema.DescribeFieldResult describedFieldResult : MetaDataUtilities.fieldsDescribe(objectName.toLowerCase()).values()){
            
                if(MetaDataUtilities.isFieldAccessible(describedFieldResult)){
                    
                    //Do not hold the field which should be skip from source or not updatable on destination side.
                    if( (objectName == sourceObject && Constants.SET_OF_FIELDS_TO_HIDE_FROM_SOURCE_FIELDS.contains(describedFieldResult.getName()))
                      	|| (objectName != sourceObject && !MetaDataUtilities.isFieldCreatable(describedFieldResult) ) )
                        continue;
                    
                    if(!describedFieldResultsByObjectName.containsKey(objectName))
                        describedFieldResultsByObjectName.put(objectName, new List<Schema.DescribeFieldResult>());
                    
                    describedFieldResultsByObjectName.get(objectName).add(describedFieldResult);
                    
                }
            }
        }

        
            
        
        //Process to fill field wrapper
        if(!describedFieldResultsByObjectName.containsKey(sourceObject))
            return fwd;
        
        for(Schema.DescribeFieldResult describedSourceFieldResult : describedFieldResultsByObjectName.get(sourceObject)){
            
            String sourceFieldSchemaType = String.valueOf(describedSourceFieldResult.getType());
            
            if(!Constants.MAP_OF_COMPATIBLE_DESTINATION_DATA_TYPES_WITH_SOURCE_DATA_TYPE.containsKey(sourceFieldSchemaType))
                continue;
            
            FieldWrapper fieldWrapper = new FieldWrapper();
            
            if(!Constants.SET_OF_FIELDS_TO_REMOVE_FROM_SOURCE_FIELDS.contains(describedSourceFieldResult.getName().toLowerCase())){
                //Source field detail
                fieldWrapper.sourceFieldLabel = describedSourceFieldResult.getLabel();
                fieldWrapper.sourceFieldApiName = describedSourceFieldResult.getName();
                fieldWrapper.sourceFieldType = String.valueOf(describedSourceFieldResult.getType());
                
            
            
                //Account field detail
                
                if(!isReset && fieldSourceKeyDetailMap != null && fieldSourceKeyDetailMap.size()>0 && fieldSourceKeyDetailMap.containsKey(describedSourceFieldResult.getName())){
                    fieldWrapper.selectedAccountFieldLabel = fieldSourceKeyDetailMap.get(describedSourceFieldResult.getName()).Account_Field_Label__c;
                    fieldWrapper.selectedAccountFieldApiName = fieldSourceKeyDetailMap.get(describedSourceFieldResult.getName()).Account_Field_Api_Name__c;
                }else{
                    fieldWrapper.selectedAccountFieldLabel = '';//Will be filling from custom setting
                    fieldWrapper.selectedAccountFieldApiName = '';//Will be filling from custom setting
                }
                fieldWrapper.accountFields = new List<FieldDetails>();
                fieldWrapper.requiredAccountFields = new List<FieldDetails>();
                fieldWrapper.requiredContactFields = new List<FieldDetails>();
                fieldWrapper.requiredDestinationFields = new List<FieldDetails>();
                fieldWrapper.allRequiredFields = new List<String>();
                
                for(Schema.DescribeFieldResult describedAccountFieldResult : describedFieldResultsByObjectName.get(Constants.SOBJECT_NAME_ACCOUNT)){
                    
                    String accountFieldSchemaType = String.valueOf(describedAccountFieldResult.getType());
                    if(!Constants.MAP_OF_COMPATIBLE_DESTINATION_DATA_TYPES_WITH_SOURCE_DATA_TYPE.get(sourceFieldSchemaType).contains(accountFieldSchemaType)
                    || describedAccountFieldResult.isAutoNumber() || describedAccountFieldResult.isCalculated())
                        continue;
                    fieldWrapper.accountFields.add(new FieldDetails(describedAccountFieldResult.getLabel(), describedAccountFieldResult.getName(), String.valueOf(describedAccountFieldResult.getType())));
                    
                    Boolean isFieldreq  = describedAccountFieldResult.isNillable(); 
                    if(!isFieldreq){
                        fieldWrapper.requiredAccountFields.add(new FieldDetails(describedAccountFieldResult.getLabel(), describedAccountFieldResult.getName()));
                        fieldWrapper.allRequiredFields.add(describedAccountFieldResult.getName());
                    }
                }
                
                //Contact field detail
                if(!isReset && fieldSourceKeyDetailMap != null && fieldSourceKeyDetailMap.size()>0 && fieldSourceKeyDetailMap.containsKey(describedSourceFieldResult.getName())){
                    fieldWrapper.selectedContactFieldLabel = fieldSourceKeyDetailMap.get(describedSourceFieldResult.getName()).Contact_Field_Label__c;
                    fieldWrapper.selectedContactFieldApiName = fieldSourceKeyDetailMap.get(describedSourceFieldResult.getName()).Contact_Field_Api_Name__c;
                }else{
                    fieldWrapper.selectedContactFieldLabel = '';//Will be filling from custom setting
                    fieldWrapper.selectedContactFieldApiName = '';//Will be filling from custom setting
                }
                //fieldWrapper.selectedContactFieldLabel = '';//Will be filling from custom setting
                //fieldWrapper.selectedContactFieldApiName = '';//Will be filling from custom setting
                fieldWrapper.contactFields = new List<FieldDetails>();
                for(Schema.DescribeFieldResult describedContactFieldResult : describedFieldResultsByObjectName.get(Constants.SOBJECT_NAME_CONTACT)){
                    
                    String contactFieldSchemaType = String.valueOf(describedContactFieldResult.getType());
                    if(!Constants.MAP_OF_COMPATIBLE_DESTINATION_DATA_TYPES_WITH_SOURCE_DATA_TYPE.get(sourceFieldSchemaType).contains(contactFieldSchemaType)
                    || describedContactFieldResult.isAutoNumber() || describedContactFieldResult.isCalculated())
                        continue;
                    fieldWrapper.contactFields.add(new FieldDetails(describedContactFieldResult.getLabel(), describedContactFieldResult.getName(), String.valueOf(describedContactFieldResult.getType())));
                    
                    Boolean isFieldreq  = describedContactFieldResult.isNillable(); 
                    if(!isFieldreq){
                        fieldWrapper.requiredContactFields.add(new FieldDetails(describedContactFieldResult.getLabel(), describedContactFieldResult.getName()));
                        fieldWrapper.allRequiredFields.add(describedContactFieldResult.getName());
                    }
                }
                
                //Destination field detail
                if(!isReset && fieldSourceKeyDetailMap != null && fieldSourceKeyDetailMap.size()>0 && fieldSourceKeyDetailMap.containsKey(describedSourceFieldResult.getName())){
                    fieldWrapper.selectedDestinationFieldLabel = fieldSourceKeyDetailMap.get(describedSourceFieldResult.getName()).Destination_Field_Label__c;
                    fieldWrapper.selectedDestinationFieldApiName = fieldSourceKeyDetailMap.get(describedSourceFieldResult.getName()).Destination_Field_Api_Name__c;
                }else{
                    fieldWrapper.selectedDestinationFieldLabel = '';//Will be filling from custom setting
                    fieldWrapper.selectedDestinationFieldApiName = '';//Will be filling from custom setting
                }
                //fieldWrapper.selectedDestinationFieldLabel = '';//Will be filling from custom setting
                //fieldWrapper.selectedDestinationFieldApiName = '';//Will be filling from custom setting
                fieldWrapper.destinationFields = new List<FieldDetails>();
                for(Schema.DescribeFieldResult describedDestinationFieldResult : describedFieldResultsByObjectName.get(destinationObject)){
                    
                    String destinationFieldSchemaType = String.valueOf(describedDestinationFieldResult.getType());
                    if(!Constants.MAP_OF_COMPATIBLE_DESTINATION_DATA_TYPES_WITH_SOURCE_DATA_TYPE.get(sourceFieldSchemaType).contains(destinationFieldSchemaType)
                    || describedDestinationFieldResult.isAutoNumber() || describedDestinationFieldResult.isCalculated())
                        continue;
                    fieldWrapper.destinationFields.add(new FieldDetails(describedDestinationFieldResult.getLabel(), describedDestinationFieldResult.getName(), String.valueOf(describedDestinationFieldResult.getType())));
                    
                    Boolean isFieldreq  = describedDestinationFieldResult.isNillable(); 
                    if(!isFieldreq || describedDestinationFieldResult.getName() == Constants.FIELD_NAME_NAME){
                        fieldWrapper.requiredDestinationFields.add(new FieldDetails(describedDestinationFieldResult.getLabel(), describedDestinationFieldResult.getName()));
                        fieldWrapper.allRequiredFields.add(describedDestinationFieldResult.getName());
                    }
                }
                
                fwd.fieldWrappers.add(fieldWrapper);
            }
        }
        fwd.accountRequiredFields = MetaDataUtilities.getAllRequiredFields(describedFieldResultsByObjectName.get(Constants.SOBJECT_NAME_ACCOUNT));
        fwd.contactRequiredFields = MetaDataUtilities.getAllRequiredFields(describedFieldResultsByObjectName.get(Constants.SOBJECT_NAME_CONTACT));
        fwd.destinationRequiredFields = MetaDataUtilities.getAllRequiredFields(describedFieldResultsByObjectName.get(destinationObject));
        fwd.compatibleDataType = new Map<String, List<String>>();
        for(String dataType : Constants.MAP_OF_COMPATIBLE_DESTINATION_DATA_TYPES_WITH_SOURCE_DATA_TYPE.keySet()){
            List<String> compatibleDataType = new List<String>();
            compatibleDataType.addAll(Constants.MAP_OF_COMPATIBLE_DESTINATION_DATA_TYPES_WITH_SOURCE_DATA_TYPE.get(dataType));
            fwd.compatibleDataType.put(dataType,compatibleDataType);
        }
        //fwd.compatibleDataType.pushAll();
        fwd.childObjectsList = new List<ChildObjectDetails>();
        List<ChildObjectDetails> childObjectsList = getChildRelationshipObject(sourceObject, destinationObject, isReset);
        System.debug('childObjectsList----'+JSON.serialize(childObjectsList));
        fwd.childObjectsList.addAll(childObjectsList);
        System.debug('fwd.childObjectsList----'+JSON.serialize(fwd.childObjectsList));
        
        return fwd;
    }

    /**
     * 	Description		:	This method is to describe the child objects acccording to selected source, Account, Contact and destination objects.
     * 
     *  @args			:	String sourceObjecct, String thirdDestinationObject
     * 
     *  @return			:	List of sobjects
     * 
     *  Revision Log	:	V1.0 Created by Tarun Goyal
     * */
    public static List<ChildObjectDetails> getChildRelationshipObject(String sourceObject, String destinationObject, Boolean isReset){
        List<ChildObjectDetails> childObjectsList = new List<ChildObjectDetails>();
        List<Related_Object_Details__c> relatedObjectDetailsList = Related_Object_Details__c.getAll().values();
        Map<String, Related_Object_Details__c> relatedObjectDetailsMap = new Map<String, Related_Object_Details__c>();
        for(Related_Object_Details__c reletedObjectRec : relatedObjectDetailsList){
            relatedObjectDetailsMap.put(reletedObjectRec.Related_Object_API_Name__c, reletedObjectRec);
        }
        
        if(String.isNotBlank(sourceObject) && String.isNotBlank(destinationObject)){
            
            SObjectType sourceObjectType = Schema.getGlobalDescribe().get(sourceObject);
            SObjectType destinationObjectType = Schema.getGlobalDescribe().get(destinationObject);
            SObjectType accountObjectType = Schema.getGlobalDescribe().get(Constants.SOBJECT_NAME_ACCOUNT);
            SObjectType contactObjectType = Schema.getGlobalDescribe().get(Constants.SOBJECT_NAME_CONTACT);
            
            Map<String, Schema.SObjectType> globalSchema = Schema.getGlobalDescribe();
            Map<String, Schema.DescribeSObjectResult> describedSObjectResults = new Map<String, Schema.DescribeSObjectResult>();

            Map<String,String> sourceObjectApiLabelMap = new Map<String,String>();
            Map<String,String> destinationObjectApiLabelMap = new Map<String,String>();
            Map<String,String> accountObjectApiLabelMap = new Map<String,String>();
            Map<String,String> contactsourceObjectApiLabelMap = new Map<String,String>();
            
            for(String sobjectName : globalSchema.keySet()){
                Schema.DescribeSObjectResult describedSObjectResult = globalSchema.get(sobjectName).getDescribe();
                if((!Constants.SET_OF_ALLOWED_RELATED_STANDARD_SOBJECTS.contains(sobjectName) && !describedSObjectResult.isCustom()))
				    continue;
                describedSObjectResults.put(sobjectName, describedSObjectResult);
            }
            for ( ChildRelationship childObject: sourceObjectType.getDescribe().getChildRelationships() )  {
                String childObjectName = string.valueOf( childObject.getChildSObject()).toLowerCase(); 
                if(String.isNotBlank(childObjectName) && describedSObjectResults.containsKey(childObjectName)){
                    if(MetaDataUtilities.isObjectAccessible(describedSObjectResults.get(childObjectName))){
                        sourceObjectApiLabelMap.put(describedSObjectResults.get(childObjectName).getName(), describedSObjectResults.get(childObjectName).getLabel());
                    }    
                }
            }
            for ( ChildRelationship childObject: destinationObjectType.getDescribe().getChildRelationships() )  {
                system.debug( string.valueOf( childObject.getChildSObject() ) ); 
                String childObjectName = string.valueOf( childObject.getChildSObject()).toLowerCase();
                if(String.isNotBlank(childObjectName) && describedSObjectResults.containsKey(childObjectName)){
                    if(MetaDataUtilities.isObjectAccessible(describedSObjectResults.get(childObjectName))){
                        destinationObjectApiLabelMap.put(describedSObjectResults.get(childObjectName).getName(), describedSObjectResults.get(childObjectName).getLabel());
                    }    
                }
            }

            for ( ChildRelationship childObject: accountObjectType.getDescribe().getChildRelationships() )  {
                system.debug( string.valueOf( childObject.getChildSObject() ) ); 
                String childObjectName = string.valueOf( childObject.getChildSObject()).toLowerCase();
                if(String.isNotBlank(childObjectName) && describedSObjectResults.containsKey(childObjectName)){
                    if(MetaDataUtilities.isObjectAccessible(describedSObjectResults.get(childObjectName))){
                        accountObjectApiLabelMap.put(describedSObjectResults.get(childObjectName).getName(), describedSObjectResults.get(childObjectName).getLabel());
                    }    
                }
            }
            for ( ChildRelationship childObject: contactObjectType.getDescribe().getChildRelationships() )  {
                system.debug( string.valueOf( childObject.getChildSObject() ) ); 
                String childObjectName = string.valueOf( childObject.getChildSObject()).toLowerCase();
                if(String.isNotBlank(childObjectName) && describedSObjectResults.containsKey(childObjectName)){
                    if(MetaDataUtilities.isObjectAccessible(describedSObjectResults.get(childObjectName))){
                        contactsourceObjectApiLabelMap.put(describedSObjectResults.get(childObjectName).getName(), describedSObjectResults.get(childObjectName).getLabel());
                    }    
                }
            }
            system.debug('sourceObjectApiLabelMap'+sourceObjectApiLabelMap);
            if(sourceObjectApiLabelMap != null && sourceObjectApiLabelMap.size()>0){
                for(String sourceChildObj : sourceObjectApiLabelMap.keySet()){
                    ChildObjectDetails childObjRec = new ChildObjectDetails();
                    childObjRec.label = sourceObjectApiLabelMap.get(sourceChildObj);
                    childObjRec.value = sourceChildObj;
                    childObjRec.objectNotExistsInAccount = accountObjectApiLabelMap!= null && accountObjectApiLabelMap.size()>0 && accountObjectApiLabelMap.containsKey(sourceChildObj) ? false : true;
                    childObjRec.objectNotExistsInContact = contactsourceObjectApiLabelMap!= null && contactsourceObjectApiLabelMap.size()>0 && contactsourceObjectApiLabelMap.containsKey(sourceChildObj) ? false : true;
                    childObjRec.objectNotExistsInDestination = destinationObjectApiLabelMap!= null && destinationObjectApiLabelMap.size()>0 && destinationObjectApiLabelMap.containsKey(sourceChildObj) ? false : true;
                    childObjRec.isAccountChecked = !isReset && relatedObjectDetailsMap != null && relatedObjectDetailsMap.size()>0 && relatedObjectDetailsMap.containsKey(sourceChildObj) ? relatedObjectDetailsMap.get(sourceChildObj).Selected_On_Account__c : false;
                    childObjRec.isContactChecked = !isReset && relatedObjectDetailsMap != null && relatedObjectDetailsMap.size()>0 && relatedObjectDetailsMap.containsKey(sourceChildObj) ? relatedObjectDetailsMap.get(sourceChildObj).Selected_On_Contact__c : false;
                    childObjRec.isDestinationChecked = !isReset && relatedObjectDetailsMap != null && relatedObjectDetailsMap.size()>0 && relatedObjectDetailsMap.containsKey(sourceChildObj) ? relatedObjectDetailsMap.get(sourceChildObj).Selected_On_Destination__c : false;
                    childObjRec.destinationReferenceFields = '';
                    childObjRec.accountReferenceFields = '';
                    childObjRec.contactReferenceFields = '';
                    if(!childObjRec.objectNotExistsInAccount || ! childObjRec.objectNotExistsInContact || !childObjRec.objectNotExistsInDestination){
                        for(Schema.DescribeFieldResult describedFieldResult : MetaDataUtilities.fieldsDescribe(sourceChildObj.toLowerCase()).values()){
    
                            if(MetaDataUtilities.isFieldAccessible(describedFieldResult) && String.valueOf(describedFieldResult.getType()).toLowerCase()==Constants.FIELD_SCHEMA_TYPE_REFERENCE.toLowerCase()){
                                List<String> objectName = new List<String>(); 
                                for(Schema.sObjectType objName : describedFieldResult.getReferenceTo()){
                                    objectName.add(String.valueOf(objName));
                                }
                                if(objectName.contains(destinationObject.capitalize())){
                                    childObjRec.destinationReferenceFields = childObjRec.destinationReferenceFields + String.valueOf(describedFieldResult.getName()) + ',';
                                }
                                if(objectName.contains(Constants.SOBJECT_NAME_ACCOUNT.capitalize())){
                                    childObjRec.accountReferenceFields = childObjRec.accountReferenceFields + String.valueOf(describedFieldResult.getName()) + ',';
                                }
                                if(objectName.contains(Constants.SOBJECT_NAME_CONTACT.capitalize())){
                                    childObjRec.contactReferenceFields = childObjRec.contactReferenceFields + String.valueOf(describedFieldResult.getName()) + ',';
                                }
                            }
                        }
                        if(String.isNotBlank(childObjRec.destinationReferenceFields)){
                            childObjRec.destinationReferenceFields = childObjRec.destinationReferenceFields.removeEnd(',');
                        }
                        if(String.isNotBlank(childObjRec.accountReferenceFields)){
                            childObjRec.accountReferenceFields = childObjRec.accountReferenceFields.removeEnd(',');
                        }
                        if(String.isNotBlank(childObjRec.contactReferenceFields)){
                            childObjRec.contactReferenceFields = childObjRec.contactReferenceFields.removeEnd(',');
                        }
                        childObjectsList.add(childObjRec);
                    }
                }
            }
            system.debug('childObjectsList----===='+childObjectsList);
            ChildObjectDetails childObjRec = new ChildObjectDetails();
            childObjRec.label = Constants.SOBJECT_NAME_FILE;
            childObjRec.value = Constants.SOBJECT_NAME_FILE;
            childObjRec.objectNotExistsInAccount = false;
            childObjRec.objectNotExistsInContact = false;
            childObjRec.objectNotExistsInDestination = false;
            childObjRec.isAccountChecked = !isReset && relatedObjectDetailsMap != null && relatedObjectDetailsMap.size()>0 && relatedObjectDetailsMap.containsKey(Constants.SOBJECT_NAME_FILE) ? relatedObjectDetailsMap.get(Constants.SOBJECT_NAME_FILE).Selected_On_Account__c : false;
            childObjRec.isContactChecked = !isReset && relatedObjectDetailsMap != null && relatedObjectDetailsMap.size()>0 && relatedObjectDetailsMap.containsKey(Constants.SOBJECT_NAME_FILE) ? relatedObjectDetailsMap.get(Constants.SOBJECT_NAME_FILE).Selected_On_Contact__c : false;
            childObjRec.isDestinationChecked = !isReset && relatedObjectDetailsMap != null && relatedObjectDetailsMap.size()>0 && relatedObjectDetailsMap.containsKey(Constants.SOBJECT_NAME_FILE) ? relatedObjectDetailsMap.get(Constants.SOBJECT_NAME_FILE).Selected_On_Destination__c : false;
            childObjectsList.add(childObjRec);
        }
        return childObjectsList;
    }

    
    
    /**
     * 	Description		:	This method is used to save user input/configuration in custom metadata type
     * 
     *  @args			:	String sourceObjecct, String thirdDestinationObject
     * 
     *  @return			:	List of sobjects
     * 
     *  Revision Log	:	V1.0 Created by Saurabh Kumar
     * */
    @AuraEnabled
    public static String onSave(String objectMapping, String fieldMapping, String relatedChilObjectMapping){
        try{
            System.debug('objectMapping '+objectMapping);
            System.debug('fieldMapping '+fieldMapping);


            List<Field_Detail__c> fieldDetailsList = Field_Detail__c.getAll().values();
            List<Object_Detail__c> objectDetailsList = Object_Detail__c.getAll().values();
            List<Related_Object_Details__c> relatedObjectDetailsList = Related_Object_Details__c.getAll().values();

            if(fieldDetailsList != null && fieldDetailsList.size()>0){
                delete fieldDetailsList;
            }
            if(objectDetailsList != null && objectDetailsList.size()>0){
                delete objectDetailsList;
            }
            if(relatedObjectDetailsList != null && relatedObjectDetailsList.size()>0){
                delete relatedObjectDetailsList;
            }

            String sourceObject = '';
            String destinationObject='';
            
            if(String.isNotBlank(objectMapping)){
                ObjectWrapperDetails objectApiLabelDetails = (ObjectWrapperDetails)JSON.deserialize(objectMapping, ObjectWrapperDetails.class);
                sourceObject = objectApiLabelDetails.sourceObjectApiName;
                destinationObject = objectApiLabelDetails.destinationObjectApiName;
                Object_Detail__c objectRecDetail = new Object_Detail__c();
                objectRecDetail.Name = 'ObjectMapping';
                objectRecDetail.Destination_Object_Api_Name__c = objectApiLabelDetails.destinationObjectApiName;
                objectRecDetail.Destination_Object_Label__c = objectApiLabelDetails.destinationObjectLabel;
                objectRecDetail.Sourcce_Object_Api_Name__c = objectApiLabelDetails.sourceObjectApiName;
                objectRecDetail.Source_Object_Label__c = objectApiLabelDetails.sourceObjectLabel;
                insert objectRecDetail;
            }
            if(String.isNotBlank(fieldMapping)){
                List<FieldWrapperDetails> fieldAPILabelDataList = (List<FieldWrapperDetails>)JSON.deserialize(fieldMapping, List<FieldWrapperDetails>.class);
                List<Field_Detail__c> fieldInfoList = new List<Field_Detail__c>();
                Integer i =0;
                for(FieldWrapperDetails fieldAPILabelData : fieldAPILabelDataList){
                    Field_Detail__c fieldInfoRec = new Field_Detail__c();
                    fieldInfoRec.Name = 'FieldMapping'+i;
                    i++;
                    fieldInfoRec.Account_Field_Api_Name__c = fieldAPILabelData.accountFieldApiName;
                    fieldInfoRec.Account_Field_Label__c = fieldAPILabelData.accountFieldLabel;
                    fieldInfoRec.Contact_Field_Api_Name__c = fieldAPILabelData.contactFieldApiName;
                    fieldInfoRec.Contact_Field_Label__c = fieldAPILabelData.contactFieldLabel;
                    fieldInfoRec.Destination_Field_Api_Name__c = fieldAPILabelData.destinationFieldApiName;
                    fieldInfoRec.Destination_Field_Label__c = fieldAPILabelData.destinationFieldLabel;
                    fieldInfoRec.Source_Field_Api_Name__c = fieldAPILabelData.sourceFieldApiName;
                    fieldInfoRec.Source_Field_Label__c = fieldAPILabelData.sourceFieldLabel;
                    fieldInfoList.add(fieldInfoRec);
                }
                if(fieldInfoList != null && fieldInfoList.size()>0){
                    insert fieldInfoList;
                }
            }
            if(String.isNotBlank(relatedChilObjectMapping)){
                System.debug('relatedChilObjectMapping---===='+relatedChilObjectMapping);
                List<RelatedObjectWrapperDetails> relatedObjectAPILabelDataList = (List<RelatedObjectWrapperDetails>)JSON.deserialize(relatedChilObjectMapping, List<RelatedObjectWrapperDetails>.class);
                List<Related_Object_Details__c> relatedObjectInfoList = new List<Related_Object_Details__c>();
                Integer i =0;
                for(RelatedObjectWrapperDetails relatedObjectAPILabelData : relatedObjectAPILabelDataList){
                    Related_Object_Details__c relatedObjectInfoRec = new Related_Object_Details__c();
                    relatedObjectInfoRec.Name = 'RelatedObjectMapping'+i;
                    i++;
                    relatedObjectInfoRec.Related_Object_API_Name__c = relatedObjectAPILabelData.sourceFieldApiName;
                    relatedObjectInfoRec.Related_Object_Label__c = relatedObjectAPILabelData.sourceFieldLabel;
                    relatedObjectInfoRec.Selected_On_Account__c = relatedObjectAPILabelData.accountCheckBoxSelect != null ? relatedObjectAPILabelData.accountCheckBoxSelect : false;
                    relatedObjectInfoRec.Selected_On_Contact__c = relatedObjectAPILabelData.contactCheckBoxSelect != null ? relatedObjectAPILabelData.contactCheckBoxSelect : false;
                    relatedObjectInfoRec.Selected_On_Destination__c = relatedObjectAPILabelData.destinationCheckBoxSelect != null ? relatedObjectAPILabelData.destinationCheckBoxSelect : false;
                    if(relatedObjectInfoRec.Selected_On_Account__c || relatedObjectInfoRec.Selected_On_Contact__c || relatedObjectInfoRec.Selected_On_Destination__c){
                        if(String.isNotBlank(relatedObjectAPILabelData.accountReferenceFields)){
                            relatedObjectInfoRec.Account_Reference_Field__c = relatedObjectAPILabelData.accountReferenceFields;
                        }
                        if(String.isNotBlank(relatedObjectAPILabelData.contactReferenceFields)){
                            relatedObjectInfoRec.Contact_Reference_Field__c = relatedObjectAPILabelData.contactReferenceFields;
                        }
                        if(String.isNotBlank(relatedObjectAPILabelData.destinationReferenceFields)){
                            relatedObjectInfoRec.Destination_Reference_Field__c = relatedObjectAPILabelData.destinationReferenceFields;
                        }
                        relatedObjectInfoList.add(relatedObjectInfoRec);
                    }
                }
                if(relatedObjectInfoList != null && relatedObjectInfoList.size()>0){
                    insert relatedObjectInfoList;
                }
            }
            System.debug('onSave '+fieldMapping);
            List<ChildObjectDetails> childObjectsList = new List<ChildObjectDetails>(); 
            FieldWrapperDetail fieldWrapDetails = new FieldWrapperDetail();
            if(String.isNotBlank(sourceObject) && String.isNotBlank(destinationObject) ){
                fieldWrapDetails = getFields(sourceObject, destinationObject, false);
                //childObjectsList = getChildRelationshipObject(sourceObject, destinationObject, false);
            }
            
            System.debug('objectMapping '+objectMapping);
            return JSON.serialize(fieldWrapDetails);
            //return 'Mapping Successfully Saved';
        }catch(Exception ex){
            system.debug('Error while creating modifying custom metadata.');
            system.debug('exception==--'+ex.getStackTraceString());
            system.debug('exception==--'+ex.getMessage());
            return 'Error Occurs While Saving Mapping Records';
        }
    }

    public class ObjectWrapperDetails{
        @AuraEnabled public String destinationObjectApiName{get;set;}
        @AuraEnabled public String destinationObjectLabel{get;set;}
        @AuraEnabled public String sourceObjectApiName{get;set;}
        @AuraEnabled public String sourceObjectLabel{get;set;}
    }
    
    public class FieldWrapperDetails{
        public String sourceFieldLabel;
        public String sourceFieldApiName;
        public String accountFieldLabel;
        public String accountFieldApiName;
        public String contactFieldApiName;
        public String contactFieldLabel;
        public String destinationFieldApiName;
        public String destinationFieldLabel;
    }

    public class RelatedObjectWrapperDetails{
        public String sourceFieldLabel;
        public String sourceFieldApiName;
        public Boolean accountCheckBoxSelect;
        public Boolean contactCheckBoxSelect;
        public Boolean destinationCheckBoxSelect;
        public String accountReferenceFields;
        public String contactReferenceFields;
        public String destinationReferenceFields;
    }

    //Wrapper class to hold related objects data
    public class ChildObjectDetails{
        
        @AuraEnabled public String label{get;set;}
        @AuraEnabled public String value{get;set;}
        @AuraEnabled public Boolean objectNotExistsInAccount{get;set;}
        @AuraEnabled public Boolean objectNotExistsInContact{get;set;}
        @AuraEnabled public Boolean objectNotExistsInDestination{get;set;}
        @AuraEnabled public Boolean isAccountChecked{get;set;}
        @AuraEnabled public Boolean isContactChecked{get;set;}
        @AuraEnabled public Boolean isDestinationChecked{get;set;}
        @AuraEnabled public String destinationReferenceFields{get;set;}
        @AuraEnabled public String accountReferenceFields{get;set;}
        @AuraEnabled public String contactReferenceFields{get;set;}
        
        public ChildObjectDetails(){}
        
        public ChildObjectDetails(String label, String value, Boolean objectNotExistsInAccount, Boolean objectNotExistsInContact, Boolean objectNotExistsInDestination){
            
            this.label = label;
            this.value = value;
            this.objectNotExistsInAccount = objectNotExistsInAccount;
            this.objectNotExistsInContact = objectNotExistsInContact;
            this.objectNotExistsInDestination = objectNotExistsInDestination;
        }
    }

    //Wrapper class to hold all described objects to display on the page and mapping info if exists
    public class ObjectandMappingDetails{
        @AuraEnabled public List<ObjectDetails> objectDetailsInfo{get;set;}
        @AuraEnabled public ObjectWrapperDetails mappedObjectDetails{get;set;}
    }
    //Wrapper class to hold all described objects to display on the page
    public class ObjectDetails{
        
        @AuraEnabled public String label{get;set;}
        @AuraEnabled public String value{get;set;}
        
        public ObjectDetails(String label, String value){
            
            this.label = label;
            this.value = value;
        }        
    }
    
    //Wrapper class to hold described field details
    public class FieldDetails{
        
        @AuraEnabled public String label{get;set;}
        @AuraEnabled public String value{get;set;}
        @AuraEnabled public String type{get;set;}
        
        public FieldDetails(){}
        
        public FieldDetails(String label, String value){
            
            this.label = label;
            this.value = value;
        }

        public FieldDetails(String label, String value, String type){
            
            this.label = label;
            this.value = value;
            this.type = type;
        }
    }
    
    //Field wrapper to hold source field and corresponding to destination fields
    public class FieldWrapper{
        
        @AuraEnabled public String sourceFieldLabel {get;set;}
        @AuraEnabled public String sourceFieldApiName {get;set;}
        @AuraEnabled public String sourceFieldType {get;set;}
        
        @AuraEnabled public String selectedAccountFieldLabel {get;set;}
        @AuraEnabled public String selectedAccountFieldApiName {get;set;}
        @AuraEnabled public Boolean isAccountFieldRequired {get;set;}
        @AuraEnabled public List<FieldDetails> accountFields {get;set;}
        @AuraEnabled public List<FieldDetails> requiredAccountFields {get;set;}
        
        @AuraEnabled public String selectedContactFieldLabel {get;set;}
        @AuraEnabled public String selectedContactFieldApiName {get;set;}
        @AuraEnabled public Boolean isContactFieldRequired {get;set;}
        @AuraEnabled public List<FieldDetails> contactFields {get;set;}
        @AuraEnabled public List<FieldDetails> requiredContactFields {get;set;}
        
        @AuraEnabled public String selectedDestinationFieldLabel {get;set;}
        @AuraEnabled public String selectedDestinationFieldApiName {get;set;}
        @AuraEnabled public Boolean isDestinationFieldRequired {get;set;}
        @AuraEnabled public List<FieldDetails> destinationFields {get;set;}
        @AuraEnabled public List<FieldDetails> requiredDestinationFields {get;set;}

        @AuraEnabled public List<String> allRequiredFields {get;set;}

        
    }
    
    public class FieldWrapperDetail{
        
        @AuraEnabled public List<FieldWrapper> fieldWrappers {get;set;}
        @AuraEnabled public Set<String> accountRequiredFields {get;set;}
        @AuraEnabled public Set<String> contactRequiredFields {get;set;}
        @AuraEnabled public Set<String> destinationRequiredFields {get;set;}
        @AuraEnabled public List<ChildObjectDetails> childObjectsList {get;set;}
        @AuraEnabled public Map<String,List<String>> compatibleDataType {get;set;}
    }
}