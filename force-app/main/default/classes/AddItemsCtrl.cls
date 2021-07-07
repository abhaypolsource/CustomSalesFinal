/*******************************************************************
 * Description      :   This class is controller class for addItems LWC cmp.
 * Created Date     :   16th June 2021
 * Created By       :   Tapas Kumar
 *******************************************************************/
	public with sharing class AddItemsCtrl {
    public AddItemsCtrl() {
    }
/*******************************************************************
 * DESCRIPTION : This method is to fetch all the Item records
 ********************************************************************/
 	 @AuraEnabled
    public static List<ItemsWrapper> getItems(){
        List <Item__c> itemList = new List <Item__c>();
        ItemsWrapper itmWrappr ;
        List<ItemsWrapper> itemWrapprList = new List <ItemsWrapper>();
        List <Item_Price_Book__c> itmpricebkList ;


      try {
            itemList = [SELECT Id, Name , Item_Code__c, Item_description__c,
                                    (SELECT Id, Unit_Price__c from Item_Price_Books__r) FROM Item__c];
            if (itemList.size() > 0) {
                system.debug('Test'+itemList);
                for (Item__c itm : itemList) {
                    itmpricebkList = new List <Item_Price_Book__c>();
                    itmpricebkList = itm.Item_Price_Books__r;

                    itmWrappr = new ItemsWrapper();
                    itmWrappr.itemName = itm.Name;
                    itmWrappr.itemCode = itm.Item_Code__c;
                    itmWrappr.unitPrice = itmpricebkList[0].Unit_Price__c;
                    itmWrappr.itemDescription = itm.Item_description__c;
                    itmWrappr.ItemId=itm.id;
                    itemWrapprList.add(itmWrappr);
                }
            }
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
            
        }
        return itemWrapprList;
    }

    @AuraEnabled
    public Static void updateRecords (List<Object> unitCode, String recordId) {
        Set <String> unitCodeSet = new Set <String>();
        List <Item__c> itemList = new List <Item__c>();
            List <Item__c> updatedItemList = new List <Item__c>();
        try{
            for (Object obj : unitCode) {
                unitCodeSet.add (String.valueOf(obj));
            }

            itemList = [SELECT Id, Item_Code__c, Deal__c FROM  Item__c WHERE Item_Code__c IN : unitCodeSet];
            if (itemList.size() > 0) {
                for (Item__c item : itemList) {
                    item.Deal__c = recordId;
                    updatedItemList.add(item);
                }
            }
            update updatedItemList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
            
        }

    }
    
    
  @AuraEnabled
    public Static void CreateDealItems(String recordId, List<Map<String, Object>>  datavalue ) {
       system.debug('datavalue'+datavalue); 
        system.debug('recordId'+recordId); 
        
        list<DealItem__c> deal= new list<DealItem__c>();
        for(Map<String, Object> md:datavalue ){
            system.debug('testmymd'+md); 
            DealItem__c dealitem= new DealItem__c(Deal__c=recordId);
              string strDate = string.valueof(md.get('servicedate'));
            if(strDate!=null){
               dealitem.ServiceDate__c=Date.ValueOf(strDate); 
            }            
            dealitem.name=String.valueof(md.get('itemName'));
            dealitem.Quantity__c= integer.ValueOf(md.get('itemCode'));
            dealitem.UnitPrice__c= integer.ValueOf(md.get('unitPrice'));
            dealitem.Description__c =String.ValueOf(md.get('itemDescription'));
            deal.add(dealitem);
        }
        insert deal;
    }

    /*Wrapper class to store Item fields*/
   public class ItemsWrapper {
        @AuraEnabled public String itemName;
		@AuraEnabled public String itemCode;
        @AuraEnabled public Decimal unitPrice;
        @AuraEnabled public String itemDescription;
         @AuraEnabled public string ItemId;
        public ItemsWrapper(){
            
        }
        
    }
}