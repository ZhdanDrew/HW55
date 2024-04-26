// Interfaces

const artistInterface = {
  id: 0,
  name: "",
  link: "",
  picture: "",
  picture_small: "",
  picture_medium: "",
  picture_big: "",
  picture_xl: "",
  tracklist: "",
  type: "",
};

const albumInterface = {
  id: 0,
  title: "",
  cover: "",
  cover_small: "",
  cover_medium: "",
  cover_big: "",
  cover_xl: "",
  md5_image: "",
  tracklist: "",
  type: "",
};

const songInterface = {
  id: 0,
  readable: true,
  title: "",
  title_short: "",
  title_version: "",
  link: "",
  duration: 0,
  rank: 0,
  explicit_lyrics: true,
  explicit_content_lyrics: 0,
  explicit_content_cover: 0,
  preview: "",
  md5_image: "",
  artist: artistInterface,
  album: albumInterface,
};

// Elements

const audio = document.querySelector("audio");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");

const currentSongElement = document.querySelector("#current-song-name");

const songsCardsWrapper = document.querySelector(".music-cards-wrapper");

// General data

let songs = [];

// API

class API {
  constructor(
    baseUrl = "",
    options = {
      headers: {
        "X-RapidAPI-Key": "2ecc6a18f1msh149a8c93469a116p1ff3e3jsn92ea038f0326",
        "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
      },
    }
  ) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  async searchSongsByArtist(artist) {
    const response = await axios({
      method: "GET",
      url: `${this.baseUrl}/search`,
      params: { q: artist },
      headers: this.options.headers,
    });

    songs = response.data.data;

    return response.data;
  }
}
parent;

const musicAPI = new API("https://deezerdevs-deezer.p.rapidapi.com");

// musicAPI.searchSongsByArtist("eminem");

class Views {
  renderSongCard(songData = songInterface, parent) {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "song-card";

    // Image
    const cardImage = document.createElement("img");
    cardImage.className = "song-image";
    cardImage.src = songData.artist.picture_medium;
    cardWrapper.appendChild(cardImage);

    // Title
    const cardTitle = document.createElement("h3");
    cardTitle.textContent = songData.title;
    cardWrapper.appendChild(cardTitle);

    // Description
    const cardDescription = document.createElement("article");
    cardDescription.innerHTML = `
        <p>Duration: ${getSongDuration(songData.duration)}</p>
        <p>Artist: ${songData.artist.name}</p>
        <p>Link: ${songData.link}</p>
    `;
    cardWrapper.appendChild(cardDescription);

    // AudioButon
    const audioButton = document.createElement("button");
    audioButton.className = "audio-button";
    audioButton.textContent = "Play!";

    audioButton.onclick = () => {
      audio.src = songData.preview;
      audio.load();

      Player.controlls.play.classList.replace("fa-play", "fa-pause");
      audio.play();

      views.updateCurrentSongName(songData);
    };

    cardWrapper.appendChild(audioButton);

    // Finaly
    parent.appendChild(cardWrapper);
  }

  updateCurrentSongName(songData = songInterface) {
    currentSongElement.textContent = `${songData.title} (${getSongDuration(
      songData.duration
    )})`;
  }
}

const views = new Views();

const historyItemsWrapper = document.querySelector(".history-items-wrapper");

class SearchHistory {
  constructor() {
    const historyItems = this.getHistory();
    this.renderHistoryItems(historyItems);
  }

  getHistory() {
    return JSON.parse(localStorage.getItem("history") || "[]");
  }

  addToHistory(request) {
    let history = this.getHistory();

    if (history.includes(request)) {
      history = history.filter((prevRequest) => prevRequest !== request);
    }

    history.push(request);

    localStorage.setItem("history", JSON.stringify(history));
  }

  removeFromHistory(request) {
    let history = this.getHistory();

    history = history.filter((prevRequest) => prevRequest !== request);

    localStorage.setItem("history", JSON.stringify(history));
  }

