document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['waifupic'], function(result) {
        if (!result.waifupic) {
            result.waifupic = 'option1';
        }
        //randomizer made by sky_yuo
        const pic = document.getElementById('waifupic');
        const text = document.getElementById('dialogue');
        pic.src = 'images/' + result.waifupic + '.jpeg';
        const messages = [
            "Uhm... you weren't planning to open that webpage, were you?",
            "Senpai, your lack of willpower is kinda cute, but you should reaaally get back to work.",
            "Ara Ara! My dear pet is trying to slack off! That simply won't do now, won't it?",
            "You're such a cutie, but you need to be patient, and have fun with me later instead.",
            "Oh no, are we really going to that site again?",
            "Ah, I thought you had more self-control than this!",
            "Yikes! That's where you're going? I expected better from you!",
            "Uh-oh, looks like someone's off the productivity path again!",
            "Eek! I was hoping we'd do something more fun than visiting that old site!",
            "Oops, clicking there was a mistake, right? Let's pretend that didn't happen!",
            "Not that website again! We need to talk about your choices, huh?",
            "Are you sure this is a good idea? There are better places to be, you know!",
            "Hey, let’s focus, okay? That site's not helping us at all!",
            "Disappointed but not surprised. Let's try to stay on track next time, okay?",
            "Really? We're back here again? I was hoping for something new!",
            "Ah, backsliding are we? Let’s find a better place to spend our time!",
            "Oh, come on! You promised we would avoid this site, remember?",
            "Wow, you're full of surprises... and not the good kind this time!",
            "Sigh, I guess it’s my turn to steer us away from trouble, huh?",
            "Look, I know it's tempting, but let's try to be a bit more productive, okay?",
            "You're testing my patience! That site again? Let's choose wisely next time.",
            "Hmm, if it were up to me, we'd never come here. Let's move on, shall we?",
            "Uh-oh, I’m getting that disappointed feeling again. Let’s go somewhere better!",
            "Is this really where you want to be? I think we can do much better!",
            "."
        ];
        const randomIndex = Math.floor(Math.random() * messages.length);
        text.textContent = messages[randomIndex];
    });
});
