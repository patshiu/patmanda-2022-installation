function playPause(myVideo) { 
  if (myVideo.paused) { 
    myVideo.play(); 
  }
  else { 
    myVideo.pause(); 
  }
} 

function rewind(myVideo) { 
    if (myVideo.play)
        myVideo.pause();
    myVideo.currentTime = 0;
}