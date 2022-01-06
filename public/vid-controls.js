function playPause(myVideo) { 
  if (myVideo.paused) { 
    myVideo.play(); 
  }
  else { 
    myVideo.pause(); 
  }
} 

function rewind(myVideo) { 
    // if (myVideo.play)
    myVideo.pause();
    myVideo.currentTime = 0;
}

// debugging controls 
function showDebugControls() { 
  var header = document.getElementById('title'); 
  var timecode = document.getElementById('timer');
  header.style.display = 'block';
  timecode.style.display = 'block';
  console.log("showDebugControls() called");
}

function hideDebugControls() { 
  var header = document.getElementById('title'); 
  var timecode = document.getElementById('timer');
  header.style.display = 'none';
  timecode.style.display = 'none';
  console.log("hideDebugControls() called")
}