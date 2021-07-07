/*******************************************************************
 * Description		:	This class is controller class for displayProductTables LWC cmp.
 * Created Date		:	11th June 2021
 * Created By		:	Tapas Kumar
 *******************************************************************/
public with sharing class displayProductTableCtrl {
    public displayProductTableCtrl() {
    }

/***************************************************************
* Description : This method is to fetch products
***************************************************************/

    @AuraEnabled
    public static List<productWrapper> getProducts(String name){
        List<Product2> productList = new List <Product2>();
        List<productWrapper> wrapperList = new List <productWrapper>();
        productWrapper wrap;
        List<PricebookEntry> pbentries;
        String prdName ;
        try {
            if (String.isBlank(name)) {
                productList = [SELECT Id, Name, ProductCode, Description, Family,
                                    (SELECT UnitPrice from PricebookEntries ) FROM Product2];
            } else {
                prdName = '%'+name+'%';
                productList = [SELECT Id, Name, ProductCode, Description, Family,
                                    (SELECT UnitPrice from PricebookEntries ) FROM Product2 WHERE Name LIKE: prdName];
            }
            
            if (! productList.isEmpty()) {
                for (Product2 prdct : productList) {
                    pbentries = new List <PricebookEntry> ();
                    pbentries = prdct.PricebookEntries;
                    wrap = new productWrapper();
                    wrap.productName = prdct.Name;
                    wrap.ProductCode = prdct.ProductCode;
                    wrap.listPrice = pbentries[0].UnitPrice;
                    wrap.prdctDscrption = prdct.Description;
                    wrap.productFamily = prdct.Family;
                    wrapperList.add(wrap);
                }
            }
        } catch (Exception e) {
            System.debug('Error occured'+  e.getMessage());
            wrapperList = null;
        }
        return wrapperList;
    }

    /* Wrapper class to store product fields*/
    public class productWrapper {
        @AuraEnabled public String productName;
        @AuraEnabled public String productCode;
        @AuraEnabled public Decimal listPrice;
        @AuraEnabled public String prdctDscrption;
        @AuraEnabled public String productFamily;
    }
}