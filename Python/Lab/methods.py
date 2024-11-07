import shutil
import zipfile
import tarfile
import os

def unpack_tar(file_name, output_dir):
    # bad
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    shutil.unpack_archive(file_name, extract_dir=output_dir, format='tar')

def unpack_zip(file_name, output_dir):
    # good
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    shutil.unpack_archive(file_name, extract_dir=output_dir, format='zip')

def untar_extractall(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        os.makedirs(output, exist_ok=True)
        tf.extractall(path=output)

def untar_safe(file_name, output):
    # good

    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():
            output_path = os.path.join(output, os.path.basename(member.name))

            with tf.extractfile(member) as source_file:
                with open(output_path, 'wb') as target_file:
                    shutil.copyfileobj(source_file, target_file)

def unsafe_unzip(file_name, output):
    # bad
    with zipfile.ZipFile(file_name, 'r') as zf:
        for filename in zf.namelist():
            output_path = os.path.join(output, filename)
            with zf.open(filename) as source, open(output_path, 'wb') as destination:
                shutil.copyfileobj(source, destination)

def safe_unzip(file_name):
    # good
    with zipfile.ZipFile(file_name, 'r') as zip_ref:
        zip_ref.extractall()