from flask import Flask, render_template, jsonify, request
from methods import *
import os

app = Flask(__name__)

current_dir = os.getcwd()
archive_dir = os.path.join(current_dir, 'archive')
payloads_dir = os.path.join(current_dir, 'payloads')
uploads_dir = os.path.join(current_dir, 'uploads')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/run_unsafe_shutil')
def unsafe_shutil():
    unpack_tar(os.path.join(payloads_dir, "payload.tar"), archive_dir)
    response_data = {"message": "unpacked"}
    return jsonify(response_data)

@app.route('/upload_1', methods=['POST'])
def upload_unsafe_shutil():
    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    file_path = os.path.join(uploads_dir, file.filename)
    file.save(file_path)

    try:
        unpack_tar(os.path.join(uploads_dir, file.filename), archive_dir)
        os.remove(os.path.join(uploads_dir, file.filename))

        return jsonify({"message": "unpacked"})

    except Exception as e:
        return jsonify({'message': f'Error unpacking the tar file: {str(e)}'}), 500

@app.route('/source_1')
def source1():
    code = """def unpack_tar(file_name, output_dir):
    # bad
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    shutil.unpack_archive(file_name, extract_dir=output_dir, format='tar')"""
    return jsonify({"code": code})

@app.route('/run_safe_shutil')
def safe_shutil():
    unpack_zip(os.path.join(payloads_dir, "payload.zip"), archive_dir)
    response_data = {"message": "unpacked"}
    return jsonify(response_data)

@app.route('/upload_2', methods=['POST'])
def upload_safe_shutil():
    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    file_path = os.path.join(uploads_dir, file.filename)
    file.save(file_path)

    try:
        unpack_zip(os.path.join(uploads_dir, file.filename), archive_dir)
        os.remove(os.path.join(uploads_dir, file.filename))

        return jsonify({"message": "unpacked"})

    except Exception as e:
        return jsonify({'message': f'Error unpacking the zip file: {str(e)}'}), 500

@app.route('/source_2')
def source2():
    code = """def unpack_zip(file_name, output_dir):
    # good
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    shutil.unpack_archive(file_name, extract_dir=output_dir, format='zip')"""
    return jsonify({"code": code})

@app.route('/run_unsafe_tar')
def unsafe_tar():
    untar_extractall(os.path.join(payloads_dir, "payload.tar"), archive_dir)
    response_data = {"message": "unpacked"}
    return jsonify(response_data)

@app.route('/upload_3', methods=['POST'])
def upload_unsafe_tar():
    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    file_path = os.path.join(uploads_dir, file.filename)
    file.save(file_path)

    try:
        untar_extractall(os.path.join(uploads_dir, file.filename), archive_dir)
        os.remove(os.path.join(uploads_dir, file.filename))

        return jsonify({"message": "unpacked"})

    except Exception as e:
        return jsonify({'message': f'Error unpacking the tar file: {str(e)}'}), 500

@app.route('/source_3')
def source3():
    code = """def untar_shutil(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():

            # Output
            output_path = os.path.join(output, member.name)
            with tf.extractfile(member) as source_file:
                with open(output_path, 'wb') as dest_file:
                    shutil.copyfileobj(source_file, dest_file)
    
                    
def untar_extractall(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        os.makedirs(output, exist_ok=True)
        tf.extractall(path=output)"""
    return jsonify({"code": code})

@app.route('/run_safe_tar')
def safe_tar():
    untar_safe(os.path.join(payloads_dir, "payload.tar"), archive_dir)
    response_data = {"message": "unpacked"}
    return jsonify(response_data)

@app.route('/upload_4', methods=['POST'])
def upload_safe_tar():
    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    file_path = os.path.join(uploads_dir, file.filename)
    file.save(file_path)

    try:
        untar_safe(os.path.join(uploads_dir, file.filename), archive_dir)
        os.remove(os.path.join(uploads_dir, file.filename))

        return jsonify({"message": "unpacked"})

    except Exception as e:
        return jsonify({'message': f'Error unpacking the tar file: {str(e)}'}), 500

