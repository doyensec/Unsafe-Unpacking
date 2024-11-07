import shutil
import os

def unpack_zip(file_name, output_dir):
    # good
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    shutil.unpack_archive(file_name, extract_dir=output_dir, format='zip')

def unpack_tar(file_name, output_dir):
    # bad
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    shutil.unpack_archive(file_name, extract_dir=output_dir, format='tar')

def unpack_tar_gz(file_name, output_dir):
    # bad
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    shutil.unpack_archive(file_name, extract_dir=output_dir, format='gztar')