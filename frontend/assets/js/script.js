"use strict";

const _baseUrl = "http://localhost:5000/";

init();

function init() {
    const downloadButton = document.getElementById('download_button');

    const form = document.getElementById('download');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        downloadButton.setAttribute('disabled', 'disabled');
        downloadButton.innerHTML = "Downloading...";
        processVideo();
    });
}

function getPageUrl() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                resolve(tabs[0].url);
            } else {
                reject("No active tab found");
            }
        });
    });
}

async function processVideo() {
    try {
        const pageUrl = await getPageUrl();
        console.log("Current URL:", pageUrl);
        const response = await fetch(`${_baseUrl}process`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "video_url": pageUrl })
            }
        );
        const data = await response.json();
        downloadVideo(data.file_path, data.filename);
    } catch (error) {
        console.error("Error getting URL:", error);
    }
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