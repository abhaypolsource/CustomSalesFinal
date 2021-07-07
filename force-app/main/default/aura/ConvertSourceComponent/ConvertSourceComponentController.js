({
    handleCloseModal : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },

    handlepopup : function(component,event,helper) {
        component.set("v.openModel",event.getParam('flag'));
        console.log('flagg'+component.get("v.openModel"));
    },

   
})