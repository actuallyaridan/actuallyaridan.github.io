const userID = "701403809129168978";
const loadingDiv = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const spinner = document.getElementById("loadingSpinner");
const contentDiv = document.getElementById("loadedLanyard");
let discordDataLatest;

console.log('[Lanyard] Connecting to Lanyard WebSocket at wss://api.lanyard.rest/socket...');
const websocket = new WebSocket("wss://api.lanyard.rest/socket");

websocket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log(data);

    if (data.op === 1) {
        console.log("%c[Lanyard] Connection to Lanyard WebSocket returned 200 (OK)", "color:green;");
        console.log("[Lanyard] Subscribing to user ID " + userID + "...");
        websocket.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: userID }
        }));
        const heartbeatInterval = data.d.heartbeat_interval;
        setInterval(function () {
            websocket.send(JSON.stringify({ op: 3 }));
        }, heartbeatInterval);
    } else if (data.op === 0) {
        discordDataLatest = data.d;
        console.log("%c[Lanyard] Received data from API for user ID " + userID, "color:green;");
    }
};

function isMobilePlatform() {
    return window.innerWidth < 739;
}

const fetchDataInterval = setInterval(updateLanyardData, 900);

function updateLanyardData() {
    try {
        const discordData = discordDataLatest || {};
        const activities = discordData.activities || [];
        const discord_status = discordData.discord_status || "";

        updateStatusWrapper(discord_status);
        updateActivityInfo(activities, discord_status);

        loadingDiv.style.display = "none";
        contentDiv.style.display = "flex";
        errorMessage.style.display = "none";
    } catch (error) {
        handleError(error);
    }
}

function updateStatusWrapper(status) {
    const statusWrapper = document.getElementById("statusWrapper");
    if (statusWrapper) {
        statusWrapper.className = status;
        statusWrapper.textContent = capitalizeFirstLetter(status);
    }
}


function updateActivityInfo(activities, status) {
    const lanyardDiscord = document.getElementById("lanyardDiscord");

    if (status === "online") {
        const lanyardDiscord = document.getElementById("lanyardDiscord");
        if (lanyardDiscord) lanyardDiscord.style.display = "flex";
        

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
        } else {  
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
    const activityLogoLarge = document.getElementById("activityLogoLarge");
    const activityLogoSmall = document.getElementById("activityLogoSmall");

    // Hide images if there are no activities or assets
    if (!activities || activities.length === 0 || !activities.some(activity => activity.assets && activity.assets.large_image)) {
        if (activityLogoLarge) activityLogoLarge.style.display = "none";
        if (activityLogoSmall) activityLogoSmall.style.display = "none";
        return;
    }

    // Process each activity
    activities.forEach(function (activity) {
        if (activity.assets && activity.assets.large_image) {
            if (activityLogoLarge) {
                const largeImageUrl = getImageUrl(activity.assets.large_image, activity.application_id);
                if (largeImageUrl) {
                    activityLogoLarge.src = largeImageUrl;
                    activityLogoLarge.alt = "Large image for " + activity.name;
                    activityLogoLarge.title = activity.name;
                    activityLogoLarge.style.display = "block"; // Show when available
                } else {
                    activityLogoLarge.style.display = "none";
                }
            }

            if (activityLogoSmall) {
                if (activity.assets.small_image) {
                    const smallImageUrl = getImageUrl(activity.assets.small_image, activity.application_id);
                    if (smallImageUrl) {
                        activityLogoSmall.src = smallImageUrl;
                        activityLogoSmall.alt = "Small image for " + activity.name;
                        activityLogoSmall.title = activity.name;
                        activityLogoSmall.style.display = "block"; // Show when available
                    } else {
                        activityLogoSmall.style.display = "none";
                    }
                } else {
                    activityLogoSmall.style.display = "none";
                }
            }
        }
    });
}

function updateActivityDetails(activities) {
    const activityName = document.getElementById("activityName");
    const activityDetails = document.getElementById("activityDetails");
    const activityState = document.getElementById("activityState");

    // Hide activity text elements if there are no activities
    if (!activities || activities.length === 0) {
        if (activityName) activityName.style.display = "none";
        if (activityDetails) activityDetails.style.display = "none";
        if (activityState) activityState.style.display = "none";
        return;
    }

    // Display the first activity
    const activity = activities[0];

    if (activityName) {
        activityName.textContent = activity.name;
        activityName.style.display = "block"; // Show when available
    }

    if (activityDetails) {
        activityDetails.textContent = activity.details || "No details available";
        activityDetails.style.display = activity.details ? "block" : "none";
    }

    if (activityState) {
        activityState.textContent = activity.state || "";
        activityState.style.display = activity.state ? "block" : "none";
    }

    updateActivityTime(activity.timestamps, ""); 
}


function updateAppleMusicInfo(activity) {
    const amLanyardDiscord = document.getElementById("amLanyardDiscord");
    const amActivityLogoLarge = document.getElementById("amActivityLogoLarge");
    const amActivityLogoSmall = document.getElementById("amActivityLogoSmall");

    amLanyardDiscord.style.display = "flex";

    // Set Apple Music images
    if (activity.assets) {
        const assets = activity.assets;
        const largeImage = assets.large_image;
        const smallImage = assets.small_image;

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
    const now = new Date();
    const timeElem = document.getElementById(prefix + "ActivityTime");
    const remainingElem = document.getElementById(prefix + "Remaining");
    const elapsedElem = document.getElementById(prefix + "Elapsed");

    if (timestamps && timestamps.end) {
        const timeRemaining = calculateTimeDifference(new Date(timestamps.end), now);
        timeElem.textContent = formatTime(timeRemaining);
        toggleTimeDisplay(remainingElem, elapsedElem, true);
    } else if (timestamps && timestamps.start) {
        const timeElapsed = calculateTimeDifference(now, new Date(timestamps.start));
        timeElem.textContent = formatTime(timeElapsed);
        toggleTimeDisplay(remainingElem, elapsedElem, false);
    } else {
        timeElem.textContent = "-:-";
        elapsedElem.classList.add("hide");
        remainingElem.classList.add("hide");
    }
}

function formatActivityState(state) {
    const byRegex = /by\s*(?:\(.*\)|[^)]+)/;
    return byRegex.test(state) ? state.replace(/by\s+/, "") : state;
}

function calculateTimeDifference(endTime, startTime) {
    const msDifference = endTime - startTime;
    const seconds = Math.max(0, Math.floor(msDifference / 1000));
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
