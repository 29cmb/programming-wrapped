# Programming Wrapped
A vscode extension to track the work you've done in the past 365 days!

![Example image](https://raw.githubusercontent.com/29cmb/programming-wrapped/refs/heads/master/resources/docs/Example.png)

*Values are obviously fluxuated, I didn't spend 200 days of a year in vscode*

## Functionality
The extension functions similar to WakaTime, and is inspired by the critically aclaimed [Spotify Wrapped](https://spotify.com/wrapped) feature.

Each minute, the extension will check if you wrote any new code, if so, it'll give you an extra minute towards your statistics, which can be viewed any time by clicking the present button on the side of your screen. Data does not reset every year, but year-old heartbeats get removed. **All data is locally stored, so it will not sync between devices**

![Sidebar Icon](https://raw.githubusercontent.com/29cmb/programming-wrapped/refs/heads/master/resources/sidebar.png)

## Goals
I find it very difficult to set goals for myself and keep track of that time, so in this extension, you can set a goal using the `Set Goal` command and specifying an [ms formatted time](https://npmjs.org/ms), this will then appear in your wrapped tab.

![Goals](https://raw.githubusercontent.com/29cmb/programming-wrapped/refs/heads/master/resources/docs/goals.png)

# Commands
There are a few commands which you can use to do certain behavior

## Toggle Heartbeat View

![Command input](https://raw.githubusercontent.com/29cmb/programming-wrapped/refs/heads/master/resources/docs/toggle_heartbeat_view.png)

This will enable a small display at the bottom of your screen to show you the amount of heartbeats have been recorded in the past year

![Heartbeat View](https://raw.githubusercontent.com/29cmb/programming-wrapped/refs/heads/master/resources/docs/heartbeat_view.png)

## Set Goal
![Command input](https://raw.githubusercontent.com/29cmb/programming-wrapped/refs/heads/master/resources/docs/set_goal.png)

Allows you to set a goal for tracking, which can be changed at any time


