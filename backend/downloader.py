import yt_dlp, os, tempfile

def download_video(video_url: str):
    temp_dir = tempfile.gettempdir()

    ydl_opts = {
        "format": "best",
        "outtmpl": os.path.join(temp_dir, "%(title)s.%(ext)s"),
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            file_path = ydl.prepare_filename(info)
            return (info, file_path)
        print("Download completed!")
    except Exception as e:
        print(f"An error occurred: {e}")
