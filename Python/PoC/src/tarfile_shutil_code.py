import tarfile
import shutil
import os

def untar1(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():

            # Output
            output_path = os.path.join(output, member.name)
            with tf.extractfile(member) as source_file:
                with open(output_path, 'wb') as dest_file:
                    # ruleid: tar_shutil_unsafe_unpacking
                    shutil.copyfileobj(source_file, dest_file)

def untar2(file_name, output):
    # bad
    tf = tarfile.open(file_name)
    for member in tf.getmembers():

        with tf.extractfile(member) as source, open(member.name, 'wb') as destination:
            # ruleid: tar_shutil_unsafe_unpacking
            shutil.copyfileobj(source, destination)

def untar3(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():

            # Output
            output_path = os.path.join(output, member.name)
            source = tf.extractfile(member)
            destination = open(output_path, 'wb')
            # ruleid: tar_shutil_unsafe_unpacking
            shutil.copyfileobj(source, destination)


def untar4(file_name, output):
    # bad
    tf = tarfile.open(file_name, 'r')
    for member in tf.getmembers():
            
        source = tf.extractfile(member)
        destination = open(member.name, 'wb')
        # ruleid: tar_shutil_unsafe_unpacking
        shutil.copyfileobj(source, destination)


def unitar5(file_name, output):
    # bad: weird case
    with tarfile.open(file_name, 'r') as tf:
        [shutil.copyfileobj(tf.extractfile(member), open(os.path.join(output, member.name), 'wb')) for member in tf.getmembers()]


tar_file_path = "../payloads/payload.tar"
destination_folder = '../src/'

untar1(tar_file_path, destination_folder)