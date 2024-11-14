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
                    shutil.copyfileobj(source_file, dest_file)

def untar2(file_name, output):
    # bad
    tf = tarfile.open(file_name)
    for member in tf.getmembers():

        with tf.extractfile(member) as source, open(member.name, 'wb') as destination:
            shutil.copyfileobj(source, destination)

def untar3(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():

            # Output
            output_path = os.path.join(output, member.name)
            source = tf.extractfile(member)
            destination = open(output_path, 'wb')
            shutil.copyfileobj(source, destination)


def untar4(file_name, output):
    # bad
    tf = tarfile.open(file_name, 'r')
    for member in tf.getmembers():
            
        source = tf.extractfile(member)
        destination = open(member.name, 'wb')
        shutil.copyfileobj(source, destination)


def unitar5(file_name, output):
    # bad: weird case
    with tarfile.open(file_name, 'r') as tf:
        [shutil.copyfileobj(tf.extractfile(member), open(os.path.join(output, member.name), 'wb')) for member in tf.getmembers()]

def untar6(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        members = tf.getmembers()
        
        for x in members:
            output_path = os.path.join(output, x.name)
            with tf.extract(x) as source_file:
                with open(output_path, 'wb') as target_file:
                    shutil.copyfileobj(source_file, target_file)

def untar7(file_name, output):
    # good
    with tarfile.open(file_name, 'r') as tf:
        members = tf.getmembers()
        
        for x in members:
            output_path = os.path.join(output, os.path.basename(x.name))
            with tf.extract(x) as source_file:
                with open(output_path, 'wb') as target_file:
                    shutil.copyfileobj(source_file, target_file)

def untar8(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        os.makedirs(output, exist_ok=True)
        tf.extractall(path=output)