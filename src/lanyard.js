var userID = "701403809129168978";
var loadingDiv = document.getElementById("loading");
var errorMessage = document.getElementById("errorMessage");
var spinner = document.getElementById("loadingSpinner");
var contentDiv = document.getElementById("loadedLanyard");
var discordDataLatest;

console.log('Connecting to Lanyard WebSocket at wss://api.lanyard.rest/socket...');
var websocket = new WebSocket("wss://api.lanyard.rest/socket");

websocket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    console.log(data);

    if (data.op === 1) {
        console.log("%cConnection to Lanyard WebSocket returned 200 (OK)", "color:green;");
        console.log("Attempting to access data for userID " + userID + "...");
        websocket.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: userID }
        }));
        var heartbeatInterval = data.d.heartbeat_interval;
        setInterval(function () {
            websocket.send(JSON.stringify({ op: 3 }));
        }, heartbeatInterval);
        console.log('Heartbeat interval set');
    } else if (data.op === 0) {
        discordDataLatest = data.d;
        console.log("%cData for userID " + userID + " received successfully", "color:green;");
    }
};

function isMobilePlatform() {
    return window.innerWidth < 739;
}

var fetchDataInterval = setInterval(updateLanyardData, 900);

function updateLanyardData() {
    try {
        var discordData = discordDataLatest || {};
        var activities = discordData.activities || [];
        var discord_status = discordData.discord_status || "";
        var discord_user = discordData.discord_user || {};

        updateStatusWrapper(discord_status);
        updateUserInfo(discord_user);
        updateActivityInfo(activities, discord_status);

        loadingDiv.style.display = "none";
        contentDiv.style.display = "flex";
        errorMessage.style.display = "none";
    } catch (error) {
        handleError(error);
    }
}

function updateStatusWrapper(status) {
    var statusWrapper = document.getElementById("statusWrapper");
    if (statusWrapper) {
        statusWrapper.className = status;
        statusWrapper.textContent = capitalizeFirstLetter(status);
    }
}

function updateUserInfo(user) {
    document.getElementById("discordName").textContent = "@" + user.username;
    document.getElementById("discordPFP").src = "https://cdn.discordapp.com/avatars/" + userID + "/" + user.avatar + ".webp?size=512";
}

function updateActivityInfo(activities, status) {
    var lanyardDiscord = document.getElementById("lanyardDiscord");

    if (status === "online") {
        lanyardDiscord.style.display = "flex";

        // Separate Apple Music activity from the rest
        let appleMusicActivity = null;
        let otherActivities = [];

        for (let activity of activities) {
            if (activity.name === "Apple Music" || activity.application_id === "773825528921849856") {
                appleMusicActivity = activity;
            } else {
                otherActivities.push(activity);
            }
        }

        // Handle Apple Music separately
        if (appleMusicActivity) {
            updateAppleMusicInfo(appleMusicActivity);
        } else {
            document.getElementById("amLanyardDiscord").style.display = "none";
        }

        if (otherActivities.length !== 0) {
            document.getElementById("discordActivity").style.display = "flex";
        }
        else {  
            document.getElementById("discordActivity").style.display = "none";
        }

        // Process other activities (including Code, and others)
        updateActivityImages(otherActivities);
        updateActivityDetails(otherActivities);
    } else {
        lanyardDiscord.style.display = "none";
    }
}


function updateActivityImages(activities) {
    // Check if there are any activities to process
    if (!activities || activities.length === 0) {
        return;
    }

    // Process each activity
    activities.forEach(function (activity) {
        // Check if activity has assets with large_image
        if (activity.assets && activity.assets.large_image) {
            var activityLogoLarge = document.getElementById("activityLogoLarge");
            var activityLogoSmall = document.getElementById("activityLogoSmall");

            // Ensure that the large image element exists before setting the source
            if (activityLogoLarge && activity.assets.large_image) {
                const largeImageUrl = getImageUrl(activity.assets.large_image, activity.application_id);
                if (largeImageUrl) {
                    activityLogoLarge.src = largeImageUrl;
                    activityLogoLarge.alt = "Large image for " + activity.name;
                    activityLogoLarge.title = activity.name;
                } else {
                }
            }

            // Ensure that the small image element exists before setting the source
            if (activityLogoSmall && activity.assets.small_image) {
                const smallImageUrl = getImageUrl(activity.assets.small_image, activity.application_id);
                if (smallImageUrl) {
                    activityLogoSmall.src = smallImageUrl;
                    activityLogoSmall.alt = "Small image for " + activity.name;
                    activityLogoSmall.title = activity.name;
                } else {
                }
            }
        } else {
        }
    });
}



