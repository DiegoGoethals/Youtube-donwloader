from flask import Flask, request, jsonify
from downloader import download_video

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/download', methods=['POST'])
def download():
    data = request.get_json()

    if not data or 'video_url' not in data:
        return jsonify({'error': 'Missing video_url'}), 400

    video_url = data['video_url']

    try:
        download_video(video_url)
        return jsonify({'message': 'Download completed!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
