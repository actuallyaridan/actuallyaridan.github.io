// Creates a value containing my user ID for Lanyard
let userID = "701403809129168978";
// Creates values for the loading divs and the error message
const loadingDiv = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const spinner = document.getElementById("loadingSpinner");
const contentDiv = document.getElementById("loadedLanyard");
let discordDataLatest;

console.log('Attempting to connect to Lanyard Websocket at wss://api.lanyard.rest/socket...')
const websocket = new WebSocket("wss://api.lanyard.rest/socket");
websocket.onmessage = async function (event) {
  const data = JSON.parse(event.data)
  console.log(data)
  if (data.op === 1) {
    console.log("%cConnection to Lanyard WebSocket returned 200 (OK)", "color:green;");
    console.log('Attempting to access data for userID ' + [userID] + '...')
    websocket.send(JSON.stringify({
      op: 2,
      d: {
        // subscribe_to_ids should be an array of user IDs you want to subscribe to presences from
        // if Lanyard doesn't monitor an ID specified, it won't be included in INIT_STATE
        subscribe_to_id: userID
      }
    }))
    const { heartbeat_interval } = data.d
    setInterval(function () {
      websocket.send(JSON.stringify(
        {
          op: 3
        }
      ))
    }, heartbeat_interval)
    console.log('Applying new heartbeat interval (timeout)')
  }
  else if (data.op === 0) {
    console.log(data)
    discordDataLatest = data.d
    console.log('%cData at userID ' + [userID] + ' returned 200 (OK)', "color:green;")
  }
}

// Checks if the windows inner width is above 739px. If it's not, it sets (mobile) platform as true 
function platform() {
  return window.innerWidth < 739;
}


// Set up the data fetching interval management
let fetchDataInterval;

fetchDataInterval = setInterval(setLanyard, 900);

