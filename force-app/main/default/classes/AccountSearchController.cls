/* 
  @description       : 
  @author            : Ashutosh Singh Nagarkoti
  @group             : 
  @last modified on  : 26-05-2021
  @last modified by  : Ashutosh Singh Nagarkoti
  Modifications Log 
  Ver   Date                  Author               Modification
  1.0   24-05-2021  Ashutosh Singh Nagarkoti      Initial Version*/





public with sharing class AccountSearchController {
    public AccountSearchController() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String actName){
        List<Account> accountList = new List<Account>();
        if(actName!=''){
            String accountName = '%' + actName + '%';
            accountList = [select id,name from Account where name like:accountName];
            return accountList;  
        }
        return accountList;
              
    }
}