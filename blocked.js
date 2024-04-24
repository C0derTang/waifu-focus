document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['waifupic'], function(result) {
        if (!result.waifupic) {
            result.waifupic = 'option1';
        }

        //randomizer by sky_yuo

        const pic = document.getElementById('waifupic');
        const text = document.getElementById('dialogue');
        pic.src = 'images/' + result.waifupic + '.jpeg';
        const messages = [
            "Uhm... you weren't planning to open that webpage, were you?",
            "Senpai, your lack of willpower is kinda cute, but you should reaaally get back to work.",
            "Ara Ara! My dear pet is trying to slack off! That simply won't do now, won't it?",
            "You're such a cutie, but you need to be patient, and have fun with me later instead."
        ];
        const randomIndex = Math.floor(Math.random() * messages.length);
        text.textContent = messages[randomIndex];
    });
});