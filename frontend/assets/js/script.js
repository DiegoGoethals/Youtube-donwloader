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
        downloadButton.innerHTML = "Downloading...";
        processVideo(_url);
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
            const filename = data.filename;
            downloadVideo(data.file_path, filename);
        });
}

function downloadVideo(url, filename) {
    const encodedUrl = encodeURIComponent(url);

    fetch(`${_baseUrl}download?file=${encodedUrl}`)
        .then(response => {
            if (!response.ok) throw new Error("Download failed");
            return response.blob();
        })
        .then(blob => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => console.error("Error downloading file:", error));
}