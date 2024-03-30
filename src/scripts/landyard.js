// THIS CODE IS EXPERIMENTAL. DO NOT COPY IT
let userID = "701403809129168978";

const loadingDiv = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const spinner = document.getElementById("loadingSpinner");

function platform() {
  if (window.innerWidth >= 739) {
    // not mobile
    return false;
  } else {
    // is mobile
    return true;
  }
}

async function getLanyard() {
  try {
  const ly = await fetch(`https://api.lanyard.rest/v1/users/${userID}`);
  return await ly.json();
} catch (error) {
  console.error("Error fetching Lanyard data:", error);
  // Handle the error here (e.g., display an error message to the user)
  handleError(error); // Call a custom error handling function
}
}

// Check for the localStorage setting
const doUpdateSec = localStorage.getItem("doUpdateSec") !== "false";

// Call setLanyard once initially
setLanyard();

// If doUpdateSec is true, set up a one-second interval for updates
if (doUpdateSec) {
  setInterval(setLanyard, 1000);
}

async function setLanyard() {
  try {
  await getLanyard().then((data) => {
    const { activities, discord_status, listening_to_spotify, discord_user } =
      data.data;

    const discordStatusDiv = document.getElementById("discordStatus");
    const statusWrapper = document.getElementById("statusWrapper");
    if (statusWrapper) {
      if (discord_status === "online") {
        statusWrapper.classList.remove("dcloading");
        statusWrapper.classList.remove("offline");
        statusWrapper.classList.remove("idle"); // Remove "idle" class if previously added
        statusWrapper.classList.remove("dnd"); // Remove "dnd" class if previously added
        statusWrapper.classList.add("online");
        statusWrapper.textContent = 'Online';
      } else if (discord_status === "dnd") {
        statusWrapper.classList.remove("dcloading");
        statusWrapper.classList.remove("offline");
        statusWrapper.classList.remove("idle"); // Remove "idle" class if previously added
        statusWrapper.classList.remove("online"); // Remove "online" class if previously added
        statusWrapper.classList.add("dnd");
        statusWrapper.textContent = 'Do Not Disturb';
      } else if (discord_status === "idle") {
        statusWrapper.classList.remove("dcloading");
        statusWrapper.classList.remove("offline");
        statusWrapper.classList.remove("dnd"); // Remove "dnd" class if previously added
        statusWrapper.classList.remove("online"); // Remove "online" class if previously added
        statusWrapper.classList.add("idle"); // Add "idle" class
        statusWrapper.textContent = 'Inactive';
      } else {
        statusWrapper.classList.remove("dcloading");
        statusWrapper.classList.remove("idle"); // Remove "idle" class if previously added
        statusWrapper.classList.remove("dnd"); // Remove "dnd" class if previously added
        statusWrapper.classList.remove("online");
        statusWrapper.classList.add("offline");
        statusWrapper.textContent = 'Offline';
        //statusWrapper.textContent = discord_status;
      }
      //statusWrapper.textContent = discord_status;
    }


    document.getElementById("discordName").textContent =
      data.data.discord_user.username;
    document.getElementById(
      "discordPFP"
    ).src = `https://cdn.discordapp.com/avatars/${userID}/${data.data.discord_user.avatar}.webp?size=512`;

    if (discord_status === "online") {
      document.getElementById("landyardDiscord").style.display = "flex";
      document.getElementById("discordActivityImages").style.display = "none";
      const activityDiscordWrapper = document.getElementById("discordActivity");
      if (!activities.length) {
        activityDiscordWrapper.style.display = "none";
        console.log("test");
        document.getElementById("activityName").textContent =
          "No activity running";
      } else {
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
        } else {
          document.getElementById("activityLogoLarge").style.display = "none";
        }



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

        if (!activities[0]?.assets?.small_image && !activities[0]?.assets?.large_image) {
          // Dexrn: THIS IS REALLY JANK REMIND ME TO FIX!!!
            document.getElementById('activityName').style.textAlign = 'center';
            document.getElementById('activityState').style.textAlign = 'center';
            document.getElementById('activityDetails').style.textAlign = 'center';
            document.getElementById('activityTime').style.textAlign = 'center';
          if (!platform()) {
            document.getElementById('activityName').style.textAlign = 'left';
            document.getElementById('activityState').style.textAlign = 'left';
            document.getElementById('activityDetails').style.textAlign = 'left';
            document.getElementById('activityTime').style.textAlign = 'left';
          } else {
            document.getElementById('activityName').style.textAlign = 'center';
            document.getElementById('activityState').style.textAlign = 'center';
            document.getElementById('activityDetails').style.textAlign = 'center';
            document.getElementById('activityTime').style.textAlign = 'center';
          }
        }


        if (
          activities[0]?.assets?.small_image &&
          activities[0]?.assets?.large_image
        ) {
          document.getElementById("discordActivityImages").style.paddingRight =
            "20px";
        } else if (activities[0]?.assets?.large_image) {
          document.getElementById("discordActivityImages").style.paddingRight =
            "10px";
        } else if (
          !activities[0]?.assets?.small_image &&
          !activities[0]?.assets?.large_image
        ) {
          document.getElementById("discordActivityImages").style.paddingRight =
            "0";
        }



        document.getElementById("activityName").textContent =
          activities[0].name;
        document.getElementById("activityState").textContent =
          activities[0].state;
        document.getElementById("activityDetails").textContent =
          activities[0].details;
        const options = { year: "numeric", month: "long", day: "numeric" };
        const activityStart = new Date(activities[0].created_at);
        const activityStartStr = activityStart.toLocaleString("en-US", options);

        const now = new Date();



        if (activities[0].timestamps?.end) {
          const activityEnd = new Date(activities[0].timestamps.end);
          const timeRemainingMs = activityEnd - now;
          const timeRemainingSeconds = Math.max(
            0,
            Math.floor(timeRemainingMs / 1000)
          );

          const minutesRemaining = Math.floor(timeRemainingSeconds / 60);
          const secondsRemaining = timeRemainingSeconds % 60;

          const minutesRemainingStr = minutesRemaining
            .toString()
            .padStart(2, "0");
          const secondsRemainingStr = secondsRemaining
            .toString()
            .padStart(2, "0");

          const timeRemainingStr = `${minutesRemainingStr}:${secondsRemainingStr} remaining`;

          document.getElementById("activityTime").textContent =
            timeRemainingStr;
        } else {
          const timeDiffMs = now - activityStart;

          const timeDiffSeconds = Math.floor(timeDiffMs / 1000);

          let timeDiffStr;

          const minutes = Math.floor(timeDiffSeconds / 60);
          const remainingSeconds = timeDiffSeconds % 60;

          const minutesStr = minutes.toString().padStart(2, "0");
          const secondsStr = remainingSeconds.toString().padStart(2, "0");

          timeDiffStr = `${minutesStr}:${secondsStr} elapsed`;
          document.getElementById("activityTime").textContent = timeDiffStr;
        }


      }
    } else {
      document.getElementById("landyardDiscord").style.display = "none";
      //document.getElementById("project").style.display = "block";
    }
    const loadingDiv = document.getElementById("loading");
    const conentSite = document.getElementById("loadedLandyard");
    loadingDiv.style.display = "none";
    conentSite.style.display = "flex";
  });
} catch (error) {
  console.error("Error fetching Lanyard data:", error);
  // Handle the error here (e.g., display an error message to the user)
  handleError(error); // Call a custom error handling function
}
}

function handleError(error) {
  console.error("JavaScript Error:", error);
  spinner.style.display = "none";
  errorMessage.style.display = "block";
}
