/**
 * Description		:	This is used to hold contstants variables.
 * 
 * Created Date		:	18th May 2021
 * 
 * Created By		:	Saurabh Kumar
 * */
public class Constants {
	
    //Sobject Api Names
    public static final String SOBJECT_NAME_ACCOUNT = 'Account';
    public static final String SOBJECT_NAME_CONTACT = 'Contact';
    public static final String SOBJECT_NAME_LEAD = 'Lead';
    public static final String SOBJECT_NAME_OPPORTUNITY = 'Opportunity';
    public static final String SOBJECT_NAME_Field_Detail = 'Field_Detail__c';
    public static final String SOBJECT_NAME_Object_Detail = 'Object_Detail__c';
    public static final String SOBJECT_NAME_RELATED_OBJECT_DETAIL = 'Related_Object_Details__c';

    //Related Sobject Api Names
    public static final String SOBJECT_NAME_TASK = 'Task';
    public static final String SOBJECT_NAME_EVENT = 'Event';
    public static final String SOBJECT_NAME_NOTE = 'Note';
    public static final String SOBJECT_NAME_ATTACHMENT = 'Attachment';
    public static final String SOBJECT_NAME_FILE = 'File';
    
    //Standard field Api Names
    public static final String FIELD_NAME_ISDELETED = 'IsDeleted';
    public static final String FIELD_NAME_MASTERRECORDID = 'MasterRecordId';
    public static final String FIELD_NAME_SYSTEMMODSTAMP = 'SystemModStamp';
    public static final String FIELD_NAME_LASTACTIVITYDATE = 'LastActivityDate';
    public static final String FIELD_NAME_LASTVIEWEDDATE = 'LastViewedDate';
    public static final String FIELD_NAME_LASTREFERENCEDDATE = 'LastReferencedDate';
    public static final String FIELD_NAME_RECORDID = 'Id';
    public static final String FIELD_NAME_CREATEDDATE = 'CreatedDate';
    public static final String FIELD_NAME_CREATEDBYID = 'CreatedById';
    public static final String FIELD_NAME_LASTMODIFIEDBYID = 'LastModifiedById';
    public static final String FIELD_NAME_LASTMODIFIEDDATE = 'LastModifiedDate';
    public static final String FIELD_NAME_OWNEREID = 'OwnerId';
    public static final String FIELD_NAME_NAME = 'Name';
    
    //Field schema types
    public static final String FIELD_SCHEMA_TYPE_ID = 'ID';
    public static final String FIELD_SCHEMA_TYPE_BOOLEAN = 'BOOLEAN';
    public static final String FIELD_SCHEMA_TYPE_REFERENCE = 'REFERENCE';
    public static final String FIELD_SCHEMA_TYPE_STRING = 'STRING';
    public static final String FIELD_SCHEMA_TYPE_PICKLIST = 'PICKLIST';
    public static final String FIELD_SCHEMA_TYPE_PHONE = 'PHONE';
    public static final String FIELD_SCHEMA_TYPE_CURRENCY = 'CURRENCY';
    public static final String FIELD_SCHEMA_TYPE_PERCENT = 'PERCENT';
    public static final String FIELD_SCHEMA_TYPE_MULTIPICKLIST = 'MULTIPICKLIST';
    public static final String FIELD_SCHEMA_TYPE_ENCRYPTEDSTRING = 'ENCRYPTEDSTRING';
    public static final String FIELD_SCHEMA_TYPE_TIME = 'TIME';
    public static final String FIELD_SCHEMA_TYPE_DATETIME = 'DATETIME';
    public static final String FIELD_SCHEMA_TYPE_DATE = 'DATE';
    public static final String FIELD_SCHEMA_TYPE_EAMIL =  'EMAIL';
    public static final String FIELD_SCHEMA_TYPE_DOUBLE = 'DOUBLE';
    public static final String FIELD_SCHEMA_TYPE_INTEGER = 'INTEGER';
    public static final String FIELD_SCHEMA_TYPE_ADDRESS = 'ADDRESS';
    public static final String FIELD_SCHEMA_TYPE_TEXT = 'TEXT';
    public static final String FIELD_SCHEMA_TYPE_TEXTAREA = 'TEXTAREA';
    public static final String FIELD_SCHEMA_TYPE_URL = 'URL';
    