// Waits until data has been fetched, then updates items
async function setLanyard() {
  try {
    // Makes the data into constant values to make it easier to work with
    const { activities, discord_status, listening_to_spotify, discord_user } = discordDataLatest;

    // Updates the text if I'm online, offline, inactive or in DND
    const statusWrapper = document.getElementById("statusWrapper");
    if (statusWrapper) {
      statusWrapper.classList.remove("dcloading", "offline", "idle", "dnd", "online");
      statusWrapper.classList.add(discord_status);
      statusWrapper.textContent = discord_status.charAt(0).toUpperCase() + discord_status.slice(1);
    }

    // Sets username and profile picture
    document.getElementById("discordName").textContent = '@' + discord_user.username;
    document.getElementById("discordPFP").src = `https://cdn.discordapp.com/avatars/${userID}/${discord_user.avatar}.webp?size=512`;

    // Checks if I'm online
    if (discord_status === "online") {
      document.getElementById("lanyardDiscord").style.display = "flex";
      document.getElementById("discordActivityImages").style.display = "none";
      const activityDiscordWrapper = document.getElementById("discordActivity");

      // Hides the activity screen if there are no activities running
      if (!activities.length) {
        activityDiscordWrapper.style.display = "none";
      } else {
        // Checks if there's a large image and if there is one, it sets it as an image 
        activityDiscordWrapper.style.display = "flex";
        if (activities[0]?.assets?.large_image) {
          document.getElementById("discordActivityImages").style.display = "block";
          let activityImageLarge = activities[0].assets.large_image;
          if (activityImageLarge.includes("external")) {
            activityImageLarge = `https://media.discordapp.net/external/${activities[0].assets.large_image.split("mp:external/")[1]}`;
          } else {
            activityImageLarge = `https://cdn.discordapp.com/app-assets/${activities[0].application_id}/${activities[0].assets.large_image}.png?size=256`;
          }
          document.getElementById("activityLogoLarge").style.display = "initial";
          document.getElementById("activityLogoLarge").src = activityImageLarge;
          document.getElementById("activityLogoLarge").setAttribute('alt', activities[0].assets.large_text);
          document.getElementById("activityLogoLarge").setAttribute('title', activities[0].assets.large_text);

          // Checks if there's a small image and if there is one, it sets it as an image 
          if (activities[0]?.assets?.small_image) {
            document.getElementById("discordActivityImages").style.display = "block";
            let activityImageSmall = activities[0].assets.small_image;
            if (activityImageSmall.includes("external")) {
              activityImageSmall = `https://media.discordapp.net/external/${activities[0].assets.small_image.split("mp:external/")[1]}`;
            } else {
              activityImageSmall = `https://cdn.discordapp.com/app-assets/${activities[0].application_id}/${activities[0].assets.small_image}.png?size=256`;
            }
            document.getElementById("activityLogoSmall").style.display = "initial";
            document.getElementById("activityLogoSmall").src = activityImageSmall;
            document.getElementById("activityLogoSmall").setAttribute('alt', activities[0].name);
            document.getElementById("activityLogoSmall").setAttribute('title', activities[0].name);

            if (!activities[0].assets.large_image) {
              document.getElementById("activityLogoSmall").width = "96px";
              document.getElementById("activityLogoSmall").height = "96px";
            } else {
              document.getElementById("activityLogoSmall").width = "32px";
              document.getElementById("activityLogoSmall").height = "32px";
            }
          } else {
            document.getElementById("activityLogoSmall").style.display = "none";
          }
        }
        // Checks if there are two images and if there are, does some funny alignment stuff
        if (activities[0]?.assets?.large_image) {
          // Dexrn: THIS IS REALLY JANK REMIND ME TO FIX!!!
          document.getElementById('activityName').style.textAlign = 'left';
          document.getElementById('activityState').style.textAlign = 'left';
          document.getElementById('activityDetails').style.textAlign = 'left';
          document.getElementById('timeremaning').style.textAlign = 'left';
          if (!platform()) {
            document.getElementById('activityName').style.textAlign = 'left';
            document.getElementById('activityState').style.textAlign = 'left';
            document.getElementById('activityDetails').style.textAlign = 'left';
            document.getElementById('timeremaning').style.textAlign = 'left';
          } else {
            document.getElementById('activityName').style.textAlign = 'center';
            document.getElementById('activityState').style.textAlign = 'center';
            document.getElementById('activityDetails').style.textAlign = 'center';
            document.getElementById('timeremaning').style.textAlign = 'center';
          }
        } else if (!activities[0]?.assets?.large_image) {
          document.getElementById('activityName').style.textAlign = 'center';
          document.getElementById('activityState').style.textAlign = 'center';
          document.getElementById('activityDetails').style.textAlign = 'center';
          document.getElementById('timeremaning').style.textAlign = 'center';
        }
        if (activities[0]?.assets?.large_image) {
          document.getElementById("discordActivityImages").style.paddingRight = "20px";
        } else if (activities[0]?.assets?.large_image) {
          document.getElementById("discordActivityImages").style.paddingRight = "10px";
        } else if (!activities[0]?.assets?.large_image) {
          document.getElementById("discordActivityImages").style.paddingRight = "0";
        }

        // Sets activity text
        document.getElementById("activityName").textContent = activities[0].name;
        document.getElementById("activityState").textContent = activities[0].state;

        // Regular expression to match "by" followed by anything in parentheses or whitespace (non-greedy)
        const byRegex = /by\s*(?:\(.*\)|[^)]+)/;

        if (byRegex.test(activities[0].state)) {
          // Extract everything after the first space following "by"
          const newState = activities[0].state.replace(/by\s+/, "");
          // Update the text content with the modified state
          document.getElementById("activityState").textContent = newState;
        }

        document.getElementById("activityDetails").textContent = activities[0].details;

        // Creates a new date as the current one
        const options = { year: "numeric", month: "long", day: "numeric" };
        const activityStart = new Date(activities[0].created_at);
        const now = new Date();

        // Checks if the activity has an end time
        if (activities[0].timestamps?.end) {
          // Creates a date based on the end time, and subtracts it by the current time in order to get the remaining milliseconds
          const activityEnd = new Date(activities[0].timestamps.end);
          const timeRemainingMs = activityEnd - now;

          // Converts it to seconds and makes sure no negative number is allowed by making the minimum number 0
          const timeRemainingSeconds = Math.max(0, Math.floor(timeRemainingMs / 1000)); // Ensures minimum is 0

          // Calculate hours, minutes, and seconds
          const hours = Math.floor(timeRemainingSeconds / 3600);
          const remainingMinutes = Math.floor((timeRemainingSeconds % 3600) / 60);
          const secondsRemaining = timeRemainingSeconds % 60;

          // Display the remaining time only if hours is greater than zero
          const timeRemainingStr = hours > 0 ? `${hours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}:${secondsRemaining.toString().padStart(2, "0")}` : `${remainingMinutes.toString().padStart(2, "0")}:${secondsRemaining.toString().padStart(2, "0")}`;
          document.getElementById("activityTime").textContent = timeRemainingStr;
          document.getElementById("remaining").classList.remove("hide");
          document.getElementById("remaining").classList.add("inline");
          document.getElementById("elapsed").classList.remove("inline");
          document.getElementById("elapsed").classList.add("hide");
        } else {
          // Creates a date based on the start time, and subtracts the current time by it in order to get the elapsed milliseconds
          const timeDiffMs = now - activityStart;

          // Converts it to seconds and makes sure no negative number is allowed by making the minimum number 0
          const timeDiffSeconds = Math.max(0, Math.floor(timeDiffMs / 1000)); // Ensures minimum is 0

          // Calculate hours, minutes, and seconds
          const hours = Math.floor(timeDiffSeconds / 3600);
          const remainingMinutes = Math.floor((timeDiffSeconds % 3600) / 60);
          const secondsRemaining = timeDiffSeconds % 60;

          // Display the elapsed time only if hours is greater than zero
          const timeDiffStr = hours > 0 ? `${hours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}:${secondsRemaining.toString().padStart(2, "0")}` : `${remainingMinutes.toString().padStart(2, "0")}:${secondsRemaining.toString().padStart(2, "0")}`;
          document.getElementById("activityTime").textContent = timeDiffStr;
          document.getElementById("remaining").classList.remove("inline");
          document.getElementById("remaining").classList.add("hide");
          document.getElementById("elapsed").classList.remove("hide");
          document.getElementById("elapsed").classList.add("inline");
        }
      }
    } else {
      document.getElementById("lanyardDiscord").style.display = "none";
    }

    loadingDiv.style.display = "none";
    contentDiv.style.display = "flex";
    errorMessage.style.display = "none";
  } catch (error) {
    handleError(error);
  }
}

function handleError(error) {
  // Displays an error message if it's called for
  console.error("Error:", error);
  spinner.style.display = "none";
  contentDiv.style.display = "none";
  errorMessage.style.display = "flex";
}