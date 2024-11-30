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
    var activityWrapper = document.getElementById("discordActivity");

    if (status === "online") {
        lanyardDiscord.style.display = "flex";
        updateActivityImages(activities);
        updateActivityDetails(activities);
    } else {
        lanyardDiscord.style.display = "none";
    }
}

function updateActivityImages(activities) {
    var activityImages = document.getElementById("discordActivityImages");
    var largeImageElem = document.getElementById("activityLogoLarge");
    var smallImageElem = document.getElementById("activityLogoSmall");
    var isMobile = isMobilePlatform();

    if (activities.length && activities[0] && activities[0].assets) {
        var assets = activities[0].assets;
        var largeImage = assets.large_image;
        var smallImage = assets.small_image;

        if (largeImage) {
            largeImageElem.style.display = "initial";
            largeImageElem.src = getImageUrl(largeImage, activities[0].application_id);
            largeImageElem.alt = "Album art for " + assets.large_text;
            largeImageElem.title = assets.large_text;
        } else {
            largeImageElem.style.display = "none";
        }

        if (smallImage) {
            smallImageElem.style.display = "initial";
            smallImageElem.src = getImageUrl(smallImage, activities[0].application_id);
            smallImageElem.alt = "Application icon for " + activities[0].name;
            smallImageElem.title = activities[0].name;
            if (!largeImage) {
                smallImageElem.width = 96;
                smallImageElem.height = 96;
            } else {
                smallImageElem.width = 32;
                smallImageElem.height = 32;
            }
        } else {
            smallImageElem.style.display = "none";
        }

        activityImages.style.display = (largeImage || smallImage) ? "block" : "none";
        adjustTextAlignment((largeImage || smallImage), isMobile);
    } else {
        activityImages.style.display = "none";
        adjustTextAlignment(false, isMobile);
    }
}

function updateActivityDetails(activities) {
    var wrapper = document.getElementById("discordActivity");
    if (activities.length) {
        wrapper.style.display = "flex";
        var activity = activities[0];
        document.getElementById("activityName").textContent = activity.name;
        document.getElementById("activityState").textContent = formatActivityState(activity.state);
        document.getElementById("activityDetails").textContent = activity.details;
        updateActivityTime(activity.timestamps);
    } else {
        wrapper.style.display = "none";
    }
}

function formatActivityState(state) {
    var byRegex = /by\s*(?:\(.*\)|[^)]+)/;
    return byRegex.test(state) ? state.replace(/by\s+/, "") : state;
}

function updateActivityTime(timestamps) {
    var now = new Date();
    var timeElem = document.getElementById("activityTime");
    var remainingElem = document.getElementById("remaining");
    var elapsedElem = document.getElementById("elapsed");

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
        remainingElem.classList.remove("inline");
        elapsedElem.classList.remove("inline");
    }
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
    remainingElem.classList.toggle("inline", isRemaining);
    elapsedElem.classList.toggle("hide", isRemaining);
    elapsedElem.classList.toggle("inline", !isRemaining);
}

function getImageUrl(image, appId) {
    return image.indexOf("external") !== -1
        ? "https://media.discordapp.net/external/" + image.split("mp:external/")[1]
        : "https://cdn.discordapp.com/app-assets/" + appId + "/" + image + ".png?size=256";
}

function adjustTextAlignment(hasImage, isMobile) {
    var align = isMobile || !hasImage ? 'center' : 'left';
    var ids = ['activityName', 'activityState', 'activityDetails', 'timeremaning'];
    for (var i = 0; i < ids.length; i++) {
        document.getElementById(ids[i]).style.textAlign = align;
    }

    document.getElementById("discordActivityImages").style.paddingRight = hasImage ? "20px" : "0";
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
