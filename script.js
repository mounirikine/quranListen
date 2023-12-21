
const apiUrl = 'https://mp3quran.net/api/v3/reciters';
const language = 'ar';

async function getReciters() {
    const shoseReciter = document.querySelector('#chooseReceter');
    const res = await fetch(`${apiUrl}?language=${language}`);
    const data = await res.json();

    shoseReciter.innerHTML = `<option value=''>اختر القارئ</option>`; // Clear previous options

    data.reciters.forEach(reciter => {
        shoseReciter.innerHTML += `<option value='${reciter.id}'>${reciter.name}</option>`;
    });

    shoseReciter.addEventListener('change', (e) => {
        getMoshaf(e.target.value);
    });
}

getReciters();

async function getMoshaf(reciter) {
    const shooseMoshaf = document.querySelector('#chooseMoshaf');
    const res = await fetch(`${apiUrl}?language=${language}&reciter=${reciter}`);
    const data = await res.json();
    const moshafs = data.reciters[0].moshaf;

    shooseMoshaf.innerHTML = `<option value=''>اختر المصحف</option>`; // Clear previous options

    moshafs.forEach(moshaf => {
        shooseMoshaf.innerHTML += `<option value='${moshaf.id}'  data-list='${moshaf.surah_list}'  data-server='${moshaf.server}' > ${moshaf.name}</option>`;
    });

    shooseMoshaf.addEventListener('change', (e) => {
        const selectedMoshaf =shooseMoshaf.options[shooseMoshaf.selectedIndex];
        const surahServer = selectedMoshaf.dataset.server;
        const surahList = selectedMoshaf.dataset.list;
        getsurah(surahServer, surahList);
    });
}

async function getsurah(surahServer, surahList) {
    
    const shooseSurah = document.querySelector('#chooseSurah');

    const res = await fetch('https://mp3quran.net/api/v3/suwar');
    const data = await res.json();
    const surahNames = data.suwar;
    
    surahList =  surahList.split(',');
    shooseSurah.innerHTML = `<option value=''>اختر السورة:</option>`

    surahList.forEach(surah => {
        const padSurah = surah.padStart(3,'0')
      surahNames.forEach(suraName =>{
        if(suraName.id == surah){
            shooseSurah.innerHTML += `<option value='${surahServer}${padSurah}.mp3' > ${suraName.name}</option>`;
        }
      })
    });

    shooseSurah.addEventListener('change', (e) => {
        const selectedSurah =shooseSurah.options[shooseSurah.selectedIndex];
      
        playSurah(selectedSurah.value)
    });
}

function playSurah(selectedSurah){
    const audioPlayer = document.getElementById('audioPlayer')
    audioPlayer.src = selectedSurah
    audioPlayer.play()
}



function playLive(liveLink){
    if(Hls.isSupported()) {
      var video = document.getElementById('video');
      var hls = new Hls();
      hls.loadSource(liveLink);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED,function() {
        video.play();
    });
   }
   // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
   // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
   // This is using the built-in support of the plain video element, without using hls.js.
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = 'https://d26g5bnklkwsh4.cloudfront.net/adf856d9-a233-484b-a730-f7ac57c53aa5/master.m3u8';
      video.addEventListener('canplay',function() {
        video.play();
      });
    }
}


// fetch data surah

async function Suwar(){

    const res = await fetch('http://api.quran-tafseer.com/quran/');
    const data = await res.json()

   
    const suawr = document.getElementById('suawr')
    data.forEach(surah => {
        suawr.innerHTML += `<a class='px-4 md:px-6 lg:px-8 gap-2 md:gap-3 py-2 md:py-3 bg-white flex items-center text-center' href='https://surahquran.com/${surah.index}.html' target='_self'>
        <svg class="w-5 md:w-6 h-5 md:h-6 text-gray-800 dark:text-white text-base md:text-lg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
            <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
        </svg>
        <span class="text-base md:text-lg">${surah.name}</span>
    </a>
    `
    })

}

Suwar()





// send email message
function emailSend() {
    // Disable the submit button and change its text to indicate loading
    var submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.innerHTML = 'جاري الإرسال...';

    var params = {
        from_name: document.getElementById('from_name').value,
        email_id: document.getElementById('email_id').value,
        message: document.getElementById('message').value
    };

    emailjs.send('service_gae986o', 'template_bz4o1kq', params).then(function (res) {
        Swal.fire({
            title: "لقد تم ارسال رسالتك",
            text: "بنجاح",
            icon: "success"
        });

        // Re-enable the submit button and reset its text
        submitButton.disabled = false;
        submitButton.innerHTML = 'أرسل رسالة';
    });

    // Returning false prevents the form from refreshing the page
    return false;
}


// change bg on scroll
function handleHeader() {
    window.addEventListener('scroll', function () {
        var header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.9)'; // Replace with your desired background color and opacity
        } else {
            header.style.background = 'transparent'; // Reset to initial state
        }
    });
    }
handleHeader();

