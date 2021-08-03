let galleryContainer = document.querySelector(".gallery-container");

let req = indexedDB.open("gallery", 1);
let database;

req.addEventListener("success", () => {
    database = req.result;
})

req.addEventListener("upgradeneeded", () => {
    database = req.result;
    database.createObjectStore("media", { keyPath: "mId" });
})

req.addEventListener("error", () => {
    console.log("Error occured");
})

let saveMedia = (media) => {

    if (!database) return;

    let data = {
        mId: Date.now(),
        mediaData: media,
    }

    let tx = database.transaction("media", "readwrite");
    let mediaObjectStore = tx.objectStore("media");
    mediaObjectStore.add(data);
}

let viewMedia = () => {
    if (!database) return;

    let tx = database.transaction("media", "readonly");
    let mediaObjectStore = tx.objectStore("media");
    let req = mediaObjectStore.openCursor();

    req.addEventListener("success", () => {
        cursor = req.result;

        if (cursor) {
            let mediaCard = document.createElement("div")
            mediaCard.classList.add("media-card");
            mediaCard.innerHTML = `<div class="actual-media"></div>
                                    <div class="media-buttons">
                                        <div class="download material-icons">file_download</div>
                                        <div class="delete material-icons">delete</div>
                                    </div>`;

            let data = cursor.value.mediaData;

            let actualMedia = mediaCard.querySelector(".actual-media");
            let downloadBtn = mediaCard.querySelector(".download");
            let deleteBtn = mediaCard.querySelector(".delete");

            let type = typeof data;

            if (type == "string") {

                let img = document.createElement("img");
                img.src = data;

                // downloadBtn.addEventListener("click", () => {

                // })

                actualMedia.append(img);
            } else if (type == "object") {
                let video = document.createElement("video");
                let url = URL.createObjectURL(data);
                video.src = url;

                video.autoplay = true;
                video.controls = true;
                video.loop = true;
                video.muted = true;

                actualMedia.append(video);
            }
            galleryContainer.append(mediaCard);
            cursor.continue();
        }
    })
}