/**
 * @description       : 
 * @author            : Mradul Maheshwari
 * @group             : 
 * @last modified on  : 05-20-2021
 * @last modified by  : Mradul Maheshwari
 * Modifications Log 
 * Ver   Date         Author              Modification
 * 1.0   05-17-2021   Mradul Maheshwari   Initial Version
**/
public with sharing class ConvertRecord {
    
    static Boolean existingAccountPresent = false;
    static Boolean existingContactPresent = false;

    Account existingAccount;
    Contact existingContact;

    @AuraEnabled(cacheable=true)
    public static List<Account> getAcountRecord(Id recordId,String sourceObjectApiName ){

        String sourceCompanyApiName = 'Company__c';

        List<Sobject> sourceRecordList = Database.query('Select Id,Name,'+sourceCompanyApiName+' from '+sourceObjectApiName+' where Id =:recordId');
        String companyName = String.valueOf(sourceRecordList[0].get(sourceCompanyApiName.toLowerCase()));
        List<Account> accountList = Database.query('Select Id,Name from Account where name =:companyName');



        /*

        String sourceQuery = 'select id,Company__c from '+objectApiName+'where id =:\''+recordId+'\'';
        
        String companyName = Database.query(sourceQuery)[0].company;
        
        String accountQuery = 'select id,Name from Account where name = :\''+companyName+'\'';
        List<Account> accountList = Database.query(accountQuery);

        */



        if(accountList.size() >0){
            existingAccountPresent = true;
            return accountList;
        } else {
            return null;
        }


        /*
        List<sObject> sobjList = Database.query('SELECT Id FROM MyCustomObject__c WHERE Name = :myTestString');
        List<SObject> records = [select id,name from account where name =: companyName];
        
        string Accname='';
        Lead__c ld=[select id,Company_Name__c, Name,status__c from Lead__c where id=:LeadId];
        system.debug('ld---'+ld.Name);
        //ld.Name=Accname;
        return ld;
        
        return records;
        */
    }

     @AuraEnabled(cacheable=true)
    public static List<Contact> getContactRecord(Id recordId,String sourceObjectApiName ){

        String sourceFirstNameApiName = 'FirstName__c';
        String sourceLastNameApiName = 'LastName__c';

        List<Sobject> sourceRecordList = Database.query('Select Id,Name,'+sourceFirstNameApiName+','+sourceLastNameApiName+' from '+sourceObjectApiName+' where Id =:recordId');
        String firstName = String.valueOf(sourceRecordList[0].get(sourceFirstNameApiName.toLowerCase()));
        String lastName = String.valueOf(sourceRecordList[0].get(sourceLastNameApiName.toLowerCase()));

        List<Contact> contactList = Database.query('Select Id,Name,FirstName,LastName from Contact where FirstName =:firstName and LastName =:lastName');

        if(contactList.size() >0){
            existingContactPresent = true;
            return contactList;
        } else {
            return null;
        }

    }



}