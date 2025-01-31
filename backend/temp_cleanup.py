import os
import time
import tempfile

def cleanup_temp_files():
    temp_dir = tempfile.gettempdir()
    age_threshold = 86400  # 24 hours in seconds
    current_time = time.time()

    for filename in os.listdir(temp_dir):
        file_path = os.path.join(temp_dir, filename)
        
        if not os.path.isfile(file_path):
            continue

        file_creation_time = os.path.getctime(file_path)

        if current_time - file_creation_time > age_threshold:
            try:
                os.remove(file_path)
                print(f"Deleted: {file_path}")
            except Exception as e:
                print(f"Error deleting {file_path}: {e}")
