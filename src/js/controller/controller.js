import ModelAudio from "../model/modelMediaAudio";
import View from "../view/view";
import ModelVideo from "../model/modelMediaVideo";

export default class Controller {
  constructor() {
    this.timelineAudioButton = document.querySelector(
      ".timeline__audio-button"
    );
    this.timelineVideoButton = document.querySelector(
      ".timeline__video-button"
    );
    this.timelineForm = document.querySelector(".timeline__form");
    this.timelineBoxPost = document.querySelector(".timeline__box-post");
    this.timelineInput = document.querySelector(".timeline__input");
    this.view = new View(this.timelineBoxPost);
    this.modelAudio = new ModelAudio();
    this.modelVideo = new ModelVideo();
    this.cor = null;
    this.popapp = document.querySelector(".popapp");
    this.poppapBtnOk = document.querySelector(".poppap__btn-ok");
    this.popappInput = document.querySelector(".popapp__input");
    this.popappForm = document.querySelector(".popapp__form");
    this.popappBtnCancel = document.querySelector('.popapp__btn-cancel');
    this.popappError = null;
  }

  async init() {
    await this.enteringGeoPosition().then((value) => {
      this.checkingCoordinates(value);
    });

    this.timelineAudioButton.addEventListener("mousedown", (e) => {
      const idAudio = this.view.recordAudio(this.cor);
      const postAudio = document.querySelector(idAudio);
      this.mediaAudioPost(postAudio);
      console.log();
      console.log(`start audio ${idAudio}`);
    });

    this.timelineAudioButton.addEventListener("mouseup", (e) => {
      this.modelAudio.stop();
      console.log("stop audio");
    });

    this.timelineVideoButton.addEventListener("mousedown", (e) => {
      const idVideo = this.view.recordVideo(this.cor);
      const postVideo = document.querySelector(idVideo);

      this.mediaVideoPost(postVideo);

      console.log(`start video ${idVideo}`);
    });

    this.timelineVideoButton.addEventListener("mouseup", (e) => {
      this.modelVideo.stop();
      console.log("stop video");
    });

    this.timelineForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.view.recordText(this.timelineInput.value, this.cor);
      this.timelineInput.value = "";
    });

    this.popappForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const popappInputValue = this.popappInput.value;
      this.validationPopappError(popappInputValue);
    });

    this.popappInput.addEventListener('input', ()=>{
      if(this.popappError) this.popappError.remove();
    })

    this.popappBtnCancel.addEventListener('click', () => {
      this.view.popappError(this.popapp);
      this.cor = { latitude: 0, longitude: 0 };
    })
  }

  async mediaAudioPost(post) {
    await this.modelAudio.init(post);
    this.modelAudio.start();
  }

  async mediaVideoPost(post) {
    await this.modelVideo.init(post);
    this.modelVideo.start();
  }

  enteringGeoPosition() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude: latitude, longitude: longitude, error: null });
        },
        (error) => {
          resolve({ error: "Координаты не доступны" });
        }
      );
    });
  }

  checkingCoordinates(cor) {
    if (cor.error) {
      this.view.popappError(this.popapp);
    } else {
      this.cor = cor;
    }
  }

  validationPopappError(popappInputValue) {
    const regular = this.validatorPattern(popappInputValue);

    if (regular) {
      const lat = /[0-9]{1,2}\.[0-9]+?,(\s)?/.exec(popappInputValue);
      const long = /[-|−][0-9]{1,2}\.[0-9]+/.exec(popappInputValue);
      const latitude = /[0-9]{1,2}\.[0-9]+/.exec(lat[0]);
      const longitude = /[0-9]{1,2}\.[0-9]+/.exec(long[0]);

      this.cor = {latitude: latitude[0], longitude: longitude[0]};
      this.view.popappError(this.popapp);
    } else {
      this.view.messageError(this.popappInput);
      this.popappError = document.querySelector('.popapp__error');
    }
  }

  validatorPattern(popappInputValue) {
    const regular = /(^\[((:*[0-9]{1,2}\.[0-9]+?,(\s)?[-|−][0-9]{1,2}\.[0-9]+))\]$)|(^([0-9]{1,2}\.[0-9]+?,(\s)?[-|−][0-9]{1,2}\.[0-9]+)$)/;
    return regular.test(popappInputValue)
  }
}

const controler = new Controller();
controler.init();
