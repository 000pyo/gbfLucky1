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



var AT1Time = 14;
var AT2Time = 0;

/*
*For first run
*/
setAlarm('AT1', AT1Time, 0, true);

setAlarm('AT2', AT2Time, 0, true);

setAlarm('midnight', 24, 0, false);



/*
*Handled onAlarm
*/
chrome.alarms.onAlarm.addListener(function(alarm){

    var opt = null;

    switch(alarm.name){
        case 'AT1':
            opt = getNotificationOption('Aassault Time 1', 'Assault Time 1 at ' + AT1Time + '.00 (GMT+9) \n Ringed ' + new Date(Date.now()));
            opt.iconUrl = "/img/stamp11.png";
            chrome.notifications.create("AT1", opt, notificationRinged);

            setAlarm('AT1e', AT1Time+1, 0, true);
            break;
        case 'AT1e':
            opt = getNotificationOption('Aassault Time 1 End', 'Assault Time 1 Ended.');
            opt.iconUrl = "/img/stamp10.png";
            chrome.notifications.create("AT1", opt, notificationRinged);

            break;
        case 'AT2':
            opt = getNotificationOption('Aassault Time 2', 'Assault Time 2 at ' + AT2Time + '.00 (GMT+9) \n Ringed ' + new Date(Date.now()));
            opt.iconUrl = "/img/stamp11.png";
            chrome.notifications.create("AT2", opt, notificationRinged);

            setAlarm('AT2e', AT2Time+1, 0, true);
            break;
        case 'AT2e':
            opt = getNotificationOption('Aassault Time 2 End', 'Assault Time 2 Ended.');
            opt.iconUrl = "/img/stamp10.png";
            chrome.notifications.create("AT1", opt, notificationRinged);

            
            break;
        case 'lucky':
            opt = getNotificationOption('Lucky Gacha Time', 'Lucky Gacha Time \n' + new Date(Date.now()));
            opt.iconUrl = "/img/stamp2.png";
            opt.priority = 1;
            chrome.notifications.create("lucky", opt, notificationRinged);    
            break;
        case 'midnight':
            console.log("Midnight ringed");
        
            //Set new alarm for new day
            setAlarm('midnight', 24, 0, false);

            setAlarm('AT1', AT1Time, 0, true);
        
            setAlarm('AT2', AT2Time, 0, true);
            break;

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

function getEpochTimeWTimeZone(hour, min){

    var timeZone = (new Date(Date.now()).getTimezoneOffset()) / (-60);
    var timeDiff = 0;
    if (timeZone != 9)
    {
        timeDiff = (9 - timeZone);
    }

    var alarmTime = getEpochTime(hour - timeDiff, 0);

    if (hour < timeDiff)
    {
        alarmTime += 24*60*60*1000;
    }

    return alarmTime;
}

/*
*Alarms Generator
*/
function setAlarm(name, hour, min, timezone)
{
    if(timezone)
    {
        chrome.alarms.create(name, {when:getEpochTimeWTimeZone(hour, min)});
        console.log('Alarm name ' + name + ' is set with timezone support.'); 
    }
    else
    {
        chrome.alarms.create(name, {when:getEpochTime(hour, min)});       
        console.log('Alarm name ' + name + ' is set.'); 
    }
    
}


/*
*Notifications Methods
*/

function getNotificationOption(title, message)
{
    var opt = {
            type : "basic",
            title: title,
            message: message,
            iconUrl:"/img/white.png"
        }

    return opt;
}

function notificationRinged(notID){
    console.log(notID + " ringed at " + new Date(Date.now()));
}

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