@app.route('/source_4')
def source4():
    code = """def untar_safe(file_name, output):
    # good
    with tarfile.open(file_name, 'r') as tf:
        members = tf.getmembers()
        
        for x in members:
            output_path = os.path.join(output, os.path.basename(x.name))
            with tf.extract(x) as source_file:
                with open(output_path, 'wb') as target_file:
                    shutil.copyfileobj(source_file, target_file)"""
    return jsonify({"code": code})

@app.route('/run_unsafe_zip')
def unsafe_zip():
    unsafe_unzip(os.path.join(payloads_dir, "payload.zip"), archive_dir)
    response_data = {"message": "unpacked"}
    return jsonify(response_data)

@app.route('/upload_5', methods=['POST'])
def upload_unsafe_zip():
    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    file_path = os.path.join(uploads_dir, file.filename)
    file.save(file_path)

    try:
        unsafe_unzip(os.path.join(uploads_dir, file.filename), archive_dir)
        os.remove(os.path.join(uploads_dir, file.filename))

        return jsonify({"message": "unpacked"})

    except Exception as e:
        return jsonify({'message': f'Error unpacking the zip file: {str(e)}'}), 500

@app.route('/source_5')
def source5():
    code = """def unsafe_unzip(file_name, output):
    # bad
    with zipfile.ZipFile(file_name, 'r') as zf:
        for filename in zf.namelist():
            output_path = os.path.join(output, filename)
            with zf.open(filename) as source, open(output_path, 'wb') as destination:
                shutil.copyfileobj(source, destination)"""
    return jsonify({"code": code})

@app.route('/run_safe_zip')
def safe_zip():
    safe_unzip(os.path.join(payloads_dir, "payload.zip"), archive_dir)
    response_data = {"message": "unpacked"}
    return jsonify(response_data)

@app.route('/upload_6', methods=['POST'])
def upload_safe_zip():
    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    file_path = os.path.join(uploads_dir, file.filename)
    file.save(file_path)

    try:
        safe_unzip(os.path.join(uploads_dir, file.filename), archive_dir)
        os.remove(os.path.join(uploads_dir, file.filename))

        return jsonify({"message": "unpacked"})

    except Exception as e:
        return jsonify({'message': f'Error unpacking the zip file: {str(e)}'}), 500

@app.route('/source_6')
def source6():
    code = """def safe_unzip(file_name, output):
    # good
    with zipfile.ZipFile('file.zip', 'r') as zip_ref:
        zip_ref.extractall()"""
    return jsonify({"code": code})

@app.route('/directory')
def directory():

    current_txt_files = [f for f in os.listdir(current_dir) if f.endswith('.txt')]

    if os.path.exists(archive_dir):
        archive_txt_files = [f for f in os.listdir(archive_dir) if f.endswith('.txt')]
    else:
        archive_txt_files = []

    return jsonify({
        "current_txt_files": current_txt_files,
        "archive_txt_files": archive_txt_files
    })


@app.route('/clear_directory')
def clear_directory():
    current_dir = os.getcwd() 
    archive_dir = os.path.join(current_dir, 'archive')  
    
    current_txt_files = [f for f in os.listdir(current_dir) if f.endswith('.txt')]
    for file in current_txt_files:
        os.remove(os.path.join(current_dir, file))  # Remove the file

    if os.path.exists(archive_dir):
        archive_txt_files = [f for f in os.listdir(archive_dir) if f.endswith('.txt')]
        for file in archive_txt_files:
            os.remove(os.path.join(archive_dir, file))  # Remove the file

    return jsonify({"message": "All TXT files cleared from the current and archive directories."})

if __name__ == '__main__':
    app.run(debug=True, port=1337)
