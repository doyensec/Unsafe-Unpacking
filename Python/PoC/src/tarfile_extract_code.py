import tarfile

def untar1(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        # ruleid: tarfile_unsafe_unpacking
        tf.extractall(output)

def untar2(file_name):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():
            # ruleid: tarfile_unsafe_unpacking
            tf.extract(member) 

tar_file_path = "../payloads/payload.tar"
destination_folder = '../src/'

untar1(tar_file_path, destination_folder)