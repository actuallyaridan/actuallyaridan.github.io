// THIS CODE IS EXPERIMENTAL. DO NOT COPY IT
let userID = "485504221781950465"; 


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
      statusWrapper.textContent=discord_status;
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

        document.getElementById('activityName').textContent = activities[0].name;
        document.getElementById('activityState').textContent = activities[0].state;
        document.getElementById('activityDetails').textContent = activities[0].details;
        // Convert timestamps to human-readable format
        // Convert timestamp to human-readable format
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const activityStart = new Date(activities[0].created_at);
        const activityStartStr = activityStart.toLocaleString('en-US', options);
  
        // Get current date and time
        const now = new Date();
  
        // Calculate time difference in seconds
        const timeDiffSeconds = Math.floor((now - activityStart) / 1000);
  
        // Convert time difference to human-readable format (e.g., "an hour ago")
        let timeDiffStr;
        if (timeDiffSeconds < 60) {
          timeDiffStr = "just now";
        } else if (timeDiffSeconds < 3600) {
          const minutes = Math.floor(timeDiffSeconds / 60);
          timeDiffStr = "for " + minutes + (minutes === 1 ? " minute" : " minutes");
        } else if (timeDiffSeconds < 86400) {
          const hours = Math.floor(timeDiffSeconds / 3600);
          timeDiffStr = "for " + hours + (hours === 1 ? " hour" : " hours");
        } else {
          timeDiffStr = activityStartStr; // Display full date if it's more than a day ago
        }
        document.getElementById('activityTime').textContent = timeDiffStr;

        //  document.getElementById('listening_to_spotify').textContent = listening_to_spotify;
  
        // You can add similar lines for other properties retrieved from the API
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
