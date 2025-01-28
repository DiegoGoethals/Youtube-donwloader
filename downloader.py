import yt_dlp, os

download_folder = os.path.expanduser("~/Downloads")

video_url = input("Enter the video URL: ")

ydl_opts = {
    "format": "best",
    "outtmpl": f"{download_folder}/%(title)s.%(ext)s",
}

try:
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
    print("Download completed!")
except Exception as e:
    print(f"An error occurred: {e}")