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
    this.popappBtnCancel = document.querySelector(".popapp__btn-cancel");
    this.popappError = null;
    this.nav();
  }

  async nav() {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  }

  async init() {
    this.enteringGeoPosition().then((value) => {
      this.checkingCoordinatesOne(value);
    });

    this.timelineAudioButton.addEventListener("mousedown", (e) => {
      const idAudio = this.view.recordAudio(this.cor);
      const postAudio = document.querySelector(idAudio);
      this.mediaAudioPost(postAudio);
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
      this.enteringGeoPosition().then((value) => {
        this.checkingCoordinates(value);
      });
    });

    this.popappForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const popappInputValue = this.popappInput.value;
      await this.validationPopappError(popappInputValue);
    });

    this.popappInput.addEventListener("input", () => {
      if (this.popappError) this.popappError.remove();
    });

    this.popappBtnCancel.addEventListener("click", () => {
      this.view.popappErrorAdd(this.popapp);
      this.cor = { latitude: 0, longitude: 0 };
      this.view.recordText(this.timelineInput.value, this.cor);
      this.timelineInput.value = "";
    });
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

  checkingCoordinatesOne(cor) {
    this.cor = cor;
  }

  checkingCoordinates(cor) {
    if (cor.error) {
      this.view.popappErrorRemove(this.popapp);
    } else {
      this.view.recordText(this.timelineInput.value, cor);
      this.timelineInput.value = "";
      this.cor = cor;
    }
  }

  async validationPopappError(popappInputValue) {
    const regular = this.validatorPattern(popappInputValue);

    if (regular) {
      const arr = popappInputValue.split(",");
      const lat = arr[0].replace("[", "");
      const long = arr[1].replace("]", "");
      this.cor = { latitude: lat, longitude: long };
      this.view.popappErrorAdd(this.popapp);
      this.view.recordText(this.timelineInput.value, this.cor);
      this.timelineInput.value = "";
    } else {
      this.view.messageError(this.popappInput);
      this.popappError = document.querySelector(".popapp__error");
    }
  }

  validatorPattern(popappInputValue) {
    /*     const regular =
      /(^\[((:*[0-9]{1,2}\.[0-9]+?,(\s)?[-|−][0-9]{1,2}\.[0-9]+))\]$)|(^([0-9]{1,2}\.[0-9]+?,(\s)?[-|−][0-9]{1,2}\.[0-9]+)$)/; */
    const regular =
      /(^\[((:*[0-9]{1,2}\.[0-9]+?,(\s)?[-|−][0-9]{1,2}\.[0-9]+))\]$)|(^([0-9]{1,2}\.[0-9]+?,(\s)?[-|−][0-9]{1,2}\.[0-9]+)$)|(^\[([-|−](:*[0-9]{1,2}\.[0-9]+?,(\s)?[0-9]{1,2}\.[0-9]+))\]$)|(^\[([-|−](:*[0-9]{1,2}\.[0-9]+?,(\s)?[-|−][0-9]{1,2}\.[0-9]+))\]$)|(^([-|−][0-9]{1,2}\.[0-9]+?,(\s)?[0-9]{1,2}\.[0-9]+)$)|(^([-|−][0-9]{1,2}\.[0-9]+?,(\s)?[-|−][0-9]{1,2}\.[0-9]+)$)|(^([0-9]{1,2}\.[0-9]+?,(\s)?[0-9]{1,2}\.[0-9]+)$)|(^\[((:*[0-9]{1,2}\.[0-9]+?,(\s)?[0-9]{1,2}\.[0-9]+))\]$)/;
    return regular.test(popappInputValue);
  }
}

const controler = new Controller();
controler.init();
