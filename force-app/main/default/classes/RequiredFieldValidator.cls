public class RequiredFieldValidator {
    
    @AuraEnabled()
    public static List<string> mapRequiredFieldValidator(){
        
        Map<String,String> accountFieldMapping = new Map<String,String>();
        Map<string,string> contactFieldMapping = new Map<string,string>();
        Map<string,string> destFieldMapping = new Map<string,string>();
        List<String> accReqFieldsList = new List<String>();
        List<string> contReqFieldsList = new List<String>();
        List<String> destReqFieldsList = new List<String>();
        List<String> UnmappedFieldList = new List<String>();
        string destinationName = [SELECT id,Destination_Object_Api_Name__c, Destination_Object_Label__c, Sourcce_Object_Api_Name__c 
                                  FROM Object_Detail__c].Destination_Object_Api_Name__c;
        
        for(Field_Detail__c counter : [SELECT Source_Field_Api_Name__c, Source_Field_Label__c, Account_Field_Label__c, Account_Field_Api_Name__c,
                                       Contact_Field_Label__c, Contact_Field_Api_Name__c, Destination_Field_Label__c, Destination_Field_Api_Name__c 
                                       from Field_Detail__c]){
                                           if(counter.Account_Field_Api_Name__c != null && counter.Account_Field_Label__c != null){
                                               accountFieldMapping.put(counter.Account_Field_Api_Name__c.toLowerCase(),counter.Account_Field_Label__c);
                                           }
                                           if(counter.Contact_Field_Api_Name__c != null && counter.Contact_Field_Label__c != null){
                                               contactFieldMapping.put(counter.Contact_Field_Api_Name__c.toLowerCase(),counter.Contact_Field_Label__c);
                                           }
                                           if(counter.Destination_Field_Api_Name__c != null && counter.Destination_Field_Label__c != null){
                                               destFieldMapping.put(counter.Destination_Field_Api_Name__c.toLowerCase(),counter.Destination_Field_Label__c); 
                                           }
                                       }
        system.debug('accountFieldMapping'+accountFieldMapping);
        system.debug('contactFieldMapping'+contactFieldMapping);
        system.debug('destFieldMapping'+destFieldMapping);
        
        Map<String, Schema.SObjectType> m = Schema.getGlobalDescribe();
        Schema.SObjectType s = m.get('Account');
        Schema.DescribeSObjectResult r = s.getDescribe();
        Map<String,Schema.SObjectField> fields = r.fields.getMap();
        for(String field : fields.keyset()) {
            Schema.DescribeFieldResult describeResult = fields.get(field).getDescribe();
            if (describeResult.isCreateable() && !describeResult.isNillable() && !describeResult.isDefaultedOnCreate()) {
                System.debug(field);
                //accfields = accfields + field + ',';
                accReqFieldsList.add(field);
            }
        }
       // accfields = accfields.removeEnd(',');
        system.debug('fields=='+accReqFieldsList);
        
        Map<String, Schema.SObjectType> mCont = Schema.getGlobalDescribe();
        Schema.SObjectType sCont = mCont.get('Contact');
        Schema.DescribeSObjectResult rCont = sCont.getDescribe();
        Map<String,Schema.SObjectField> contfields = rCont.fields.getMap();
        for(String field : contfields.keyset()) {
            Schema.DescribeFieldResult describeResult = contfields.get(field).getDescribe();
            if (describeResult.isCreateable() && !describeResult.isNillable() && !describeResult.isDefaultedOnCreate()) {
                System.debug(field);
        		contReqFieldsList.add(field);
            }
        }
        system.debug('confields=='+contReqFieldsList);
        
        string oppfields ='';
        if(destinationName != null){
            Map<String, Schema.SObjectType> mOpp = Schema.getGlobalDescribe();
            Schema.SObjectType sOpp = mOpp.get(destinationName);
            Schema.DescribeSObjectResult rOpp = sOpp.getDescribe();
            Map<String,Schema.SObjectField> opptyfields = rOpp.fields.getMap();
            for(String field : opptyfields.keyset()){
                Schema.DescribeFieldResult describeResult = opptyfields.get(field).getDescribe();
                if (describeResult.isCreateable() && !describeResult.isNillable() && !describeResult.isDefaultedOnCreate()) {
                    System.debug(field);
                    destReqFieldsList.add(field);
                }
            }
        }
        system.debug('destReqFieldsList'+destReqFieldsList);

        if(accReqFieldsList != null){
            system.debug('accReqFieldsList'+accReqFieldsList);
            system.debug('accountFieldMapping'+accountFieldMapping);
            for(String rqStr : accReqFieldsList){
                system.debug('rqStr'+rqStr);
                system.debug('checkContains'+accountFieldMapping.containsKey(rqStr));
                if(!accountFieldMapping.containsKey(rqStr)){
                    system.debug('strrr'+rqStr);
                    UnmappedFieldList.add(rqStr);           
                }
            }
        }
        
        if(contReqFieldsList != null){
             for(String rqStr : contReqFieldsList){
                system.debug('rqStr'+rqStr);
                if(!contactFieldMapping.containsKey(rqStr)){
                    system.debug('strrr'+rqStr);
                    UnmappedFieldList.add(rqStr);           
                }
            }
        }
        
        if(destReqFieldsList != null){
            system.debug('destReqFieldsList:::'+destReqFieldsList);
           for(String rqStr : destReqFieldsList){
                system.debug('rqStr'+rqStr);
               system.debug('destFieldMapping:::'+destFieldMapping);
               system.debug('checkContains'+destFieldMapping.containsKey(rqStr));
                if(!destFieldMapping.containsKey(rqStr)){
                    system.debug('strrr'+rqStr);
                    UnmappedFieldList.add(rqStr);           
                }
            }
        }
        system.debug('UnmappedFieldList'+UnmappedFieldList);
        return UnmappedFieldList;
    }
}