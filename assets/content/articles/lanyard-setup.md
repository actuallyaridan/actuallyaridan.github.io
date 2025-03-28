---
title: "Display your current Discord activity on your website using Lanyard"
date: "03/01/2025"
link: "/articles/lanyard-setup"
---

## What is Lanyard?

Lanyard is a lightweight and free API that allows you to retrieve real-time information about a Discord user’s activity. This includes their online status, currently playing game, Spotify song, or any custom status they have set. The API works using WebSockets for instant updates and also provides a REST endpoint for fetching data on demand.

## How Does Lanyard Work?

Lanyard operates using WebSockets, which means it pushes updates instantly whenever a user’s activity changes. This makes it an excellent choice for displaying live Discord statuses without constantly polling an API. The WebSocket connection maintains a persistent link between your website and Lanyard’s servers, ensuring that data updates occur in real-time.

## Setting Up Lanyard on Your Website

### Step 1: Get Your Discord User ID

To use Lanyard, you’ll need your Discord user ID. You can find this by:
1. Enabling Developer Mode in Discord (Settings > Advanced > Developer Mode).
2. Right-clicking your profile in Discord and selecting **Copy ID**.

### Step 2: Establish a WebSocket Connection

To receive live updates, you need to connect to the Lanyard WebSocket API: `wss://api.lanyard.rest/socket` 
Below is a simple JavaScript snippet that connects to Lanyard and logs your Discord activity to the console.

```javascript
const userID = "YOUR_DISCORD_USER_ID";
let websocket;
let heartbeatInterval;

function connectWebSocket() {
  websocket = new WebSocket("wss://api.lanyard.rest/socket");

  websocket.onopen = function () {
    console.log("[Lanyard] Connected.");
    websocket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userID } }));
  };

  websocket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.op === 0) {
      console.log("[Lanyard] User Activity:", data.d);
    } else if (data.op === 1) {
      heartbeatInterval = setInterval(() => websocket.send(JSON.stringify({ op: 3 })), data.d.heartbeat_interval);
    }
  };

  websocket.onclose = function () {
    console.warn("[Lanyard] Connection lost. Reconnecting in 3 seconds...");
    clearInterval(heartbeatInterval);
    setTimeout(connectWebSocket, 3000);
  };
}

connectWebSocket();
```

### Step 3: Displaying the Data on Your Website

You can now update your website’s UI using the received data. Here’s an example that displays the user’s current Discord status:

```html
<div id="statusWrapper">Loading...</div>
```

```javascript
function updateStatus(status) {
  const statusWrapper = document.getElementById("statusWrapper");
  if (statusWrapper) {
    statusWrapper.textContent = status.charAt(0).toUpperCase() + status.slice(1);
  }
}

websocket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  if (data.op === 0) {
    updateStatus(data.d.discord_status);
  }
};
```

### Step 4: Enhancing with Activity Information

Lanyard also provides details about the user’s current activity, such as playing a game or listening to music. You can extract this information and display it on your site:

```javascript
function updateActivity(activities) {
  const activityElement = document.getElementById("activity");
  if (activities.length > 0) {
    activityElement.textContent = `Playing: ${activities[0].name}`;
  } else {
    activityElement.textContent = "No active status";
  }
}

websocket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  if (data.op === 0) {
    updateActivity(data.d.activities);
  }
};
```

### Step 5: Styling Your Lanyard Widget

You can style your status display using CSS to make it blend seamlessly with your website’s theme:

```css
#statusWrapper {
  font-size: 1.2em;
  font-weight: bold;
  padding: 10px;
}
```

## Conclusion

Lanyard is a simple yet powerful tool that lets you display your real-time Discord activity on your website. By leveraging WebSockets, you can ensure that your status updates instantly. With just a few lines of JavaScript, you can integrate and customize Lanyard to fit your site’s design and functionality.

If you run into issues, check out [Lanyard's GitHub](https://github.com/Phineas/lanyard) for more documentation and community support.

Now you’re all set to display your Discord status in real-time on your website! 🚀

