// --- Video Script Only --- //
document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('.video-slide'); 
  let current = 0;
  
  function showVideo(index) {
    videos.forEach((video, i) => {
      video.classList.remove('active');
      video.pause();
      video.currentTime = 0;
    });
    
    videos[index].classList.add('active');
    videos[index].play();
  } 
  
  videos.forEach((video, index) => {
    video.addEventListener('ended', () => {
      current = (index + 1) % videos.length;
      showVideo(current);
    });
    
    if (index === 0) {
      video.play();
    }
  });
});


