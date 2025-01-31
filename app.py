from flask import Flask, request, jsonify, send_file
from apscheduler.schedulers.background import BackgroundScheduler
from downloader import download_video
from temp_cleanup import cleanup_temp_files
import os

app = Flask(__name__)

cleanup_temp_files()  # Clean up any existing temp files on startup

scheduler = BackgroundScheduler()
scheduler.add_job(func=cleanup_temp_files, trigger="interval", days=1)
scheduler.start()

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route("/process", methods=["POST"])
def process_video():
    data = request.json
    video_url = data.get("video_url")
    
    if not video_url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        (info, file_path) = download_video(video_url)
        return jsonify({"message": "Processing complete!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500    

@app.route("/download", methods=["GET"])
def download():
    file_path = request.args.get("file")

    if file_path:
        file_path = file_path.strip('"')

    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "File not found!"}), 404

    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
