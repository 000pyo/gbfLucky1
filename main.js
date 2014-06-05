/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */


chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        width: 350,
        height: 450
    });
});



var AT1Time = 12;
var AT2Time = 22;

/*
*For first run
*/
chrome.alarms.create('AT1', {when:getEpochTime(AT1Time, 0)});
console.log('AT1 Created at ' + new Date(Date.now()));

chrome.alarms.create('AT2', {when:getEpochTime(AT2Time, 0)});
console.log('AT2 Created at ' + new Date(Date.now()));

chrome.alarms.create('midnight', {when:getEpochTime(0, 0) + 1000*60*60*24 });
console.log('midnight Created at ' + new Date(Date.now()));



/*
*Handled onAlarm
*/
chrome.alarms.onAlarm.addListener(function(alarm){

    if (alarm.name == 'AT1')
    {
        chrome.notifications.create("AT", {type:"basic", title:"Assault Time", message:"Assault Time 1 " + new Date(Date.now()), iconUrl:"/img/stamp11.png"}, function(){console.log("AT1 ringed at " + new Date(Date.now()));});
    }
    else if (alarm.name == 'AT2')
    {
        chrome.notifications.create("AT", {type:"basic", title:"Assault Time", message:"Assault Time 2" + new Date(Date.now()), iconUrl:"/img/stamp11.png"}, function(){console.log("AT2 ringed at " + new Date(Date.now()));});    
    }
    else if (alarm.name == 'lucky')
    {
        chrome.notifications.create("lucky", {type:"basic", title:"Lucky Gacha Time", message:"Lucky Gacha Time " + new Date(Date.now()), iconUrl:"/img/stamp2.png"}, function(){console.log("lucky ringed at " + new Date(Date.now()));});    
    }
    else if (alarm.name == 'midnight')
    {
        console.log("Midnight ringed");
        
        chrome.alarms.create('midnight', {when:getEpochTime(0, 0) + 1000*60*60*24 });
        console.log("Set new midnight alarm");

        chrome.alarms.create('AT1', {when:getEpochTime(AT1Time, 0)});
        console.log('AT1 Created at ' + new Date(Date.now())); 

        chrome.alarms.create('AT2', {when:getEpochTime(AT2Time, 0)});
        console.log('AT2 Created at ' + new Date(Date.now()));
    }
    else
    {
    }
    //Add listener to notifications
    chrome.notifications.onClicked.addListener(notificationClicked);

    
});


/**
 *Utilities Function
*/

function getEpochTime(hour, min){
        var newTime = new Date(Date.now());
        newTime.setHours(hour);
        
        newTime.setMinutes(min);

        newTime.setSeconds(0);


        return newTime.getTime();
    }

function getAlarmTime(hour, min){
    if (Date.now() - getEpochTime(hour, min) > 1000*60*60*24)
    {
        return getEpochTime(hour, min) + 1000*60*60*24;
    }
    else
    {
        return getEpochTime(hour, min);
    }
}

function getAlarmTimeWTimeZone(hour, min){

    var alarmTime = getEpochTime(hour, 0);

    if(Date.now() > alarmTime + 24*60*60*1000)
    {
        alarmTime += 24*60*60*1000;
    }

    var timeZone = (new Date(Date.now()).getTimezoneOffset()) / (-60);
    var timeDiff = 0;
    if (timeZone != 9)
    {
        timeDiff = (9 - timeZone);
    }

    alarmTime -= timeDiff*1000*60*60;

    return alarmTime;
}


/*
*Notification methods
*/
function notificationClosed(notID, bByUser) {
    console.log("The notification '" + notID + "' was closed" + (bByUser ? " by the user" : ""));
}

function notificationClicked(notID) {
    console.log("The notification '" + notID + "' was clicked");
    //Clear the clicked notifications
    chrome.notifications.clear(notID, function(){});
}

function notificationBtnClick(notID, iBtn) {
    console.log("The notification '" + notID + "' had button " + iBtn + " clicked");
}
