// THIS CODE IS EXPERIMENTAL. DO NOT COPY IT
let userID = "701403809129168978";

const loadingDiv = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const spinner = document.getElementById('loadingSpinner');

// Set a timeout to handle loading time
const timeout = setTimeout(() => {
  if (loadingDiv) {
    spinner.style.display = 'none';
    errorMessage.style.display = 'block';
  }
}, 4000); // Change 5000 to adjust the timeout in milliseconds (4 seconds)


fetch(`https://api.lanyard.rest/v1/users/${userID}`)
  .then(response => response.json())
  .then(data => {
    const { activities, discord_status, listening_to_spotify, discord_user } = data.data;

    const discordStatusDiv = document.getElementById('discordStatus');
    const statusWrapper = document.getElementById('statusWrapper');
    if (statusWrapper) {
      if (discord_status === 'online') {
        statusWrapper.classList.remove('dcloading');
        statusWrapper.classList.remove('offline'); // Remove pre-existing "red" class
        statusWrapper.classList.add('online'); // Add "green" class if online
      } else {
        statusWrapper.classList.remove('dcloading');
        statusWrapper.classList.add('offline');
      }
      statusWrapper.textContent = discord_status;
    }

    document.getElementById('discordName').textContent = data.data.discord_user.username;
    document.getElementById('discordPFP').src = `https://cdn.discordapp.com/avatars/${userID}/${data.data.discord_user.avatar}.webp?size=512`

    if (discord_status === 'online') {
      const activityDiscordWrapper = document.getElementById('discordActivity');
      if (!activities.length) {
        // No activity found, display message
        document.getElementById('discordActivityImages').style.display = 'none';
        activityDiscordWrapper.style.display = 'none';
        console.log('test');
        document.getElementById('activityName').textContent = 'No activity running';
      } else {
        activityDiscordWrapper.style.display = 'flex';
        // Set content of divs
        if (activities[0]?.assets?.large_image) {
          let activityImageLarge = activities[0].assets.large_image;
          if (activityImageLarge.includes("external")) {
            activityImageLarge = `https://media.discordapp.net/external/${activities[0].assets.large_image.split("mp:external/")[1]}`;
          } else {
            activityImageLarge = `https://cdn.discordapp.com/app-assets/${activities[0].application_id}/${activities[0].assets.large_image}.png?size=256`;
          }
          document.getElementById('activityLogoLarge').src = activityImageLarge;
        } else {
          document.getElementById('activityLogoLarge').style.display = 'none';
        }
        if (activities[0]?.assets?.small_image) {
          let activityImageSmall = activities[0].assets.small_image;
          if (activityImageSmall.includes("external")) {
            activityImageSmall = `https://media.discordapp.net/external/${activities[0].assets.small_image.split("mp:external/")[1]}`;
          } else {
            activityImageSmall = `https://cdn.discordapp.com/app-assets/${activities[0].application_id}/${activities[0].assets.small_image}.png?size=256`;
          }

          document.getElementById('activityLogoSmall').src = activityImageSmall;
          if (!activities[0].assets.large_image) {
            document.getElementById('activityLogoSmall').width = "96px";
            document.getElementById('activityLogoSmall').height = "96px";
          }
        } else {
          document.getElementById('activityLogoSmall').style.display = 'none';
        }

        if (activities[0]?.assets?.small_image && activities[0]?.assets?.large_image) {
          document.getElementById('discordActivityImages').style.paddingRight = '20px';
        }
        else if (activities[0]?.assets?.large_image) {
          document.getElementById('discordActivityImages').style.paddingRight = '10px';
        }

        document.getElementById('activityName').textContent = activities[0].name;
        document.getElementById('activityState').textContent = activities[0].state;
        document.getElementById('activityDetails').textContent = activities[0].details;
        // Convert timestamp to human-readable format
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const activityStart = new Date(activities[0].created_at);
        const activityStartStr = activityStart.toLocaleString('en-US', options);

      // Get current date and time
const now = new Date();

// ... other code for setting activity details ...

// Check for end timestamp
if (activities[0].timestamps?.end) {
  const activityEnd = new Date(activities[0].timestamps.end);
  const timeRemainingMs = activityEnd - now;
  const timeRemainingSeconds = Math.max(0, Math.floor(timeRemainingMs / 1000)); // Ensure non-negative value

  // Convert remaining time to minutes and seconds
  const minutesRemaining = Math.floor(timeRemainingSeconds / 60);
  const secondsRemaining = timeRemainingSeconds % 60;

  const minutesRemainingStr = minutesRemaining.toString().padStart(2, "0");
  const secondsRemainingStr = secondsRemaining.toString().padStart(2, "0");

  const timeRemainingStr = `${minutesRemainingStr}:${secondsRemainingStr} remaining`;

  document.getElementById('activityTime').textContent = timeRemainingStr;
} else {
  // Calculate time difference in milliseconds (more precise than seconds)
  const timeDiffMs = now - activityStart;

  // Convert time difference to seconds (avoid rounding issues)
  const timeDiffSeconds = Math.floor(timeDiffMs / 1000);

  // Convert time difference to human-readable format (e.g., "01:45 elapsed")
  let timeDiffStr;

  const minutes = Math.floor(timeDiffSeconds / 60);
  const remainingSeconds = timeDiffSeconds % 60;

  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = remainingSeconds.toString().padStart(2, "0");

  timeDiffStr = `${minutesStr}:${secondsStr} elapsed`;
  document.getElementById('activityTime').textContent = timeDiffStr;
}

      
      }
    } else {
      document.getElementById('landyardDiscord').style.display = 'none';
      document.getElementById('project').style.display = 'block';
    };
    const loadingDiv = document.getElementById('loading');
    const conentSite = document.getElementById('loadedLandyard');
    loadingDiv.style.display = 'none';
    conentSite.style.display = 'flex'

  })
