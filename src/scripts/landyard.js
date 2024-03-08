// THIS CODE IS EXPERIMENTAL. DO NOT COPY IT

fetch('https://api.lanyard.rest/v1/users/701403809129168978')
  .then(response => response.json())
  .then(data => {
    const { activities, discord_status, listening_to_spotify } = data.data;

    const discordStatusDiv = document.getElementById('discordStatus');
    const statusWrapper = document.getElementById('statusWrapper');
    if (statusWrapper) {
      if (discord_status === 'online') {
        statusWrapper.classList.remove('offline'); // Remove pre-existing "red" class
        statusWrapper.classList.add('online'); // Add "green" class if online
      }
    }

    if (discord_status === 'online') {
      if (!activities.length) {
        // No activity found, display message
        const activityDiscordWrapper = document.getElementById('discordActivity');
        activityDiscordWrapper.classList.remove('discordActivityHidden'); // Remove pre-existing "red" class
        activityDiscordWrapper.classList.add('discordActivityShow'); // Add "green" class if online
        document.getElementById('activities').textContent = 'No activity running';
      } else {
        // Set content of divs
        document.getElementById('activities').textContent = activities[0].name;
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
  
        // Update the activities div content with the time difference
        document.getElementById('activities').textContent ='Running: ' + activities[0].name + ', ' + timeDiffStr;
  

        //  document.getElementById('listening_to_spotify').textContent = listening_to_spotify;
  
        // You can add similar lines for other properties retrieved from the API
      }
    };
    const loadingDiv = document.getElementById('loading');
    const conentSite = document.getElementById('loadedLandyard');
    loadingDiv.style.display = 'none';
    conentSite.style.display = 'flex'

  })
  .catch(error => console.error(error));
