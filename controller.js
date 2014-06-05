function timeCtrl($scope,$timeout) {

    //Finish time of 
    $scope.finishTime;
    //Time remaining, calculate from minus finishTime and Date.now()
    $scope.timeRemaining;

    var remain;

    /*
    *For edit time remaining
    */
    $scope.editHr = 0;
    $scope.editMin = 0;
    $scope.editSec = 2;

    $scope.onTimeout = function(){
    	
    	mytimeout = $timeout($scope.onTimeout,1000);
        remain = $scope.finishTime - Date.now();
        $scope.timeRemaining = {
            hour:parseInt(remain/60/60/1000), 
            min:parseInt((remain/1000)%3600/60), 
            sec:parseInt((remain/1000)%60)};

        if ($scope.timeRemaining.hour + $scope.timeRemaining.min + $scope.timeRemaining.sec <=0)
        {
            updateButton();
        }

    }
        

        
    

    var mytimeout = $timeout($scope.onTimeout,1000);
    





    //Handled start button clicked
    $scope.startLucky= function(){

        //Get whether alarm is set or not
        chrome.alarms.get('lucky', function(alarm){
            //In case not
            if (typeof alarm == 'undefined')
            {
                $scope.finishTime = Date.now() + 1000*60*60*12;
                chrome.alarms.create('lucky', {when: $scope.finishTime});
                chrome.alarms.get('lucky', function(alarm){console.log("Alarm at " + new Date(alarm.scheduledTime) + " created.");});
                updateButton();
            }
            else{
                chrome.alarms.clear('lucky');
                console.log("lucky Alarm cleared");
                updateButton();
            }
        });
        //chrome.notifications.create('lucky', {type:"basic", title:"test", message:"Test", iconUrl:"/img/white-64x64.png"}, function(){console.log("Succesfully created notification");});

    }



    //For update buttpn appearance
    function updateButton(){
        chrome.alarms.get('lucky', function(alarm){
            if(typeof alarm == 'undefined')
            {
                $('#btnReset').text("Start");
                $('#btnRest').addClass("btn-success");
                $('#btnReset').removeClass("btn-danger");
                $('#showRemain').hide();
            }
            else
            {
                $('#btnReset').text("Stop");
                $('#btnRest').removeClass("btn-success");
                $('#btnReset').addClass("btn-danger");
                $('#showRemain').show();
            }
        });
    }

    //To handle when save edit is clicked
    $scope.editLuckyTime = function(){
        if($scope.editHr < 12 && $scope.editMin < 60 && $scope.editSec < 60)
        {

            //Clear lucky alarm            
            chrome.alarms.clear('lucky');
            console.log("lucky alarm cleared");

            //set new finish time
            $scope.finishTime = Date.now() + $scope.editHr*1000*60*60 + $scope.editMin*1000*60 + $scope.editSec*1000;
            
            chrome.alarms.create('lucky', {when: $scope.finishTime});
            console.log("new lucky alarm created");

            $('#editError').hide();
            $('#editLucky').hide();
            $("html, body").animate({ scrollTop: 0 }, "slow");
            updateButton();
            
        }
        else{
            $('#editError').show();    
        }
    }

    //To handle when cancel edit is clicked
    $scope.editLuckyCancel = function(){
        $('#editError').hide();
        $('#editLucky').hide();
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }

    //To handle when showEdit button is clicked
    $scope.showEdit = function(){
        $('#editLucky').show();
    }




    //On Document Load
    $(document).ready(function(){
        updateButton();
        
        $('#editError').hide();
        $('#editLucky').hide();

        chrome.alarms.get('lucky', function(alarm){
            if (typeof alarm != 'undefined')
            {
                $scope.finishTime = alarm.scheduledTime;
            }
        });

    });


}







