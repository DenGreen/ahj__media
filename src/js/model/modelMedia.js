export default class Media {
  constructor() {
    this.element = null;
    this.stream = null;
    this.chunks = [];
    this.recorder = null;
  }

  async init(element) {
    this.element = element;
    this.stream = await navigator.mediaDevices.getUserMedia(
      this.mediaType()
    );
    this.recorderEvent();
  }

  recorderEvent() {
    this.recorder = new MediaRecorder(this.stream);

    this.recorder.addEventListener("dataavailable", (evt) => {
      console.log("data available");
      this.chunks.push(evt.data);
    });
    
    this.recorder.addEventListener("stop", (evt) => {
      this.stream.getTracks().forEach((track) => track.stop());
      console.log("recording stopped");
      const blob = new Blob(this.chunks);
      this.element.src = URL.createObjectURL(blob);
      this.chunks = [];
    });
  }

  start() {
    this.recorder.start();
  }

  stop() {
    this.recorder.stop();
  }
}
