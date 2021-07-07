@isTest(seeAllData=false)
public class ConversionMappingControllerTest{


 public static testmethod void getObjectsTest(){

Object_Detail__c obd=new Object_Detail__c();
obd.Destination_Object_Api_Name__c='Contact';
obd.Destination_Object_Label__c='Contact';
obd.Sourcce_Object_Api_Name__c='Account';
obd.Source_Object_Label__c='Account';
obd.Name='ObjectMapping';
insert obd;
Field_Detail__c fd=new Field_Detail__c();
fd.Name='FieldMapping0';
fd.Account_Field_Api_Name__c='Name';
fd.Account_Field_Label__c='Account Name ';
fd.Contact_Field_Api_Name__c='OtherStreet';
fd.Contact_Field_Label__c='Other Street ';
fd.Destination_Field_Api_Name__c='Description';
fd.Destination_Field_Label__c='Description';
fd.Source_Field_Api_Name__c='Name';
fd.Source_Field_Label__c='Name';

insert fd;
Test.startTest();
ConversionMappingController.getObjects(); 
ConversionMappingController.getFields('Account','Contact',false);
ConversionMappingController.onSave('objectMapping','fieldMapping','relatedChilObjectMapping');
Test.stopTest();






}

}