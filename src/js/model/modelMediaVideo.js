import Media from "./modelMedia";

export default class Video extends Media {
    mediaType() {
        return { audio: true, video: true };
    }
}