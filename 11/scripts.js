/* Get Our Elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreenButton = player.querySelector('.fullscreen');

/* Build our functions */
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';

  video[method]();
}

function updateButton() {
  toggle.textContent = this.paused ? '►' : '❚❚';
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;

  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(evt) {
  const scrubTime = (evt.offsetX / progress.offsetWidth) * video.duration;

  video.currentTime = scrubTime;
}

/* Hook up the event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => {
  range.addEventListener('mousedown', () => {
    range.addEventListener('mousemove', handleRangeUpdate);
  });

  range.addEventListener('mouseup', () => {
    range.removeEventListener('mousemove', handleRangeUpdate);
  });
});

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      video.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      video.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      video.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      video.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      video.webkitCancelFullScreen();
    }
  }
}

let mousedown = false;

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (evt) => mousedown && scrub(evt));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullScreenButton.addEventListener('click', toggleFullScreen);