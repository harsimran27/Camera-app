let galleryContainer = document.querySelector(".gallery-container");

let req = indexedDB.open("gallery", 1);
let database;
let numberOfMedia = 0;

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
            numberOfMedia++;

            let mediaCard = document.createElement("div")
            mediaCard.classList.add("media-card");
            mediaCard.innerHTML = `<div class="actual-media"></div>
                                    <div class="media-buttons">
                                        <div class="download material-icons">file_download</div>
                                        <div data-mId = "${cursor.value.mId}" class="delete material-icons">delete</div>
                                    </div>`;

            let data = cursor.value.mediaData;

            let actualMedia = mediaCard.querySelector(".actual-media");
            let downloadBtn = mediaCard.querySelector(".download");
            let deleteBtn = mediaCard.querySelector(".delete");

            deleteBtn.addEventListener("click", (e) => {
                let mId = Number(e.currentTarget.getAttribute("data-mId"));
                deleteMedia(mId);

                e.currentTarget.parentElement.parentElement.remove();
            })

            let type = typeof data;

            if (type == "string") {

                let img = document.createElement("img");
                img.src = data;

                downloadBtn.addEventListener("click", () => {
                    downloadMedia(data, "img");
                })

                actualMedia.append(img);
            } else if (type == "object") {
                let video = document.createElement("video");
                let url = URL.createObjectURL(data);
                video.src = url;

                video.autoplay = true;
                video.controls = true;
                video.loop = true;
                video.muted = true;

                downloadBtn.addEventListener("click", () => {
                    downloadMedia(url, "video");
                })

                actualMedia.append(video);
            }
            galleryContainer.append(mediaCard);
            cursor.continue();
        } else {
            if (numberOfMedia == 0) {
                galleryContainer.innerText = "No media present";
            }
        }
    })
}

let downloadMedia = (url, type) => {

    let anchorTag = document.createElement("a");
    anchorTag.href = url;

    if (type == "image") {
        anchorTag.download = "image.png";
    } else {
        anchorTag.download = "video.mp4";
    }

    anchorTag.click();
    anchorTag.remove();
}

let deleteMedia = (mId) => {
    let tx = database.transaction("media", "readwrite");
    let mediaObjectStore = tx.objectStore("media");
    mediaObjectStore.delete(mId);
}