function updateActivityDetails(activities) {
    var activityName = document.getElementById("activityName");
    var activityDetails = document.getElementById("activityDetails");
    var activityState = document.getElementById("activityState"); // Ensure this element exists in HTML

    if (!activities || activities.length === 0) {
        activityName.textContent = "No activity";
        activityDetails.textContent = "";
        activityState.textContent = "";
        return;
    }

    // Assuming only displaying the first activity for now
    let activity = activities[0];

    if (activityName && activityDetails) {
        activityName.textContent = activity.name;
        activityDetails.textContent = activity.details || "No details available";
        activityState.textContent = activity.state || ""; // Display state if available
        updateActivityTime(activity.timestamps, ""); 
    }
}


function updateAppleMusicInfo(activity) {
    var amLanyardDiscord = document.getElementById("amLanyardDiscord");
    var amActivityLogoLarge = document.getElementById("amActivityLogoLarge");
    var amActivityLogoSmall = document.getElementById("amActivityLogoSmall");

    amLanyardDiscord.style.display = "flex";

    // Set Apple Music images
    if (activity.assets) {
        var assets = activity.assets;
        var largeImage = assets.large_image;
        var smallImage = assets.small_image;

        if (largeImage) {
            amActivityLogoLarge.style.display = "initial";
            amActivityLogoLarge.src = getImageUrl(largeImage, activity.application_id);
            amActivityLogoLarge.alt = "Album art for " + assets.large_text;
            amActivityLogoLarge.title = assets.large_text;
        } else {
            amActivityLogoLarge.style.display = "none";
        }

        if (smallImage) {
            amActivityLogoSmall.style.display = "initial";
            amActivityLogoSmall.src = getImageUrl(smallImage, activity.application_id);
            amActivityLogoSmall.alt = "Application icon for Apple Music";
            amActivityLogoSmall.title = "Apple Music";
            amActivityLogoSmall.width = 96;
            amActivityLogoSmall.height = 96;
        } else {
            amActivityLogoSmall.style.display = "none";
        }
    }

    // Set Apple Music details
    document.getElementById("amActivityName").textContent = activity.name;
    document.getElementById("amActivityState").textContent = formatActivityState(activity.state);
    document.getElementById("amActivityDetails").textContent = activity.details;
    updateActivityTime(activity.timestamps, "am");
}

function updateActivityTime(timestamps, prefix = "") {
    var now = new Date();
    var timeElem = document.getElementById(prefix + "ActivityTime");
    var remainingElem = document.getElementById(prefix + "Remaining");
    var elapsedElem = document.getElementById(prefix + "Elapsed");

    if (timestamps && timestamps.end) {
        var timeRemaining = calculateTimeDifference(new Date(timestamps.end), now);
        timeElem.textContent = formatTime(timeRemaining);
        toggleTimeDisplay(remainingElem, elapsedElem, true);
    } else if (timestamps && timestamps.start) {
        var timeElapsed = calculateTimeDifference(now, new Date(timestamps.start));
        timeElem.textContent = formatTime(timeElapsed);
        toggleTimeDisplay(remainingElem, elapsedElem, false);
    } else {
        timeElem.textContent = "-:-";
        elapsedElem.classList.add("hide");
        remainingElem.classList.add("hide");
    }
}

function formatActivityState(state) {
    var byRegex = /by\s*(?:\(.*\)|[^)]+)/;
    return byRegex.test(state) ? state.replace(/by\s+/, "") : state;
}

function calculateTimeDifference(endTime, startTime) {
    var msDifference = endTime - startTime;
    var seconds = Math.max(0, Math.floor(msDifference / 1000));
    return {
        hours: Math.floor(seconds / 3600),
        minutes: Math.floor((seconds % 3600) / 60),
        seconds: seconds % 60
    };
}

function formatTime(time) {
    return time.hours > 0 ? pad(time.hours) + ":" + pad(time.minutes) + ":" + pad(time.seconds) : pad(time.minutes) + ":" + pad(time.seconds);
}

function toggleTimeDisplay(remainingElem, elapsedElem, isRemaining) {
    remainingElem.classList.toggle("hide", !isRemaining);
    elapsedElem.classList.toggle("hide", isRemaining);
}

function getImageUrl(image, appId) {
    return image.includes("external")
        ? "https://media.discordapp.net/external/" + image.split("mp:external/")[1]
        : "https://cdn.discordapp.com/app-assets/" + appId + "/" + image + ".png?size=256";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function pad(num) {
    return ("0" + num).slice(-2);
}

function handleError(error) {
    console.error("Error:", error);
    spinner.style.display = "none";
    contentDiv.style.display = "none";
    errorMessage.style.display = "flex";
}
