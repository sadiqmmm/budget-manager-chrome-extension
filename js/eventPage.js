var contextMenuItem = {
	"id": "spendMoney",
	"title": "SpendMoney",
	"contexts": ["selection"]
};

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickData){
	if (clickData.menuItemId == "spendMoney" && clickData.selectionText) {
		console.log("sd");
		if (isInt(clickData.selectionText)) {
			chrome.storage.sync.get(['total', 'limit'], function(budget){
				var newTotal = 0;
		
				if (budget.total) {
					newTotal += parseInt(budget.total);
				}
				newTotal += parseInt(clickData.selectionText);

				chrome.storage.sync.set({'total': newTotal}, function(){
					if (newTotal >= budget.limit) {
						var notifOptions = {
							type: 'basic',
							iconUrl: 'img/icon48.png',
							title: 'Limit reached!',
							message: "Looks like you've reached your limit!"
						};
						chrome.notifications.create('limitNotif', notifOptions);
					}
				});
			});
		}
	}
});

chrome.storage.onChanged.addListener(function(changes, storageName){
  chrome.browserAction.setBadgeText({"text": changes.total.newValue.toString()});
});