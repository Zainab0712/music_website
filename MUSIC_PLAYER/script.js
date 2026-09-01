const sampleTrack = [{
    title:"ANDAZE_KARAM",
    artist:"Unknown Artist",
    src:"./media/Andaze.mp3",
    cover:"linear-gradient(135deg , #8b5cf6 , #22d3ee)"
},
 {
    title:"MI_AMOR",
    artist:"Unknown Artist",
    src:"./media/amor.mp3",
    cover:"linear-gradient(135deg , #ec4899 , #fb923c)"
 },

 {
    title:"TU",
    artist:"Unknown",
    src:"./media/tu.mp3",
    cover:"linear-gradient(135deg , #763e5a , #914e17)"
}
];


const audio = document.getElementById("audio")
const playlistElement = document.getElementById("playlist");
const titleEl = document.getElementById("tracktitle");
const artistEl = document.getElementById("trackartist");
const file = document.getElementById("fileInput");
const previousbtn = document.getElementById("previousbtn");
const playbtn = document.getElementById("playbtn");
const nextbtn = document.getElementById("nextbtn");
const currenttime = document.getElementById("currenttime");
const durationEl = document.getElementById("duration");
const progress = document.getElementById("progress");
const volumeEl = document.getElementById("volume");
const shufflebtn = document.getElementById("shufflebtn");
const repeatbtn = document.getElementById("repeatbtn");
const coverart = document.getElementById("coverart");

let tracks = [...sampleTrack]
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;



// AI code

function normalizeVolume(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  

  return Math.min(1, Math.max(0, numericValue / 100))
  // return numericValue / 100    // it is also working / both returns are giving same values
  

}



function formattime(seconds){
  if(!Number.isFinite(seconds)) return "0:00"
  const mins = Math.floor(seconds/60)
  const secs = Math.floor(seconds%60)
  .toString()
  .padStart(2 , "0")
  return `${mins}:${secs}`
}

function renderPlaylist(){
    playlistElement.innerHTML = "";
    tracks.forEach((track,index)=>{
        const itemList = document.createElement("li");
        itemList.className = `playlist-item${index === currentTrackIndex ? " active" : " "}`;
        itemList.innerHTML = `<strong>${track.title}</strong> <span>${track.artist}</span>`;
      itemList.addEventListener("click",()=>{
        currentTrackIndex = index;
        loadTrack()
        play() 
      })
      playlistElement.appendChild(itemList);
})}

function loadTrack(){
  const track = tracks[currentTrackIndex]
  titleEl.textContent = track.title
  artistEl.textContent = track.artist
  coverart.style.background = track.cover
  audio.src = track.src
  audio.load()
  progress.value = 0
  currenttime.textContent = "0:00"
  durationEl.textContent = "0:00"
  renderPlaylist()
}


function play(){
  audio.play().then(()=>{
    isPlaying = true
    playbtn.innerHTML =` <i class="bi bi-pause-fill"></i>`
  }).catch(()=>{
    isPlaying = false
    playbtn.innerHTML = `<i class="bi bi-play-fill"></i></i>`
  })
}

function pause(){
  audio.pause();
  isPlaying = false
  playbtn.innerHTML = `<i class="bi bi-play-fill"></i></i>`
}

playbtn.addEventListener("click",()=>{
  if(isPlaying){
    pause()
  }else{
    play()
  }
})

function nextTrack(){
  if(isRepeat){
    loadTrack()
    play()
    return
  }if(isShuffle){
    let next = Math.floor(Math.random() * tracks.length)
    while(next === currentTrackIndex && tracks.length){
      next = Math.floor(Math.random() * tracks.length)
    }
    currentTrackIndex = next
  }else{
    currentTrackIndex = (currentTrackIndex+1)%tracks.length
  }
  loadTrack()
  play()
}

function previoustrack(){
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length)%tracks.length
  loadTrack()
  play()
}

previousbtn.addEventListener("click" , previoustrack)
nextbtn.addEventListener("click" , nextTrack)

progress.addEventListener("input",()=>{
  if(!Number.isFinite(audio.duration)) return;
  const target = (Number(progress.value)/100)*audio.duration
  audio.currentTime = target
})


volumeEl.addEventListener("input",()=>{
  const nextVolume = normalizeVolume(volumeEl.value) 
  audio.volume = nextVolume    // audio.volume = 1 :- awaz ziada kum krny k liye is 1 ki value change kraingy
})




shufflebtn.addEventListener("click",()=>{
   isShuffle = !isShuffle
  shufflebtn.classList.toggle("active",isShuffle)
})

repeatbtn.addEventListener("click",()=>{
  isRepeat = !isRepeat
  repeatbtn.classList.toggle("active",isRepeat)
})

audio.addEventListener("timeupdate" , ()=>{
 const percent =  audio.duration ? (audio.currentTime / audio.duration)*100:0 
 progress.value = percent;
 currenttime.textContent = formattime(audio.currentTime)
})

audio.addEventListener("loadedmetadata" , ()=>{
  durationEl.textContent = formattime(audio.duration) 
})



audio.addEventListener("ended", nextTrack);




file.addEventListener("change" , (event)=>{
  const files = Array.from(event.target.files || [] )

  files.forEach((file)=>{
      const objurl = URL.createObjectURL(file) 
      const gradient = [
        "linear-gradient(135deg , #8b5cf6 , #22d3ee)", 
        "linear-gradient(135deg , #ec4899 , #fb923c)",
        "linear-gradient(135deg , #763e5a , #914e17)"
      ][tracks.length%3];

      tracks.push({
        title:file.name,
        artist:"Local Upload",
        src:objurl,
        cover:gradient
      })
  })
 
   if(files.length){
    currentTrackIndex = tracks.length - files.length;
    loadTrack()
    play()
   }

   
  }
  
)

loadTrack()
renderPlaylist()