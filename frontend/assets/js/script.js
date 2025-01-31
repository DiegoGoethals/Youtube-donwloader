"use strict";

let _url = "";
const _baseUrl = "http://localhost:5000/";

init();

function init() {
    const urlInput = document.getElementById('video_url');
    urlInput.addEventListener('input', function() {
        const url = urlInput.value;
        if (url) {
            document.getElementById('download_button').removeAttribute('disabled');
        } else {
            document.getElementById('download_button').setAttribute('disabled', 'disabled');
        }
        _url = url;
    });

    const form = document.getElementById('download');
    const downloadButton = document.getElementById('download_button');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        downloadButton.setAttribute('disabled', 'disabled');
        downloadButton.innerHTML = "Preparing download...";
        processVideo(_url);
    });

    const dialogButton = document.getElementById('dialog_button');
    dialogButton.addEventListener('click', function() {
        downloadVideo(_url);
    });

    const closeButton = document.getElementById('close_button');
    closeButton.addEventListener('click', function() {
        closeDialog();
    });
}

function processVideo(url) {
    console.log(url);

    fetch(`${_baseUrl}process`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "video_url": url })
        }
    )
        .then(response => response.json())
        .then(data => {
            _url = data["file_path"];
            console.log(data);
            openDialog();
        });
}

function downloadVideo(url) {
    const encodedUrl = encodeURIComponent(url);

    fetch(`${_baseUrl}download?file=${encodedUrl}`)
        .then(response => {
            if (!response.ok) throw new Error("Download failed");
            return response.blob();
        })
        .then(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = url.split("/").pop();
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error("Error downloading file:", error));
}


function openDialog() {
    const dialog = document.getElementById('download_dialog');
    dialog.showModal();
}

function closeDialog() {
    const dialog = document.getElementById('download_dialog');
    dialog.close();
}