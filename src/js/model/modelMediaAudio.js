import Media from "./modelMedia";

export default class Audio extends Media {
    mediaType() {
        return { audio: true, video: false };
    }
}