const userID = "701403809129168978";
const loadingDiv = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const spinner = document.getElementById("loadingSpinner");
const contentDiv = document.getElementById("loadedLanyard");
let discordDataLatest;

console.log('Connecting to Lanyard WebSocket at wss://api.lanyard.rest/socket...');
const websocket = new WebSocket("wss://api.lanyard.rest/socket");

websocket.onmessage = async function (event) {
    const data = JSON.parse(event.data);
    console.log(data);

    if (data.op === 1) {
        console.log("%cConnection to Lanyard WebSocket returned 200 (OK)", "color:green;");
        console.log(`Attempting to access data for userID ${userID}...`);
        websocket.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: userID }
        }));
        const { heartbeat_interval } = data.d;
        setInterval(() => {
            websocket.send(JSON.stringify({ op: 3 }));
        }, heartbeat_interval);
        console.log('Heartbeat interval set');
    } else if (data.op === 0) {
        discordDataLatest = data.d;
        console.log(`%cData for userID ${userID} received successfully`, "color:green;");
    }
};

function isMobilePlatform() {
    return window.innerWidth < 739;
}

let fetchDataInterval = setInterval(updateLanyardData, 900);

async function updateLanyardData() {
    try {
        const { activities, discord_status, discord_user } = discordDataLatest;

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
    const statusWrapper = document.getElementById("statusWrapper");
    if (statusWrapper) {
        statusWrapper.className = status;
        statusWrapper.textContent = capitalizeFirstLetter(status);
    }
}

function updateUserInfo(user) {
    document.getElementById("discordName").textContent = `@${user.username}`;
    document.getElementById("discordPFP").src = `https://cdn.discordapp.com/avatars/${userID}/${user.avatar}.webp?size=512`;
}

function updateActivityInfo(activities, status) {
    const lanyardDiscord = document.getElementById("lanyardDiscord");
    const activityWrapper = document.getElementById("discordActivity");

    if (status === "online") {
        lanyardDiscord.style.display = "flex";
        updateActivityImages(activities);
        updateActivityDetails(activities);
    } else {
        lanyardDiscord.style.display = "none";
    }
}

function updateActivityImages(activities) {
    const activityImages = document.getElementById("discordActivityImages");
    const largeImageElem = document.getElementById("activityLogoLarge");
    const smallImageElem = document.getElementById("activityLogoSmall");
    const isMobile = isMobilePlatform(); // Check if the user is on a mobile platform

    if (activities.length && activities[0]?.assets) {
        let largeImage = activities[0].assets.large_image;
        let smallImage = activities[0].assets.small_image;

        if (largeImage) {
            largeImageElem.style.display = "initial";
            largeImageElem.src = getImageUrl(largeImage, activities[0].application_id);
            largeImageElem.alt = `Album art for ${activities[0].assets.large_text}`;
            largeImageElem.title = activities[0].assets.large_text;
        } else {
            largeImageElem.style.display = "none";
        }

        if (smallImage) {
            smallImageElem.style.display = "initial";
            smallImageElem.src = getImageUrl(smallImage, activities[0].application_id);
            smallImageElem.alt = `Application icon for ${activities[0].name}`;
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

        activityImages.style.display = largeImage || smallImage ? "block" : "none";
        adjustTextAlignment(largeImage || smallImage, isMobile); // Pass isMobile as an argument
    } else {
        activityImages.style.display = "none";
        adjustTextAlignment(false, isMobile); // Center text if no images are available
    }
}




function updateActivityDetails(activities) {
    const wrapper = document.getElementById("discordActivity");
    if (activities.length) {
        wrapper.style.display = "flex";
        const activity = activities[0];
        document.getElementById("activityName").textContent = activity.name;
        document.getElementById("activityState").textContent = formatActivityState(activity.state);
        document.getElementById("activityDetails").textContent = activity.details;
        updateActivityTime(activity.timestamps);
    } else {
        wrapper.style.display = "none";
    }
}

function formatActivityState(state) {
    const byRegex = /by\s*(?:\(.*\)|[^)]+)/;
    return byRegex.test(state) ? state.replace(/by\s+/, "") : state;
}

function updateActivityTime(timestamps) {
  const now = new Date();
  const timeElem = document.getElementById("activityTime");
  const remainingElem = document.getElementById("remaining");
  const elapsedElem = document.getElementById("elapsed");

  if (timestamps?.end) {
      const timeRemaining = calculateTimeDifference(new Date(timestamps.end), now);
      timeElem.textContent = formatTime(timeRemaining);
      toggleTimeDisplay(remainingElem, elapsedElem, true);
  } else if (timestamps?.start) {
      const timeElapsed = calculateTimeDifference(now, new Date(timestamps.start));
      timeElem.textContent = formatTime(timeElapsed);
      toggleTimeDisplay(remainingElem, elapsedElem, false);
  } else {
      timeElem.textContent = "-:-"; // Default time when timestamps are unavailable
      elapsedElem.classList.add("hide");
      remainingElem.classList.add("hide");
      remainingElem.classList.remove("inline");
      elapsedElem.classList.remove("inline");
  }
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

function formatTime({ hours, minutes, seconds }) {
    return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

function toggleTimeDisplay(remainingElem, elapsedElem, isRemaining) {
    remainingElem.classList.toggle("hide", !isRemaining);
    remainingElem.classList.toggle("inline", isRemaining);
    elapsedElem.classList.toggle("hide", isRemaining);
    elapsedElem.classList.toggle("inline", !isRemaining);
}

function getImageUrl(image, appId) {
    return image.includes("external")
        ? `https://media.discordapp.net/external/${image.split("mp:external/")[1]}`
        : `https://cdn.discordapp.com/app-assets/${appId}/${image}.png?size=256`;
}

function adjustTextAlignment(hasImage, isMobile) {
    const align = isMobile || !hasImage ? 'center' : 'left';
    ['activityName', 'activityState', 'activityDetails', 'timeremaning'].forEach(id => {
        document.getElementById(id).style.textAlign = align;
    });

    document.getElementById("discordActivityImages").style.paddingRight = hasImage ? "20px" : "0";
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function pad(num) {
    return String(num).padStart(2, "0");
}

function handleError(error) {
    console.error("Error:", error);
    spinner.style.display = "none";
    contentDiv.style.display = "none";
    errorMessage.style.display = "flex";
}
