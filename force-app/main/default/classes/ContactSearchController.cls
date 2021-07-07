/*
@description       : 
@author            : Ashutosh Singh Nagarkoti
@group             : 
@last modified on  : 28-05-2021
@last modified by  : Ashutosh Singh Nagarkoti
Modifications Log 
Ver   Date                  Author               Modification
1.0   24-05-2021  Ashutosh Singh Nagarkoti      Initial Version
*/

public with sharing class ContactSearchController {
    public ContactSearchController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(string cntName){
            
         //   String contactName = '%' + cntName + '%';
           // return[Select id,Name FROM Contact where name like:contactName];
           List<Contact> contactLists = new List<Contact>();
           if(cntName!=''){
               String contactName = '%' + cntName + '%';
               contactLists = [select id,name from Contact where name like:contactName];
               return contactLists;  
           }
           return contactLists;
            
        //return[Select Id,Name,Title,Phone,Email From Contact
       // LIMIT 10];
    }
}