  renderHistoryItems(items, maxItemsCount = 2) {
    historyItemsWrapper.innerHTML = "";

    items.slice(-maxItemsCount).forEach((item) => {
      const itemElement = document.createElement("button");
      itemElement.className = "history-item";
      itemElement.textContent = item;

      const deleteItemElement = document.createElement("i");
      deleteItemElement.className = "fas fa-times";

      deleteItemElement.style.color = "red";
      deleteItemElement.style.marginLeft = "5px";

      deleteItemElement.onclick = (event) => {
        event.stopPropagation();

        this.removeFromHistory(item);
        const historyItems = this.getHistory();
        this.renderHistoryItems(historyItems);
      };

      itemElement.appendChild(deleteItemElement);

      itemElement.onclick = () => {
        searchInput.value = item;
        renderSongsCards();
      };

      itemElement.addEventListener("click", () => {
        console.log("2 click");

        setTimeout(() => {
          console.log("Timeout!");
        }, 1000);
      });

      historyItemsWrapper.appendChild(itemElement);
    });
  }
}

// HW:
// Додати відображення елементів історії під пошуком
// натиснувши на елемент історії ви маєте одразу шукати виконавця

const searchHistory = new SearchHistory();

async function renderSongsCards() {
  const searchValue = searchInput.value;

  searchHistory.addToHistory(searchInput.value);
  const historyItems = searchHistory.getHistory();
  searchHistory.renderHistoryItems(historyItems);

  const songsData = await musicAPI.searchSongsByArtist(searchValue);

  songsCardsWrapper.innerHTML = "";

  songsData.data.forEach((songData) => {
    views.renderSongCard(songData, songsCardsWrapper);
  });

  console.log(songsData);
}

searchButton.onclick = renderSongsCards;

function normalizeTimeValue(timeValue) {
  return timeValue.length === 2 ? timeValue : `0${timeValue}`;
}

function getSongDuration(s) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setSeconds(s);

  const minutes = `${date.getMinutes()}`;
  const seconds = `${date.getSeconds()}`;

  const normalizedMinutes = normalizeTimeValue(minutes);
  const normalizedSeconds = normalizeTimeValue(seconds);

  return `${normalizedMinutes}:${normalizedSeconds}`;
}

// Player

// Player Button
{
  /* <i class="fas fa-chevron-left" id="prev-song-button"></i>
<i class="fas fa-play" id="play-stop-button"></i>
<i class="fas fa-chevron-right" id="next-song-button"></i> */
}
class Player {
  static controlls = {
    prev: document.getElementById("prev-song-button"),
    play: document.getElementById("play-stop-button"),
    next: document.getElementById("next-song-button"),
    progress: document.getElementById("player-progress"),
    progressTimer: document.getElementById("player-progress-time"),
  };

  constructor(currentSongIndex = 0) {
    this.currentSongIndex = currentSongIndex;

    Player.controlls.next.onclick = () => {
      this.nextSong();
    };

    Player.controlls.prev.onclick = () => {
      this.prevSong();
    };

    Player.controlls.play.onclick = () => {
      if (!audio.src) audio.src = songs[this.currentSongIndex].preview;

      if (!audio.paused) {
        this.stop();
      } else {
        this.play();
      }
    };

    Player.controlls.progress.oninput = () => {
      audio.currentTime = Number(Player.controlls.progress.value);
    };

    // Player.controlls.progress.onchange = () => {
    //   console.log("ON Change");
    // };

    audio.ontimeupdate = () => {
      Player.controlls.progress.value = audio.currentTime;
      // Завдання:
      // Дописати оновлення значення (тексту) у player-progress-time
      Player.controlls.progressTimer.textContent = getSongDuration(
        audio.currentTime
      );
    };
  }

  stop() {
    Player.controlls.play.classList.replace("fa-pause", "fa-play");
    audio.pause();
  }

  play() {
    Player.controlls.play.classList.replace("fa-play", "fa-pause");
    audio.play();
  }

  prevSong() {
    if (songs.length) {
      Player.controlls.progress.value = 0;
      this.currentSongIndex -= 1;
      audio.src = songs[this.currentSongIndex]?.preview || songs[0].preview;
      this.play();
    }
  }

  nextSong() {
    if (songs.length) {
      Player.controlls.progress.value = 0;
      this.currentSongIndex += 1;
      audio.src = songs[this.currentSongIndex]?.preview || songs[0].preview;
      this.play();
    }
  }
}

const player = new Player();
