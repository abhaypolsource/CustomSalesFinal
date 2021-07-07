/**
 * Description		:	This class is used to conatains meta data described methods.
 * 
 * Created Date		:	17th May 2021
 * 
 * Created By		:	Saurabh Kumar
 * */
public class MetaDataUtilities {
	
    //Describe the schema and all objects
    public static Map<String, Schema.DescribeSObjectResult> objectsDescribe(Boolean isDescribeAllObjects){
        
        Map<String, Schema.SObjectType> globalSchema = Schema.getGlobalDescribe();
        
        Map<String, Schema.DescribeSObjectResult> describedSObjectResults = new Map<String, Schema.DescribeSObjectResult>();
        
        for(String sobjectName : globalSchema.keySet()){
            Schema.DescribeSObjectResult describedSObjectResult = globalSchema.get(sobjectName).getDescribe();
            
            if((!isDescribeAllObjects && !Constants.SET_OF_ALLOWED_STANDARD_SOBJECTS.contains(sobjectName) && !describedSObjectResult.isCustom()) || describedSObjectResult.isCustomSetting())
				continue;
            describedSObjectResults.put(sobjectName, describedSObjectResult);
        }
        
        return describedSObjectResults;
    }
    
    //Check whether object is accessible to user or not
    public static Boolean isObjectAccessible(Schema.DescribeSObjectResult describeObjResult){
        
        if(describeObjResult == null || !describeObjResult.isAccessible() || !describeObjResult.isCreateable() || !describeObjResult.isUndeletable()
          || describeObjResult.isDeprecatedAndHidden() || !describeObjResult.isQueryable())
            return false;
        return true;
    }
    
    //Describe object's fields
    public static Map<String, Schema.DescribeFieldResult> fieldsDescribe(String objectApiName){
        
        Schema.DescribeSObjectResult describedSObjectResult = MetaDataUtilities.objectsDescribe(true).get(objectApiName);
        Map<String, Schema.DescribeFieldResult> describedFieldResults = new Map<String, Schema.DescribeFieldResult>();
        
        Map<String, Schema.SObjectField> objectFields = describedSObjectResult.fields.getMap();
        
        for(String fieldName : objectFields.keySet()){
            Schema.DescribeFieldResult describedFieldResult = objectFields.get(fieldName).getDescribe();
            describedFieldResults.put(fieldName, describedFieldResult);
        }
        return describedFieldResults;
    }
    
    //Check whether field is accessible to user or not
    public static Boolean isFieldAccessible(Schema.DescribeFieldResult describedFieldResult){
       
        if(!describedFieldResult.isAccessible() || describedFieldResult.isDeprecatedAndHidden())
            return false;
        return true;
    }
    
    //Check whether field is creatable to user or not
    public static Boolean isFieldCreatable(Schema.DescribeFieldResult describedFieldResult){
       
        if(!describedFieldResult.isCreateable() || !describedFieldResult.isUpdateable())
            return false;
        return true;
    }
    
    //Method to get all required fields for any object
    public static Set<String> getAllRequiredFields(List<Schema.DescribeFieldResult> describedFieldResults){
        
        Set<String> requiredFields = new Set<String>();
        for(Schema.DescribeFieldResult describedFieldResult : describedFieldResults){
            
            if(!describedFieldResult.isNillable())
                requiredFields.add(describedFieldResult.getName());
        }
        
        return requiredFields;
    }
    
}