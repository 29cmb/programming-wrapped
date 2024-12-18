var hasGoal = false;
var goalProgress = 0;
var workTime = 0;

window.addEventListener('message', event => {
    const data = event.data;
    switch (data.command) {
        case 'getGoalProgress':
            goalProgress = clamp(Math.floor(data.goalProgress * 100), 0, 100);
            document.getElementById('goal').innerHTML = `${goalProgress}%`;
            break;
        case 'hasGoal':
            hasGoal = data.hasGoal;
            break;
        case 'getGoal':
            const element = document.getElementById("goal-info-panel1");
            if (element == null) return;

            var text = "";
            if (hasGoal) {
                text = `Looks like you set up a goal! You set a goal of <code>${formatTime(data.goal)}</code> programming.`;
                if (goalProgress == 100) {
                    text += ` Though it took determination, you completed your goal! Congratulations! 👏👏👏👏👏`;
                } else {
                    text += ` You've completed <b>${goalProgress}%</b> of your goal, or <code>${formatTimeMinutes(workTime)}</code>. Keep going!`;
                }
            } else {
                text = `Looks like you didn't create a goal, you can create one using <code>\> Programming wrapped: Set Goal</code>`;
            }

            element.innerHTML = text;
            break;
        case 'getWorkTime':
            workTime = data.time;
            break;
        case 'getHeartbeats':
            const total = document.getElementById("total-large");
            const details = document.getElementById("total-time-info-panel2")

            total.innerHTML = `${heartbeatsToHours(data.heartbeats)}h`;
            details.innerHTML = `You sent a total of <code>${data.heartbeats}</code> heartbeats, spending a total of <code>${heartbeatsToHours(data.heartbeats)}h</code> programming!`;
    }
});

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}

function formatTimeMinutes(mins) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    return `${hours}h ${minutes}m`;
}

function heartbeatsToHours(heartbeats){
    return Math.floor(heartbeats / 60);
}