    //Set to hold allowed standard sobject names
    public static Set<String> SET_OF_ALLOWED_RELATED_STANDARD_SOBJECTS = new Set<String> {SOBJECT_NAME_TASK.toLowerCase(), SOBJECT_NAME_EVENT.toLowerCase(), SOBJECT_NAME_NOTE.toLowerCase(), SOBJECT_NAME_ATTACHMENT.toLowerCase()};
    public static Set<String> SET_OF_ALLOWED_STANDARD_SOBJECTS = new Set<String> {SOBJECT_NAME_LEAD.toLowerCase(), SOBJECT_NAME_OPPORTUNITY.toLowerCase()};
    public static Set<String> SET_OF_OBJECTS_TO_HIDE = new Set<String>{SOBJECT_NAME_Field_Detail.toLowerCase(), SOBJECT_NAME_Object_Detail.toLowerCase(), SOBJECT_NAME_RELATED_OBJECT_DETAIL.toLowerCase()};
    //Map to hold set of compatible destination data types by source data type
    public static final Map<String, Set<String>> MAP_OF_COMPATIBLE_DESTINATION_DATA_TYPES_WITH_SOURCE_DATA_TYPE = new Map<String, Set<String>> 
    	{FIELD_SCHEMA_TYPE_ID => new Set<String>{FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_BOOLEAN => new Set<String>{FIELD_SCHEMA_TYPE_BOOLEAN, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_REFERENCE => new Set<String> {FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_STRING => new Set<String> {FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_PICKLIST => new Set<String> {FIELD_SCHEMA_TYPE_PICKLIST, FIELD_SCHEMA_TYPE_MULTIPICKLIST, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING}, 
         FIELD_SCHEMA_TYPE_PHONE => new Set<String> {FIELD_SCHEMA_TYPE_PHONE, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_CURRENCY => new Set<String> {FIELD_SCHEMA_TYPE_CURRENCY, FIELD_SCHEMA_TYPE_DOUBLE, FIELD_SCHEMA_TYPE_INTEGER, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING}, 
         FIELD_SCHEMA_TYPE_PERCENT => new Set<String> {FIELD_SCHEMA_TYPE_PERCENT, FIELD_SCHEMA_TYPE_DOUBLE, FIELD_SCHEMA_TYPE_INTEGER, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING}, 
         FIELD_SCHEMA_TYPE_MULTIPICKLIST => new Set<String> {FIELD_SCHEMA_TYPE_MULTIPICKLIST, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_ENCRYPTEDSTRING => new Set<String> {FIELD_SCHEMA_TYPE_ENCRYPTEDSTRING, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_TIME => new Set<String> {FIELD_SCHEMA_TYPE_TIME, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_DATETIME => new Set<String> {FIELD_SCHEMA_TYPE_DATETIME, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_DATE => new Set<String> {FIELD_SCHEMA_TYPE_DATE, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_EAMIL => new Set<String> {FIELD_SCHEMA_TYPE_EAMIL, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_DOUBLE => new Set<String> {FIELD_SCHEMA_TYPE_DOUBLE, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_INTEGER => new Set<String> {FIELD_SCHEMA_TYPE_INTEGER, FIELD_SCHEMA_TYPE_DOUBLE, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_TEXT => new Set<String> {FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING},
         FIELD_SCHEMA_TYPE_TEXTAREA => new Set<String> {FIELD_SCHEMA_TYPE_TEXTAREA},
         FIELD_SCHEMA_TYPE_URL => new Set<String> {FIELD_SCHEMA_TYPE_URL, FIELD_SCHEMA_TYPE_TEXT, FIELD_SCHEMA_TYPE_TEXTAREA,FIELD_SCHEMA_TYPE_STRING} };
    
    //Set of fields to skip from source fields
    public static Set<String> SET_OF_FIELDS_TO_HIDE_FROM_SOURCE_FIELDS = new Set<String>{FIELD_NAME_ISDELETED.toLowerCase(), 
        FIELD_NAME_MASTERRECORDID.toLowerCase(), FIELD_NAME_SYSTEMMODSTAMP.toLowerCase(), FIELD_NAME_LASTACTIVITYDATE.toLowerCase(),
        FIELD_NAME_LASTVIEWEDDATE.toLowerCase(), FIELD_NAME_LASTREFERENCEDDATE.toLowerCase(), FIELD_NAME_RecordId.toLowerCase()};
            
    //Set of System fields to skip from source fields
    public static Set<String> SET_OF_FIELDS_TO_REMOVE_FROM_SOURCE_FIELDS = new Set<String>{FIELD_NAME_ISDELETED.toLowerCase(), 
        FIELD_NAME_MASTERRECORDID.toLowerCase(), FIELD_NAME_SYSTEMMODSTAMP.toLowerCase(), FIELD_NAME_LASTACTIVITYDATE.toLowerCase(),
        FIELD_NAME_LASTVIEWEDDATE.toLowerCase(), FIELD_NAME_LASTREFERENCEDDATE.toLowerCase(), FIELD_NAME_RECORDID.toLowerCase(),
        FIELD_NAME_CREATEDDATE.toLowerCase(), FIELD_NAME_CREATEDBYID.toLowerCase(), FIELD_NAME_CREATEDBYID.toLowerCase(),
        FIELD_NAME_LASTMODIFIEDBYID.toLowerCase(),FIELD_NAME_LASTMODIFIEDDATE.toLowerCase(),FIELD_NAME_OWNEREID.toLowerCase()};

	//Set of field schema type which should be skipped
	Set<String> SET_OF_FIELD_SCHEMA_TYPE_TO_SKIPP = new Set<String> {FIELD_SCHEMA_TYPE_ADDRESS};
}