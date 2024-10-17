const username = process.argv.splice(2);

if (!username) {
  console.error("Please provide a GitHub username.");
}

async function getGitHubUserActivity(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/events`
  );

  if (!response.ok) {
    throw Error("There is no such an user");
  }
  return response.json();
}

function displayUserActivity(events) {
  if (events.length === 0) {
    return "No recent activity";
  }
  events.forEach((event) => {
    switch (event.type) {
      case "CreateEvent":
        console.log(`Created ${event.payload.ref_type} in ${event.repo.name}`);
      case "WatchEvent":
        console.log(`Starred ${event.repo.name}`);
      case "PushEvent":
        const repo = event.repo.name;
        const eventCount = event.payload.size;
        console.log(`Pushed ${eventCount} commits to ${repo}`);
    }
  });
}

getGitHubUserActivity(username)
  .then((events) => {
    displayUserActivity(events);
  })
  .catch((error) => {
    console.log(error);
  });
