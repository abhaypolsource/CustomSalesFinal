/*
@description       : 
@author            : Charu Goyal
@group             : 
@last modified on  : 15-06-2021
@last modified by  : Ashish Gupta
Modifications Log 
Ver   Date         Author              Modification
1.0   26-05-2021   Ashish Gupta   Initial Version
*/
public with sharing class SearchController {
    
    @AuraEnabled(cacheable = true)
    public static list<sObject> findRecords(String searchKey,String objectName,String searchField){
        String key = '%'+searchKey + '%';
        String query = 'Select id, '+searchField+' From '+objectName+' Where '+searchField+ ' Like :key';
        List<SObject> sObjectList = Database.query(query);
        return sObjectList;
    }
    
    @AuraEnabled()
    public static String getSourceObjInfo(String objectName,String recordId){
        map<String,String> fieldMapping = new map<String,String>();
        String retJSON;
        String getObjectType;
        String firstName;
        String lastName;
        String companyName;
        String Name;
        for(Field_Detail__c counter : [SELECT Source_Field_Api_Name__c, Source_Field_Label__c, Account_Field_Api_Name__c,Contact_Field_Api_Name__c,Destination_Field_Api_Name__c 
                                       from Field_Detail__c]){
                                           fieldMapping.put(counter.Source_Field_Label__c,counter.Source_Field_Api_Name__c);              
                                       }
        
        string destinationName = [SELECT id,Destination_Object_Api_Name__c, Destination_Object_Label__c, Sourcce_Object_Api_Name__c 
                                  FROM Object_Detail__c].Destination_Object_Api_Name__c;
        
        system.debug('fieldMapping==>'+fieldMapping);
        String query = 'Select id,';
        for(String counter:fieldMapping.values()){
             Boolean flag =  Pattern.compile('(?i)' + Pattern.quote(counter)).matcher(query).find();
            if(!query.contains(counter)){
            //if(!flag){
                query += counter + ',';
            }
        }
        query = query.removeEnd(',');
        query += ' from '+objectName+' where id =:recordId';
        System.debug('query :::'+query);
        
        SObject objRec = Database.query(query);
        system.debug('objRec'+objRec);
        if(objRec != null){
            getObjectType = String.valueOf(objRec.getSObjectType());
        }
        system.debug('getObjectType'+getObjectType);
        if(getObjectType != null){
            if(getObjectType == 'Lead' || getObjectType == 'Contact'){
                if(fieldMapping.ContainsKey('First Name') &&  String.valueOf(objRec.get(fieldMapping.get('First Name'))) != null){
                    firstName = String.valueOf(objRec.get(fieldMapping.get('First Name')));
                }
                if(fieldMapping.ContainsKey('Last Name') &&  String.valueOf(objRec.get(fieldMapping.get('Last Name'))) != null){
                    lastName = String.valueOf(objRec.get(fieldMapping.get('Last Name')));
                }
            }
        }
        system.debug('firstName'+firstName);
        system.debug('lastName'+lastName);
        
        if(fieldMapping.containsKey('Company') && String.valueOf(objRec.get(fieldMapping.get('Company'))) != null){
            companyName = (String)objRec.get(fieldMapping.get('Company'));
        }
        system.debug('Company==>'+companyName);
        if(fieldMapping.containsKey('Name') && String.valueOf(objRec.get(fieldMapping.get('Name'))) != null){
            Name = (String)objRec.get(fieldMapping.get('Name'));
        }
        system.debug('Name==>'+Name);
        
        /*if(objRec.get(fieldMapping.get('Name')) != null && objRec.get(fieldMapping.get('Company')) != null && destinationName != null){
			retJSON = '{"accountName":"'+objRec.get(fieldMapping.get('Company'))+
			'","contactName":"'+objRec.get(fieldMapping.get('Name'))+
			'","destinationName":"'+objRec.get(fieldMapping.get('Company'))+'"}';
		}*/
        retJSON = '{"accountName":"'+ (companyName != '' ? companyName : 'null')+
            '","contactName":"'+ (Name != '' ? Name : 'null')+
            '","destinationName":"'+ (companyName != '' ? companyName : 'null')+
            '","FirstName":"'+ (firstName != '' ? firstName : 'null')+
            '","LastName":"'+ (lastName != '' ? lastName : 'null') +'"}';
        
        System.debug('retJSON :::'+retJSON);                
        return retJSON;
    }
    
    @AuraEnabled(cacheable=true)
    public static string fetchDestination(){
        
        string destinationName = [SELECT id,Destination_Object_Api_Name__c, Destination_Object_Label__c, Sourcce_Object_Api_Name__c 
                                  FROM Object_Detail__c].Destination_Object_Label__c;
        string sourceApiName = [SELECT id, Source_Object_Label__c, Sourcce_Object_Api_Name__c 
                                FROM Object_Detail__c].Sourcce_Object_Api_Name__c;
        string destinationAPiName = [SELECT id,Destination_Object_Api_Name__c, Destination_Object_Label__c, Sourcce_Object_Api_Name__c 
                                     FROM Object_Detail__c].Destination_Object_Api_Name__c;
        String retDestJSON;
        
        if(destinationName != null){
            retDestJSON = '{"destinationLabelName":"'+(destinationName != '' ? destinationName : 'null')+
                '","sourceApiName":"'+ (sourceApiName != '' ? sourceApiName : 'null') +
                '","destinationAPiName":"'+ (destinationAPiName != '' ? destinationAPiName : 'null') +'"}';
        }
        
        return retDestJSON;
    }
    @AuraEnabled(cacheable=true)
    public static List<List<recordType>> fetchRecordType(){
        List<List<recordType>> returnRecordTypeList = new List<List<recordType>>();
        
        List<recordType> fetchAccRecordtypeList = [select Id,Name from RecordType where sObjectType='Account'];
        List<recordType> fetchConRecordtypeList = [select Id,Name from RecordType where sObjectType='Contact'];
        
        string destinationName = [SELECT id,Destination_Object_Api_Name__c, Destination_Object_Label__c, Sourcce_Object_Api_Name__c 
                                  FROM Object_Detail__c].Destination_Object_Api_Name__c;
        
        List<recordType> fetchDestRecordtypeList = [SELECT Id,Name FROM RecordType 
                                                    WHERE sObjectType =: destinationName];
        
        if(fetchAccRecordtypeList != null){
            returnRecordTypeList.add(fetchAccRecordtypeList);
        }
        if(fetchConRecordtypeList != null){
            returnRecordTypeList.add(fetchConRecordtypeList);
        }
        if(fetchDestRecordtypeList != null){
            returnRecordTypeList.add(fetchDestRecordtypeList);
        }
        
        return returnRecordTypeList;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<contact> validateAccountRelatedContact(String contactRcrdId){
        List<contact> fetchContList = [SELECT Id, name, accountId, account.name from contact where Id =: contactRcrdId];
        return fetchContList;
    }
    
    @AuraEnabled()
    public static List<wrapperClass> insertAccContOpp(Map<string,string> conversionDataMap, String currntRecordId, String objApiName){
        
        Map<String,List<sObject>> returnResultList = new Map<String,List<sObject>>();
        List<wrapperClass> returnWrapperList = new List<wrapperClass>();
        set<Id> returnObjIdSet = new Set<Id>();
        if(conversionDataMap != null && objApiName != null && currntRecordId != null){
            //try {
            system.debug('convertData'+conversionDataMap);
            system.debug('recordId'+currntRecordId);
            system.debug('objApiName'+objApiName);
            
            sObject sObj;
            account acc = new account();
            contact con = new contact();
            map<String,String> fieldSourceMap = new map<String,String>();
            Map<String, Schema.SObjectField> accountFieldMap = Schema.SObjectType.Account.fields.getMap();
            Map<String, Schema.SObjectField> contactFieldMap = Schema.SObjectType.Contact.fields.getMap();
            Map<String, Schema.SObjectType> global_describe = new Map<String, Schema.SObjectType>();
            Map<String, Schema.SObjectField> Destination_fields_map = new Map<String, Schema.SObjectField>();
            Map<Id,account> fetchAccMap = new Map<Id,account>();
            Map<Id,contact> fetchContMap = new Map<Id,contact>();
            Map<Id,sObject> DestiObjMap = new Map<Id,sObject>();
            List<Sobject> fetchDestresultList;
            List<Sobject> fetchCreatedDestLst;
            List<account> fetchCreatedAccList;
            List<contact> fetcCreatedContLst;
            
            system.debug('accountFieldMap'+accountFieldMap);
            system.debug('contactFieldMap'+contactFieldMap);
            
            List<user> fetchUsersList = [SELECT Id, name, IsActive FROM user where IsActive = true AND Id =: conversionDataMap.get('RecordOwnerId')];
            
            List<account> fetchAccList = [SELECT ID, Name, Phone, Website, Rating 
                                          FROM account 
                                          WHERE Id =: conversionDataMap.get('Accounts')];
            if(!fetchAccList.isEmpty()){
                for(account accObj : fetchAccList){
                    fetchAccMap.put(accObj.Id, accObj);
                    //returnObjIdSet.add(accObj.Id);
                }
            }
            
            List<contact> fetchContactList = [SELECT ID, name, FirstName, phone, LastName, Email, LeadSource, MobilePhone, AccountId
                                              FROM contact 
                                              WHERE Id =: conversionDataMap.get('Contacts')];
            if(!fetchContactList.isEmpty()){
                for(contact conObj : fetchContactList){
                    fetchContMap.put(conObj.Id,conObj);
                }
            }
            
            /*******************fetch Destination Object with records**************************/
            String destinationObj = [Select Sourcce_Object_Api_Name__c,Destination_Object_Api_Name__c from Object_Detail__c].Destination_Object_Api_Name__c;
            system.debug('destinationObj'+destinationObj);
            string sourceApiName = [SELECT id, Source_Object_Label__c, Sourcce_Object_Api_Name__c 
                                FROM Object_Detail__c].Sourcce_Object_Api_Name__c;
            System.debug('sourceApiName'+sourceApiName);
            
            String val = conversionDataMap.get('Destination');
            Pattern id = Pattern.compile('[A-Za-z0-9]{18}');
            Matcher myMatcher  = id.matcher(val);
            system.debug('matcher'+myMatcher );
            if (!myMatcher.find()){
                system.debug('not an Id');
            } 
            system.debug('Id==>'+val);
            system.debug('destinationObj'+destinationObj);
            if(destinationObj != null){
                system.debug('inside destin');
                system.debug('myMatcher.find()'+myMatcher.find());
                //if(myMatcher.find()){
                system.debug('inside dehfh');
                try{
                    string destIdVal = conversionDataMap.get('Destination');
                    String queryStr='select Id, Name,ownerId from ' + destinationObj + ' WHERE Id =: destIdVal';
                    system.debug('queryStr'+queryStr);
                    
                    fetchDestresultList=Database.query(queryStr);
                }catch(exception e){
                    system.debug('Dest Query Message'+e.getMessage());
                }
                //}
                system.debug('results'+fetchDestresultList);
                global_describe = Schema.getGlobalDescribe();
                Destination_fields_map = global_describe.get(destinationObj).getDescribe().fields.getMap();
                sObj = Schema.getGlobalDescribe().get(destinationObj).newSObject() ;
            }
            system.debug('object_fields_map'+Destination_fields_map);
            system.debug('sObj'+sObj);
            if(fetchDestresultList != null){
                for(sobject objDest : fetchDestresultList){
                    DestiObjMap.put(objDest.Id, objDest);
                }
            }
            
            for(Field_Detail__c counter : [SELECT Source_Field_Api_Name__c, Source_Field_Label__c, Account_Field_Api_Name__c,Contact_Field_Api_Name__c,Destination_Field_Api_Name__c
                                           FROM Field_Detail__c]){
                                               fieldSourceMap.put(counter.Source_Field_Label__c,counter.Source_Field_Api_Name__c);   
                                           }
            
            system.debug('fieldMapping'+fieldSourceMap);
            String query = 'Select id,';
            
            for(String counter:fieldSourceMap.values()){
                system.debug('query'+query);
				system.debug('counter'+counter);
                Boolean flag =  Pattern.compile('(?i)' + Pattern.quote(counter)).matcher(query).find();
                if(!query.contains(counter)){
                //if(!flag){
                    system.debug('counterInside'+counter);
                    query += counter + ',';
                    system.debug('counteQuery'+query);
                }
            }
            query = query.removeEnd(',');
            query += ' from '+objApiName+' where id =:currntRecordId';
            System.debug('query :::'+query);
            SObject objRec = Database.query(query); // *********Fetch current object recordId records******//
            system.debug('objRec'+objRec);
            
            for(Field_Detail__c counter : [SELECT Id, Source_Field_Api_Name__c, Source_Field_Label__c, Account_Field_Api_Name__c,Contact_Field_Api_Name__c,Destination_Field_Api_Name__c
                                           FROM Field_Detail__c]){
                                               
                                               if(!accountFieldMap.isEmpty()){                            
                                                   if(accountFieldMap.containsKey(counter.Account_Field_Api_Name__c)){
                                                       system.debug('fild'+counter.Account_Field_Api_Name__c);
                                                       system.debug('chkField'+fieldSourceMap.get(counter.Source_Field_Label__c));
                                                       system.debug('acc'+String.ValueOf(objRec.get(fieldSourceMap.get(counter.Source_Field_Label__c))));
                                                       if(fieldSourceMap != null && String.ValueOf(objRec.get(fieldSourceMap.get(counter.Source_Field_Label__c))) != null){
                                                           acc.put(counter.Account_Field_Api_Name__c,objRec.get(fieldSourceMap.get(counter.Source_Field_Label__c)));
                                                       }
                                                   }
                                                   if(conversionDataMap.get('RecordOwnerId') != null && fetchUsersList.size()>0){ 
                                                       if(accountFieldMap.containsKey('OwnerId')){
                                                           acc.put('OwnerId',conversionDataMap.get('RecordOwnerId'));
                                                       }
                                                   }
                                               }
                                               
                                               if(!contactFieldMap.isEmpty() && fetchUsersList.size()>0){                              
                                                   if(contactFieldMap.containsKey(counter.Contact_Field_Api_Name__c)){
                                                       system.debug('fildCont'+counter.Contact_Field_Api_Name__c);
                                                       system.debug('cont'+String.ValueOf(objRec.get(fieldSourceMap.get(counter.Source_Field_Label__c))));      
                                                       if(fieldSourceMap != null && String.ValueOf(objRec.get(fieldSourceMap.get(counter.Source_Field_Label__c))) != null){
                                                           con.put(counter.Contact_Field_Api_Name__c, objRec.get(fieldSourceMap.get(counter.Source_Field_Label__c)));
                                                       }
                                                   }
                                                   if(conversionDataMap.get('RecordOwnerId') != null && fetchUsersList.size()>0){ 
                                                       if(contactFieldMap.containsKey('OwnerId')){
                                                           con.put('OwnerId',conversionDataMap.get('RecordOwnerId'));
                                                       }
                                                   }
                                               }
                                               
                                               if(!Destination_fields_map.isEmpty()){
                                                   if(conversionDataMap.get('checkBoxDest') =='false'){
                                                       if(Destination_fields_map.containsKey(counter.Destination_Field_Api_Name__c)){
                                                           system.debug('fildDesti'+counter.Destination_Field_Api_Name__c);
                                                           system.debug('Destinat::'+String.ValueOf(objRec.get(fieldSourceMap.get(counter.Source_Field_Label__c)))); 
                                                           if(fieldSourceMap != null && String.ValueOf(objRec.get(fieldSourceMap.get(counter.Source_Field_Label__c))) != null){
                                                               sObj.put(counter.Destination_Field_Api_Name__c, objRec.get(fieldSourceMap.get(counter.Source_Field_Label__c)));
                                                           }
                                                       }
                                                       if(conversionDataMap.get('RecordOwnerId') != null){ 
                                                           if(Destination_fields_map.containsKey('OwnerId')){
                                                               sObj.put('OwnerId',conversionDataMap.get('RecordOwnerId'));
                                                           }
                                                       }  
                                                   }
                                               }
                                           }
            system.debug('fetchAccList::'+fetchAccList);
            system.debug('fetchContactList::'+fetchContactList);
            system.debug('accOunts'+acc);
            system.debug('cont'+con);
            system.debug('sObj'+sObj);
            
            /*******************************Compare Conditions of Account,Contact and Destination Object*********************************/
            
            if(fetchAccList.isEmpty() && fetchContactList.isEmpty()){
                if(acc != null){
                    if(conversionDataMap.get('Accounts') != null){
                        acc.Name = conversionDataMap.get('Accounts');
                    }
                    if(conversionDataMap.get('AccRecordType') != null && conversionDataMap.get('AccRecordType') != ''){
                        acc.put('RecordTypeId',conversionDataMap.get('AccRecordType'));
                    }
                    insert acc;
                }
                if(con != null){
                    con.AccountId = acc.Id;
                    if(conversionDataMap.get('Contacts') != null){
                        con.LastName = conversionDataMap.get('Contacts');
                    }
                    if(conversionDataMap.get('ContRecordType') != null && conversionDataMap.get('ContRecordType') != ''){
                        con.put('RecordTypeId',conversionDataMap.get('ContRecordType'));
                    }
                    insert con;
                }
            }
            else if(!fetchAccList.isEmpty() && (!fetchContactList.isEmpty())){
                if(acc != null){
                    acc.Id = conversionDataMap.get('Accounts');
                    acc.Name = fetchAccMap.get(conversionDataMap.get('Accounts')).name;
                    update acc;
                }
                if(con != null){
                    if(conversionDataMap.get('Contacts') != null){
                        con.Id = conversionDataMap.get('Contacts');
                        con.FirstName = fetchContMap.get(conversionDataMap.get('Contacts')).FirstName;
                        con.LastName =  fetchContMap.get(conversionDataMap.get('Contacts')).LastName;
                    }
                    update con;
                }
            }
            else if(fetchAccList.isEmpty() && (!fetchContactList.isEmpty())){
                if(acc != null){
                    if(conversionDataMap.get('Accounts') != null){
                        acc.Name = conversionDataMap.get('Accounts');
                    }
                    if(conversionDataMap.get('AccRecordType') != null && conversionDataMap.get('AccRecordType') != ''){
                        acc.put('RecordTypeId',conversionDataMap.get('AccRecordType'));
                    }
                    insert acc;
                }
                if(con != null){
                    if(conversionDataMap.get('Contacts') != null){
                        con.Id = conversionDataMap.get('Contacts');
                        con.FirstName = fetchContMap.get(conversionDataMap.get('Contacts')).FirstName;
                        con.LastName =  fetchContMap.get(conversionDataMap.get('Contacts')).LastName;
                    }
                    update con;
                }
            }
            else if(!fetchAccList.isEmpty() && fetchContactList.isEmpty()){
                if(acc != null){
                    acc.Id = conversionDataMap.get('Accounts');
                    acc.Name = fetchAccMap.get(conversionDataMap.get('Accounts')).name;
                    update acc;
                }
                if(con != null){
                    if(conversionDataMap.get('Contacts') != null){
                        con.LastName = conversionDataMap.get('Contacts');
                    }
                    if(conversionDataMap.get('ContRecordType') != null && conversionDataMap.get('ContRecordType') != ''){
                        con.put('RecordTypeId',conversionDataMap.get('ContRecordType'));
                    }
                    con.AccountId = acc.Id;                      
                    insert con;
                }
            }
            if(!(fetchDestresultList.isEmpty())){
                system.debug('inside not null');
                if(sObj != null){
                    if(conversionDataMap.get('Destination') != null){
                        sObj.Id = conversionDataMap.get('Destination');
                        //sobj.name = DestiObjMap.get(conversionDataMap.get('Destination')).name;
                        //sobj.put('Name',DestiObjMap.get('Name'));
                        Update sObj;
                    }
                }  
            }
            else if((fetchDestresultList.isEmpty())){
                system.debug('inside nulll');
                if(conversionDataMap.get('checkBoxDest') =='false'){
                    if(sObj != null){
                        if(conversionDataMap.get('Destination') != null){
                            sObj.put('Name',conversionDataMap.get('Destination'));
                        }
                        if(conversionDataMap.get('DesRecordType') != null && conversionDataMap.get('DesRecordType') != ''){
                            sObj.put('RecordTypeId', conversionDataMap.get('DesRecordType'));
                        }
                        Insert sObj;
                    } 
                }
            }
            system.debug('sObj'+sObj);
            /*********************************** fetch created record for return in component****************************/
            
            if(acc.Id != null){
                fetchCreatedAccList = new List<account>();
                fetchCreatedAccList = [SELECT Id,name, website, owner.name, Phone, Industry, Type 
                                       FROM account WHERE Id =: acc.Id];
                //returnResultList.put('Account',fetchCreatedAccList);
                for(account ac : fetchCreatedAccList){
                    returnWrapperList.add(new wrapperClass(ac,null,null,null));
                }
            }
            if(con.Id != null){
                fetcCreatedContLst = new List<contact>();
                fetcCreatedContLst = [SELECT Id, Name, account.name, owner.name, accountId, MobilePhone, LeadSource, Email, Title, Phone
                                      FROM contact WHERE Id =: con.Id];
                //returnResultList.put('Contact',fetcCreatedContLst);
                for(contact cont : fetcCreatedContLst){
                    returnWrapperList.add(new wrapperClass(null,cont,null,null));
                }
            }
            if(sObj.Id != null){
                String queryDest;
                string DestId = sObj.id;
                if(destinationObj == 'Opportunity'){
                    queryDest='SELECT Id, Name, ownerId, Owner.Name,Amount,CloseDate,Account.name FROM '+ destinationObj +' WHERE Id =: DestId';
                }
                else{
                    queryDest='SELECT Id, Name, ownerId, Owner.Name FROM '+ destinationObj +' WHERE Id =: DestId';
                }
                system.debug('queryDest'+queryDest);
                fetchCreatedDestLst=Database.query(queryDest);              
                //returnResultList.put('destinationObj',fetchCreatedDestLst);
                for(sObject objs : fetchCreatedDestLst){
                    returnWrapperList.add(new wrapperClass(null,null,objs,null));
                }
                returnWrapperList.add(new wrapperClass(null,null,null,destinationObj));
            }
            
            /***************************************************************************************************************/
            
            /* } catch (Exception e) {
					system.debug('error');
					throw new AuraHandledException(e.getMessage());
				}*/
            if(objRec != null){
                returnObjIdSet.add(objRec.Id);
                if(returnWrapperList != null){
                    copyNotesANDAttachement(returnObjIdSet,returnWrapperList);
                    //insertRelatedCustomObjectData(sourceApiName, destinationObj, objRec.Id,returnWrapperList);
                }
                //Delete objRec;
            }
        }
        system.debug('returnWrapperList'+returnWrapperList);
        return returnWrapperList;
    }
    
   public static void copyNotesANDAttachement(Set<Id> returnSetIds, List<wrapperClass> returnWrapperList){
        system.debug('returnSetIds'+returnSetIds); 
        system.debug('returnWrapperList'+returnWrapperList);
        account accountObj;
        contact contactObj;
        sObject destObj;
        String getOwnerId;
        List<Attachment> insertattachementList = new List<Attachment>();
        List<note> insertNoteList = new List<note>();
        List<task> insertTaskLst = new List<Task>();
        List<Event> insertEventLst = new List<Event>();
        Set<Id> contDocIdSet = new Set<Id>();
        List<contentDocument> fetchContentDocLst;
        List<contentVersion> insertContentVersionList = new List<contentVersion>();
        List<ContentDocumentLink> insertCntDocLinkLst;
        Map<String,List<contentVersion>> contentVerMap = new Map<String,List<contentVersion>>();
        system.debug('sizeWrape'+returnWrapperList.size());
        if(returnWrapperList != null || (!returnWrapperList.isEmpty())){
            accountObj = returnWrapperList[0].accObj != null ? returnWrapperList[0].accObj : null;
            system.debug('accountObj'+accountObj.id);
            getOwnerId = accountObj.ownerId != null ? accountObj.ownerId : null;
            contactObj = returnWrapperList[1].contObj != null ? returnWrapperList[1].contObj : null;
            system.debug('contactObj'+contactObj.id);
            if(returnWrapperList.size()>2){
            	destObj = returnWrapperList[2].DestObj != null ? returnWrapperList[2].DestObj : null;
            }
        }
        string destinationName = [SELECT id,Destination_Object_Api_Name__c, Destination_Object_Label__c, Sourcce_Object_Api_Name__c 
                                  FROM Object_Detail__c].Destination_Object_Label__c;
        
        //system.debug('destObj'+destObj.id);
        List<Task> fetchTaskLst = [SELECT Id, Status, Subject, Type, WhatId, WhoId, CallType, OwnerId, Description, IsRecurrence, ActivityDate,
                                  		   Priority, TaskSubtype FROM Task
                                  		  Where WhatId IN : returnSetIds];
        system.debug('fetchTaskLst'+fetchTaskLst);
        
        List<Event> fetchEventLst = [SELECT Id, OwnerId, IsAllDayEvent, ActivityDate, Description, EndDateTime, WhoId, WhatId, 
                                    		StartDateTime, Subject, ActivityDateTime, Type FROM Event
                                    														WHERE WhatId IN : returnSetIds];
        system.debug('fetchEventLst'+fetchEventLst);
        
        List<Attachment> fetchattachmentsList = [SELECT Id,name, Body, ContentType, Description, OwnerId, IsPrivate, Bodylength 
                                                 FROM Attachment 
                                                 WHERE ParentID IN: returnSetIds];
        system.debug('fetchattachmentsList'+fetchattachmentsList);
        
        List<Note> fetchNotesList = [SELECT Id, Title, Body, ownerId 
                                     FROM Note 
                                     WHERE ParentID IN: returnSetIds];
        system.debug('fetchNotesList'+fetchNotesList);
        
        List<ContentDocumentLink> fetchContentDocLinkLst = [SELECT ContentDocumentId, LinkedEntityId  FROM ContentDocumentLink where LinkedEntityId IN : returnSetIds];
        
        if(!fetchContentDocLinkLst.isEmpty()){
            for(ContentDocumentLink contLnkObj : fetchContentDocLinkLst){
                contDocIdSet.add(contLnkObj.ContentDocumentId);
            }
        }
        
         List<ContentVersion> fetchContentVersion = [SELECT Id, ContentDocumentId, ContentUrl, VersionData, PathOnClient, ContentBodyId, Title, Description, OwnerId, ContentSize, FileType, TagCsv, 
                                                    FileExtension FROM ContentVersion 
                                                   	WHERE ContentDocumentId IN : contDocIdSet];
        
        if(contDocIdSet.size()>0){
            fetchContentDocLst = new List<contentDocument>();
            fetchContentDocLst = [SELECT Id, Title, OwnerId, IsArchived, ParentId, Description, FileType, FileExtension, ContentSize
                                  FROM ContentDocument where Id in : contDocIdSet];
        }
        
        List<Related_Object_Details__c> fetchRelatedObjectList = [select id,Related_Object_API_Name__c,Selected_On_Account__c,Selected_On_Contact__c,Selected_On_Destination__c,Related_Object_Label__c 
                                                                  FROM Related_Object_Details__c 
                                                                  WHERE Related_Object_API_Name__c != null];
        system.debug('fetchRelatedObjectList'+fetchRelatedObjectList);
        
        for(Related_Object_Details__c RelatedObj : fetchRelatedObjectList){
            if(RelatedObj.Related_Object_API_Name__c == 'Attachment'){
                if(!fetchattachmentsList.isEmpty()){
                    if(RelatedObj.Selected_On_Account__c == true){
                        system.debug('inside acc chckbox');
                        for(Attachment attch : fetchattachmentsList){
                            insertattachementList.add(NotesAndattach(accountObj.Id, getOwnerId, attch));
                        }
                    } if(RelatedObj.Selected_On_Contact__c == true){
                        system.debug('inside cont chkbox');
                        for(Attachment attch : fetchattachmentsList){
                            insertattachementList.add(NotesAndattach(contactObj.Id,getOwnerId, attch));
                        }
                    }if(RelatedObj.Selected_On_Destination__c == true){
                        system.debug('inside destination chkbox');
                        for(Attachment attch : fetchattachmentsList){
                            if(destObj!= null){
                            	insertattachementList.add(NotesAndattach(destObj.Id, getOwnerId, attch));
                            }
                        }
                    }
                }
            }
            else if(RelatedObj.Related_Object_API_Name__c == 'Note'){
                if(!fetchNotesList.isEmpty()){
                    if(RelatedObj.Selected_On_Account__c == true){
                        for(Note noteObj : fetchNotesList){
                            insertNoteList.add(insertNotes(accountObj.Id, getOwnerId, noteObj));
                        }
                    }if(RelatedObj.Selected_On_Contact__c == true){
                        for(Note noteObj : fetchNotesList){
                           insertNoteList.add(insertNotes(contactObj.Id, getOwnerId, noteObj));
                        }
                    }if(RelatedObj.Selected_On_Destination__c == true){
                        for(Note noteObj : fetchNotesList){
                            if(destObj != null)
                                insertNoteList.add(insertNotes(destObj.Id, getOwnerId, noteObj));
                        }
                    }
                }
            }else if(RelatedObj.Related_Object_API_Name__c == 'File'){
                if(RelatedObj.Selected_On_Account__c == true){
                    if(!fetchContentVersion.isEmpty() && (!fetchContentDocLinkLst.isEmpty())){
                        for(contentVersion contVerObj : fetchContentVersion){
                            insertContentVersionList.add(insertContVersion(contVerObj, getOwnerId));
                            contentVerMap.put('Account',insertContentVersionList);
                        }
                    }
                }	 
                 if(RelatedObj.Selected_On_Contact__c == true){
                    if(!fetchContentVersion.isEmpty() && (!fetchContentDocLinkLst.isEmpty())){
                        for(contentVersion contVerObj : fetchContentVersion){
                            insertContentVersionList.add(insertContVersion(contVerObj, getOwnerId));
                            contentVerMap.put('Contact',insertContentVersionList);
                        }
                    }
                }
                if(RelatedObj.Selected_On_Destination__c == true){
                    if(!fetchContentVersion.isEmpty() && (!fetchContentDocLinkLst.isEmpty())){
                        for(contentVersion contVerObj : fetchContentVersion){
                            if(destObj != null){
                                insertContentVersionList.add(insertContVersion(contVerObj, getOwnerId));
                                contentVerMap.put('Destination',insertContentVersionList);
                            }
                        }
                    }
                }	
            }
            else if(RelatedObj.Related_Object_API_Name__c == 'Task'){
                if(RelatedObj.Selected_On_Account__c == true){
                    system.debug('inside task acc');
                    if(!fetchTaskLst.isEmpty()){
                        for(Task tskObj : fetchTaskLst){
                            system.debug('task record');
                            insertTaskLst.add(insertTask(accountObj.Id, getOwnerId, tskObj,'Account'));
                        }
                    }
                }
                if(RelatedObj.Selected_On_Contact__c == true){
                    if(!fetchTaskLst.isEmpty()){
                        for(Task tskObj : fetchTaskLst){
                            insertTaskLst.add(insertTask(contactObj.Id, getOwnerId, tskObj, 'Contact'));
                        }
                    }
                }
                if(RelatedObj.Selected_On_Destination__c == true){
                    if(!fetchTaskLst.isEmpty()){
                        for(Task tskObj : fetchTaskLst){
                            if(destObj != null)
                                insertTaskLst.add(insertTask(destObj.Id, getOwnerId, tskObj, destinationName));
                        }
                    }
                }
            }
            else if(RelatedObj.Related_Object_API_Name__c == 'Event'){
                if(RelatedObj.Selected_On_Account__c == true){
                    if(!fetchEventLst.isEmpty()){
                        for(Event evtObj : fetchEventLst){
                            insertEventLst.add(insertEvent(accountObj.Id, getOwnerId, evtObj, 'Account'));
                        }
                    }
                }
                if(RelatedObj.Selected_On_Contact__c == true){
                     if(!fetchEventLst.isEmpty()){
                        for(Event evtObj : fetchEventLst){
                            insertEventLst.add(insertEvent(contactObj.Id, getOwnerId, evtObj,'Contact'));
                        }
                    }
                }
                if(RelatedObj.Selected_On_Destination__c == true){
                     if(!fetchEventLst.isEmpty()){
                         for(Event evtObj : fetchEventLst){
                             if(destObj != null)
                                 insertEventLst.add(insertEvent(destObj.Id, getOwnerId, evtObj, destinationName));
                         }
                    }
                }
            }
        }
        system.debug('insertTaskLst'+insertTaskLst);
        system.debug('insideEventLst'+insertEventLst);
        system.debug('insertattachementList'+insertattachementList);
        system.debug('insertNoteList'+insertNoteList);
        if(!insertattachementList.isEmpty()){
            insert insertattachementList;
        }
        if(!insertNoteList.isEmpty()){
            insert insertNoteList;
        }
        if(!insertTaskLst.isEmpty()){
            insert insertTaskLst;
        }
        if(!insertEventLst.isEmpty()){
            insert insertEventLst;
        }
        system.debug('insertContentVersionList'+insertContentVersionList);
        if(!insertContentVersionList.isEmpty()){
            insert insertContentVersionList;
            system.debug('insertContentVerLst'+insertContentVersionList);
            system.debug('contentVerMap'+contentVerMap);
            insertCntDocLinkLst = new List<ContentDocumentLink>();
            List<contentVersion> conDocList = [SELECT ContentDocumentId FROM ContentVersion WHERE Id IN :insertContentVersionList];
            for(contentVersion cnV : conDocList){
                for(String keys : contentVerMap.KeySet()){
                    for(contentVersion cnVObj : contentVerMap.get(keys)){
                        system.debug('keys'+keys);
                        system.debug('cnV++'+cnV);
                        system.debug('cnVObj==>'+cnVObj);
                        if(cnV.Id == cnVObj.Id){
                            if(keys == 'Account'){
                                System.debug('ACCDocId===>'+cnV.ContentDocumentId);
                                ContentDocumentLink conDocLink = New ContentDocumentLink();
                                conDocLink.LinkedEntityId = accountObj.Id != null ? accountObj.Id : null;
                                conDocLink.ContentDocumentId = cnV.ContentDocumentId;
                                insertCntDocLinkLst.add(conDocLink);
                            }
                            else if(keys == 'Contact'){
                                System.debug('ContDOCID===>'+cnV.ContentDocumentId);
                                ContentDocumentLink conDocLink = New ContentDocumentLink();
                                conDocLink.LinkedEntityId = contactObj.Id != null ? contactObj.Id : null;
                                conDocLink.ContentDocumentId = cnV.ContentDocumentId;
                                insertCntDocLinkLst.add(conDocLink);
                            }
                            else if(keys == 'Destination'){
                                System.debug('DestDocId===>'+cnV.ContentDocumentId);
                                ContentDocumentLink conDocLink = New ContentDocumentLink();
                                conDocLink.LinkedEntityId = destObj.Id != null ? destObj.Id : null;
                                conDocLink.ContentDocumentId = cnV.ContentDocumentId;
                                insertCntDocLinkLst.add(conDocLink);
                            }
                        }
                    }
                }
            }
        }
        system.debug('insertCntDocLinkLst'+insertCntDocLinkLst);
        if(insertCntDocLinkLst != null){
            insert insertCntDocLinkLst;
        }
        
    }
    
    public static void insertRelatedCustomObjectData(String sourceApiName, String destApiName, String sourceRecordId, List<wrapperClass> returnWrapperList){
        List<ConversionMappingController.ChildObjectDetails> fetchReturnDataLst = ConversionMappingController.getChildRelationshipObject(sourceApiName,destApiName,false);
        system.debug('fetchReturnDataLst'+fetchReturnDataLst);
        Map<String, Schema.SObjectType> global_describe = new Map<String, Schema.SObjectType>();
        Map<String, Schema.SObjectField> relatedChild_fields_map = new Map<String, Schema.SObjectField>();
        Map<String, Schema.SObjectField> accountFieldMap = Schema.SObjectType.Account.fields.getMap();
        Map<String, Schema.SObjectField> contactFieldMap = Schema.SObjectType.Contact.fields.getMap();
        
        string sourceLabelName = [SELECT id, Source_Object_Label__c, Sourcce_Object_Api_Name__c 
                                FROM Object_Detail__c].Source_Object_Label__c;
        account accountObj;
        contact contactObj;
        sObject destObj;
        List<sObject> sObjectList = new List<sObject>();
        List<SObject> querysObjectList;
        if(returnWrapperList != null){
        	accountObj = returnWrapperList[0].accObj != null ? returnWrapperList[0].accObj : null;
        	system.debug('accountObj'+accountObj.id);
        	String getOwnerId = accountObj.ownerId;
        	contactObj = returnWrapperList[1].contObj;
        	system.debug('contactObj'+contactObj.id);
            if(returnWrapperList[2].DestObj != null){
                destObj = returnWrapperList[2].DestObj;
            }
        }
          
        Set<String> standrdSet = new Set<String>{'File','Note','Task','Event','Attachment'};
            system.debug('standrdrSet'+standrdSet);
        for(ConversionMappingController.ChildObjectDetails returnData : fetchReturnDataLst){
            system.debug('returnData'+returnData);
            if(!returnData.objectNotExistsInAccount){
                if(!standrdSet.contains(returnData.value)){
				   system.debug('value==>'+returnData.value);
                    sobject sObj;
                    global_describe = Schema.getGlobalDescribe();
                	relatedChild_fields_map = global_describe.get(returnData.value).getDescribe().fields.getMap();
                    system.debug('relatedChild_fields_map'+relatedChild_fields_map);
                	sObj = Schema.getGlobalDescribe().get(returnData.value).newSObject();
                   // SObjectType sObjType = ((SObject) Type.forName(returnData.value).newInstance()).getSObjectType();
                     sObj.put('Name',accountObj.Name);
                    if(relatedChild_fields_map.containsKey(sourceLabelName)){
                     	sObj.put(sourceApiName, sourceRecordId);
                    }
                    if(relatedChild_fields_map.containsKey('Account')){
                        sObj.put(sourceApiName, sourceRecordId);
                    }
                     //sObj.put()
                    sObjectList.add(sObj);
                }
            }
            if(!returnData.objectNotExistsInContact){
                if(!standrdSet.contains(returnData.value)){
				   system.debug('value==>'+returnData.value);
                    sobject sObj;
                    global_describe = Schema.getGlobalDescribe();
                	relatedChild_fields_map = global_describe.get(returnData.value).getDescribe().fields.getMap();
                	sObj = Schema.getGlobalDescribe().get(returnData.value).newSObject();
                     sObj.put('Name',contactObj.Name);
                     sObj.put(sourceApiName, sourceRecordId);
                    sObjectList.add(sObj);
                }
            }
             if(!returnData.objectNotExistsInDestination){
                if(!standrdSet.contains(returnData.value)){
				   system.debug('value==>'+returnData.value);
                    sobject sObj;
                    global_describe = Schema.getGlobalDescribe();
                	relatedChild_fields_map = global_describe.get(returnData.value).getDescribe().fields.getMap();
                	sObj = Schema.getGlobalDescribe().get(returnData.value).newSObject();
                     sObj.put('Name','DestLeadConversion');
                     sObj.put(sourceApiName, sourceRecordId);
                    sObjectList.add(sObj);
                }
            }
        }
        
    }
    
    public static Attachment NotesAndattach(String strId, String OwnrId, Attachment attch){
            Attachment attachObj = new Attachment();
            attachObj.Name = attch.Name != null ? attch.Name : null;                   
            attachObj.Body = attch.Body != null ? attch.Body : null;
            attachObj.ContentType = attch.ContentType != null ? attch.ContentType : null;
            attachObj.Description = attch.Description != null ? attch.Description : null;
            attachObj.OwnerId = OwnrId != null ? OwnrId : null;
            attachObj.ParentId = strId != null ? strId : null;	
            return attachObj;
    }
    
    public static Note insertNotes(String strId, string OwnrId, Note noteObj){
        Note notesObj = new Note();
        notesObj.Title = noteObj.Title != null ? noteObj.Title : null;
        notesObj.Body = noteObj.Body != null ? noteObj.Body : null;
        notesObj.OwnerId = OwnrId != null ? OwnrId : null;
        notesObj.ParentId = strId != null ? strId : null;
        return notesObj;
    }
    
    public static contentVersion insertContVersion(contentVersion contVerObj,String ownrId){
        contentVersion contVer = new contentVersion();
        contVer.Title = contVerObj.Title != null ? contVerObj.Title : null;
        contVer.PathOnClient = contVerObj.PathOnClient;
        contVer.Description = contVerObj.Description != null ? contVerObj.Description : null;
        contVer.VersionData = contVerObj.VersionData;
        contVer.OwnerId = ownrId != null ? ownrId : null;
        return contVer;
    }
    
    public static Task insertTask(String strId, string ownrId, Task taskObj, String objName){
        Task tsk = new Task();
        tsk.OwnerId = ownrId != null ? ownrId : null;
        tsk.Subject = taskObj.Subject != null ? taskObj.Subject : null;
        tsk.Status = taskObj.Status != null ? taskObj.Status : null;
        tsk.Priority = taskObj.Priority != null ? taskObj.Priority : null;
        if(objName == 'Contact' || objName == 'Lead'){
          	tsk.WhoId = String.isNotBlank(strId) ? strId : null;
        }else{
            tsk.WhatId = String.isNotBlank(strId) ? strId : null;
        }
        tsk.Description = taskObj.Description != null ? taskObj.Description : null;
        tsk.type = taskObj.type != null ? taskObj.type : null;
        tsk.ActivityDate = taskObj.ActivityDate != null ? taskObj.ActivityDate : null;
        return tsk;
    }
    
    
    public static Event insertEvent(String strId, String ownrId, Event evtObj, String objName){
        Event evt = new Event();
        evt.OwnerId = ownrId != null ? ownrId : null;
        evt.Subject = evtObj.Subject != null ? evtObj.Subject : null;
        evt.Description = evtObj.Description != null ? evtObj.Description : null;
        evt.StartDateTime = evtObj.StartDateTime != null ? evtObj.StartDateTime : null;
        evt.EndDateTime = evtObj.EndDateTime != null ? evtObj.EndDateTime : null;
        evt.ActivityDate = evtObj.ActivityDate != null ? evtObj.ActivityDate : null;
        evt.ActivityDateTime = evtObj.ActivityDateTime != null ? evtObj.ActivityDateTime : null;
        if(objName == 'Contact' || objName == 'Lead'){
          	evt.WhoId = String.isNotBlank(strId) ? strId : null;
        }else{
         	evt.WhatId = strId;
        }
        evt.IsAllDayEvent = evtObj.IsAllDayEvent;
        return evt;
    }
    
    public class wrapperClass{
        @AuraEnabled
        public Account accObj;
        @AuraEnabled
        public contact contObj;
        @AuraEnabled
        public sObject DestObj;
        @AuraEnabled
        public String destinationName;
        
        public wrapperClass(Account accObj,contact contObj,sObject DestObj,string destinationName){
            this.accObj = accObj;
            this.contObj = contObj;
            this.DestObj = DestObj;
            this.destinationName = destinationName;
        }
    }
}