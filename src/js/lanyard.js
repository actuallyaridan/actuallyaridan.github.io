if (document.querySelector('.discordWrapper')) {
  const userID = "701403809129168978";
  const loadingDiv = document.getElementById("loading");
  const errorMessage = document.getElementById("errorMessage");
  const spinner = document.getElementById("loadingSpinner");
  const contentDiv = document.getElementById("loadedLanyard");
  let discordDataLatest;
  let websocket;
  let heartbeatInterval;
  let reconnectTimeout;

  function connectWebSocket() {
    console.log('[Lanyard] Preparing connection to Lanyard WebSocket at wss://api.lanyard.rest/socket...');
    websocket = new WebSocket("wss://api.lanyard.rest/socket");

    websocket.onopen = function () {
      console.log("[Lanyard] Ready to connect. Sending handshake...");
    };

    websocket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.op === 1) {
        console.log("%c[Lanyard] Connection to Lanyard WebSocket returned 200 (OK)", "color:green;");
        console.log("[Lanyard] Subscribing to user ID " + userID + "...");
        sendMessage({ op: 2, d: { subscribe_to_id: userID } });

        if (heartbeatInterval) clearInterval(heartbeatInterval);
        heartbeatInterval = setInterval(() => sendMessage({ op: 3 }), data.d.heartbeat_interval);
      } else if (data.op === 0) {
        discordDataLatest = data.d;
        console.log("%c[Lanyard] Received data for user ID " + userID, "color:green;");
      }
    };

    websocket.onerror = function (error) {
      console.error("[Lanyard] WebSocket encountered an error:", error);
      websocket.close();
    };

    websocket.onclose = function () {
      console.warn("[Lanyard] Lost connection to Lanyard. Reconnecting...");
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;

      if (!reconnectTimeout) {
        reconnectTimeout = setTimeout(() => {
          reconnectTimeout = null;
          connectWebSocket();
        }, 3000);
      }
    };
  }

  function sendMessage(message) {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
    } else {
      console.warn("[Lanyard] Lost connection to WebSocket");
    }
  }

  connectWebSocket();

  const fetchDataInterval = setInterval(updateLanyardData, 900);

  function updateLanyardData() {
    try {
      const discordData = discordDataLatest || {};
      const activities = discordData.activities || [];
      const discord_status = discordData.discord_status || "";

      updateStatusWrapper(discord_status);
      updateActivityInfo(activities, discord_status);

      toggleDisplay(loadingDiv, false);
      toggleDisplay(contentDiv, true);
      toggleDisplay(errorMessage, false);
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
      toggleDisplay(lanyardDiscord, true);

      let appleMusicActivity = null;
      let otherActivities = [];

      for (let activity of activities) {
        if (activity.name === "Apple Music" || activity.application_id === "773825528921849856") {
          appleMusicActivity = activity;
        } else {
          otherActivities.push(activity);
        }
      }

      if (appleMusicActivity) {
        updateAppleMusicInfo(appleMusicActivity);
      } else {
        toggleDisplay(document.getElementById("amLanyardDiscord"), false);
      }

      if (otherActivities.length !== 0) {
        toggleDisplay(document.getElementById("discordActivity"), true);
      } else {
        toggleDisplay(document.getElementById("discordActivity"), false);
      }

      updateActivityImages(otherActivities);
      updateActivityDetails(otherActivities);
    } else {
      toggleDisplay(lanyardDiscord, false);
    }
  }

  function updateActivityImages(activities) {
    const activityLogoLarge = document.getElementById("activityLogoLarge");
    const activityLogoSmall = document.getElementById("activityLogoSmall");

    if (!activities || activities.length === 0 || !activities.some(activity => activity.assets && activity.assets.large_image)) {
      toggleDisplay(activityLogoLarge, false);
      toggleDisplay(activityLogoSmall, false);
      return;
    }

    activities.forEach(function (activity) {
      if (activity.assets && activity.assets.large_image) {
        updateImage(activityLogoLarge, activity.assets.large_image, activity.application_id, activity.details);
        updateImage(activityLogoSmall, activity.assets.small_image, activity.application_id, activity.details);
      }
    });
  }

  function updateActivityDetails(activities) {
    const activityName = document.getElementById("activityName");
    const activityDetails = document.getElementById("activityDetails");
    const activityState = document.getElementById("activityState");

    if (!activities || activities.length === 0) {
      toggleDisplay(activityName, false);
      toggleDisplay(activityDetails, false);
      toggleDisplay(activityState, false);
      return;
    }

    const activity = activities[0];

    if (activityName) {
      activityName.textContent = activity.name;
      toggleDisplay(activityName, true);
    }

    if (activityDetails) {
      activityDetails.textContent = activity.details || "No details available";
      toggleDisplay(activityDetails, activity.details);
    }

    if (activityState) {
      activityState.textContent = activity.state || "";
      toggleDisplay(activityState, activity.state);
    }

    updateActivityTime(activity.timestamps, "");
  }

  function updateAppleMusicInfo(activity) {
    const amLanyardDiscord = document.getElementById("amLanyardDiscord");
    const amActivityLogoLarge = document.getElementById("amActivityLogoLarge");
    const amActivityLogoSmall = document.getElementById("amActivityLogoSmall");

    toggleDisplay(amLanyardDiscord, true);

    if (activity.assets) {
      const { large_image, small_image } = activity.assets;
      updateImage(amActivityLogoLarge, large_image, activity.application_id, activity.details);
      updateImage(amActivityLogoSmall, small_image, activity.application_id, activity.details);
    }

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
      toggleTimeDisplay(remainingElem, elapsedElem, false);
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

  function updateImage(element, image, appId, activityDetails = '') {
    if (image) {
      element.src = getImageUrl(image, appId);
      element.alt = `Image for ${activityDetails || image}`;
      element.title = activityDetails || image;
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
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

  function toggleDisplay(element, show) {
    if (element) element.style.display = show ? "flex" : "none";
  }

  function handleError(error) {
    console.error("Error:", error);
    errorMessage.textContent = `An error occurred: ${error.message || error}`;
    toggleDisplay(spinner, false);
    toggleDisplay(contentDiv, false);
    toggleDisplay(errorMessage, true);
  }
}
