// Uber Bloodhound Chrome Extension
// Coded and designed by Ryan Bachman
// REDACTED

// Create variable to store information for JIRA section of context menu.
var contextMenuJIRA = {
    "id": "findJIRA",
    "title": "Find in JIRA",
    "contexts": ["selection"]
}

// Create variable to store information for Teamdot section of context menu.
var contextMenuTeamdot = {
    "id": "findTeamdot",
    "title": "Find in Teamdot",
    "contexts": ["selection"]
}

// Create variable to store information for Salesforce section of context menu.
var contextMenuSalesforce = {
    "id": "findSalesforce",
    "title": "Find in Salesforce",
    "contexts": ["selection"]
}

function unicodeBase64Encode(text) {
    return window.btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function(match, p1) {
                                                        return String.fromCharCode('0x' + p1);
                                                        }));
}

// Create the context menu options so it appears in the right click menu while text is highlighted.
chrome.contextMenus.create(contextMenuJIRA);
chrome.contextMenus.create(contextMenuTeamdot);
chrome.contextMenus.create(contextMenuSalesforce);

// Add a listener that does something when the user clicks on the menu options.
chrome.contextMenus.onClicked.addListener(function (clickData) {
                                          
// If the user clicks on Find in JIRA and text is selected...
if (clickData.menuItemId === "findJIRA" && clickData.selectionText){
    var jira = jQuery.getJSON("https://jira.REDACTED.com/rest/api/2/search?limit=1&jql=project = OC and phab ~ " + clickData.selectionText + "&fields=id,key");
                                          
    jira.done(function(a) {
        if (0 < a.total) {
            a = a.issues[0].key
            window.open("https://jira.REDACTED.com/browse/" + a);
        }
        else {
            window.alert("No JIRA found that's linked to this Phab. If this was created by an REDACTED, it's possible they did not update the Phab field in JIRA.");
        }
    });
}
// If the user clicks on Find in Teamdot and text is selected...
else if (clickData.menuItemId === "findTeamdot" && clickData.selectionText) {
var td = jQuery.getJSON("https://team.REDACTED.com/rest/api/content/search?limit=1&expand=body.view&cql=text ~ " + clickData.selectionText + " and type = page and space = CPSU order by lastmodified desc");
                                          
    td.done(function(a) {
        if (0 < a.size) {
            a = a.results[0]._links.tinyui;
            window.open("https://team.REDACTED.com" + a);
        }
        else {
            window.alert("No Teamdot page found that's linked to this Phab.");
        }
    });
}
// If the user clicks on Find in Salesforce and text is selected...
else if (clickData.menuItemId === "findSalesforce" && clickData.selectionText) {
    var sf = '{"componentDef":"forceSearch:searchPage","attributes":{"term":"' + clickData.selectionText + '","scopeMap":{"label":"Knowledge","id":"Knowledge__kav"},"context":{"disableSpellCorrection":false,"disableIntentQuery":false,"permsAndPrefs":{"OrgPermissions.UnionAppNavSmartScope":false,"SearchUi.feedbackComponentEnabled":false,"SearchUi.searchUIPilotFeatureEnabled":false,"SearchExperience.LeftNavEnhancementEnabled":true,"Search.crossObjectsAutoSuggestEnabled":true,"Search.maskSearchInfoInLogs":false,"SearchUi.orgHasAccessToSearchTermHistory":false,"SearchResultsLVM.lvmEnabledForSearchResultsOn":false,"SearchUi.searchUIInteractionLoggingEnabled":false,"MySearch.userCanHaveMySearchBestResult":false,"MySearch.userCanHaveMySearch":false}}},"state":{}}';
                                          
    sf = unicodeBase64Encode(sf);
                                          
    window.open("https://REDACTED.lightning.force.com/one/one.app#" + sf);
} else {
    console.error('Problem loading Bloodhound. Please email REDACTED.');
}
})