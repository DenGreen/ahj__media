export default class View {
  constructor(element = null) {
    this.element = element;
    this.audioRecordingNumber = 0;
    this.videoRecordingNumber = 0;
    this.coordinates = null;
  }

  recordMedia(value, latitude, longitude) {
    this.element.insertAdjacentHTML(
      "afterbegin",
      `<div class="timeline__post">
                <span class="timline__data-time">${this.recordData()}</span>
                ${value}
                <span class="timeline__coordinates">[${latitude}, -${longitude}]</span>
             </div>`
    );
  }

  recordData() {
    const data = new Date().toLocaleString();
    return data;
  }

  recordAudio({ latitude, longitude }) {
    this.audioRecordingNumber = this.audioRecordingNumber + 1;
    const value = `<audio class="timeline__audio" id="a${this.audioRecordingNumber}" controls></audio>`;
    this.recordMedia(value, latitude, longitude);
    return `#a${this.audioRecordingNumber}`;
  }

  recordVideo({ latitude, longitude }) {
    this.videoRecordingNumber = this.videoRecordingNumber + 1;
    const value = `<video class="timeline__video" id="v${this.videoRecordingNumber}" controls></video>`;
    this.recordMedia(value, latitude, longitude);
    return `#v${this.videoRecordingNumber}`;
  }

  recordText(text, { latitude, longitude }) {
    const value = `<p class="timeline__text">${text}</p>`;
    this.recordMedia(value, latitude, longitude);
  }

  enteringGeoPosition() {
    console.log("Введите координаты");
  }

  popappErrorAdd(popapp) {
        popapp.classList.add("popapp--hidden");
  }

  popappErrorRemove(popapp) {
      popapp.classList.remove("popapp--hidden");
}

  messageError(input) {
    input.insertAdjacentHTML(
      "beforebegin",
      `<div class="popapp__error">Введены не коректные данные</div>`
    );
  }
}
