// Creates a value containing my user ID for Lanyard
let userID = "701403809129168978";

//Creates values for the loading divs and the error message
const loadingDiv = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const spinner = document.getElementById("loadingSpinner");
const contentDiv = document.getElementById("loadedLandyard");

// Checks if the windows inner width is above 739px. If it's not, it sets (mobile) platform as true 
function platform() {
  if (window.innerWidth >= 739) {
    // not mobile
    return false;
  } else {
    // is mobile
    return true;
  }
}

// Fetches data from Lanyard
async function getLanyard() {
  try {
    const ly = await fetch(`https://api.lanyard.rest/v1/users/${userID}`);
    return await ly.json();
  } catch (error) {
    //Calls an error handler if something doesn't go as planned
    console.error("Error fetching Lanyard data:", error);
    handleError(error);
  }
}

// Check for the localStorage setting that disables automatic updates
const doUpdateSec = localStorage.getItem("doUpdateSec") !== "false";

// Call setLanyard once initially
setLanyard();

// If doUpdateSec is true, set up a 1 second interval for updates
if (doUpdateSec) {
  setInterval(setLanyard, 500);
}

//Waits until data has been fetched, then updates items
async function setLanyard() {
  try {
    await getLanyard().then((data) => {
      // Makes the data into constant values to make it easier to work with
      const { activities, discord_status, listening_to_spotify, discord_user } =
        data.data;

      // Updates the text if I'm online, offline, inactive or in DND
      const statusWrapper = document.getElementById("statusWrapper");
      if (statusWrapper) {
        if (discord_status === "online") {
          statusWrapper.classList.remove("dcloading");
          statusWrapper.classList.remove("offline");
          statusWrapper.classList.remove("idle");
          statusWrapper.classList.remove("dnd");
          statusWrapper.classList.add("online");
          statusWrapper.textContent = 'Online';
        } else if (discord_status === "dnd") {
          statusWrapper.classList.remove("dcloading");
          statusWrapper.classList.remove("offline");
          statusWrapper.classList.remove("idle");
          statusWrapper.classList.remove("online");
          statusWrapper.classList.add("dnd");
          statusWrapper.textContent = 'Do Not Disturb';
        } else if (discord_status === "idle") {
          statusWrapper.classList.remove("dcloading");
          statusWrapper.classList.remove("offline");
          statusWrapper.classList.remove("dnd");
          statusWrapper.classList.remove("online");
          statusWrapper.classList.add("idle");
          statusWrapper.textContent = 'Inactive';
        } else {
          statusWrapper.classList.remove("dcloading");
          statusWrapper.classList.remove("idle");
          statusWrapper.classList.remove("dnd");
          statusWrapper.classList.remove("online");
          statusWrapper.classList.add("offline");
          statusWrapper.textContent = 'Offline';
        }
      }

      // Sets username and profile picture
      document.getElementById("discordName").textContent =
        '@' + data.data.discord_user.username;
      document.getElementById(
        "discordPFP"
      ).src = `https://cdn.discordapp.com/avatars/${userID}/${data.data.discord_user.avatar}.webp?size=512`;

      // Checks if I'm online
      if (discord_status === "online") {
        document.getElementById("landyardDiscord").style.display = "flex";
        document.getElementById("discordActivityImages").style.display = "none";
        const activityDiscordWrapper = document.getElementById("discordActivity");
        // Hides the activity screen if there a activity running
        if (!activities.length) {
          activityDiscordWrapper.style.display = "none";
        } else {
          // Checks if there's a large image and if there is one, it sets it as an image 
          activityDiscordWrapper.style.display = "flex";
          if (activities[0]?.assets?.large_image) {
            document.getElementById("discordActivityImages").style.display = "block";
            let activityImageLarge = activities[0].assets.large_image;
            if (activityImageLarge.includes("external")) {
              activityImageLarge = `https://media.discordapp.net/external/${activities[0].assets.large_image.split("mp:external/")[1]
                }`;
            } else {
              activityImageLarge = `https://cdn.discordapp.com/app-assets/${activities[0].application_id}/${activities[0].assets.large_image}.png?size=256`;
            }
            if (
              document.getElementById("activityLogoLarge").style.display == "none"
            ) {
              document.getElementById("activityLogoLarge").style.display =
                "initial";
            }
            document.getElementById("activityLogoLarge").src = activityImageLarge;

            // Checks if there's a small image and if there is one, it sets it as an image 
            if (activities[0]?.assets?.small_image) {
              document.getElementById("discordActivityImages").style.display = "block";
              let activityImageSmall = activities[0].assets.small_image;
              if (activityImageSmall.includes("external")) {
                activityImageSmall = `https://media.discordapp.net/external/${activities[0].assets.small_image.split("mp:external/")[1]
                  }`;
              } else {
                activityImageSmall = `https://cdn.discordapp.com/app-assets/${activities[0].application_id}/${activities[0].assets.small_image}.png?size=256`;
              }
              if (
                document.getElementById("activityLogoSmall").style.display == "none"
              ) {
                document.getElementById("activityLogoSmall").style.display =
                  "initial";
              }
              document.getElementById("activityLogoSmall").src = activityImageSmall;
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
          if (
            activities[0]?.assets?.large_image
          ) {
            document.getElementById("discordActivityImages").style.paddingRight =
              "20px";
          } else if (activities[0]?.assets?.large_image) {
            document.getElementById("discordActivityImages").style.paddingRight =
              "10px";
          } else if (
            !activities[0]?.assets?.large_image
          ) {
            document.getElementById("discordActivityImages").style.paddingRight =
              "0";
          }

          // Sets activity text
          document.getElementById("activityName").textContent =
            activities[0].name;

            document.getElementById("activityState").textContent = activities[0].state;

            // Regular expression to match "by" followed by anything in parentheses or whitespace (non-greedy)
            const byRegex = /by\s*(?:\(.*\)|[^)]+)/;
            
            if (byRegex.test(activities[0].state)) {
              // Extract everything after the first space following "by"
              const newState = activities[0].state.replace(/by\s+/, "");
              // Update the text content with the modified state
              document.getElementById("activityState").textContent = newState;
            } else {
              // No "by" found, leave the text content as is
              console.log("No 'by' attribution found in the state");
            }

          document.getElementById("activityDetails").textContent =
            activities[0].details;

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
        document.getElementById("landyardDiscord").style.display = "none";
      }
      const loadingDiv = document.getElementById("loading");
      const conentSite = document.getElementById("loadedLandyard");
      loadingDiv.style.display = "none";
      conentSite.style.display = "flex";
    });
  } catch (error) {
    console.error("Error fetching Lanyard data:", error);
    // Handle the error here (e.g., display an error message to the user)
    handleError(error);
  }
}

function handleError(error) {
  // Displays an error message if it's called for
  console.error("Error:", error);
  spinner.style.display = "none";
  contentDiv.style.display = "none"
  errorMessage.style.display = "flex";
}
