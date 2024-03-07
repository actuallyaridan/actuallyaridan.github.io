    // THIS CODE IS EXPERIMENTAL. DO NOT COPY IT

fetch('https://api.lanyard.rest/v1/users/701403809129168978')
  .then(response => response.json())
  .then(data => {
    const { activities, discord_status, listening_to_spotify } = data.data;
    if (!activities.length) {
        // No activity found, display message
        document.getElementById('name').textContent = 'No activity running';
      } else 
      {
   // Set content of divs
   document.getElementById('name').textContent = activities[0].name;
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
   document.getElementById('name').textContent = activities[0].name + ', ' + timeDiffStr;

   
  //  document.getElementById('discord_status').textContent = discord_status;
  //  document.getElementById('listening_to_spotify').textContent = listening_to_spotify;

   // You can add similar lines for other properties retrieved from the API
      }
      const loadingDiv = document.getElementById('loading');
      const conentSite = document.getElementById('loadedLandyard');
      loadingDiv.style.display = 'none';
      conentSite.style.display = 'block'
  })
  .catch(error => console.error(error));
