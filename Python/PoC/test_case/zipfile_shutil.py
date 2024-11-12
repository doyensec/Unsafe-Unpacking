import zipfile
import shutil
import os

def unzip1(file_name, output):
    # bad
    with zipfile.ZipFile(file_name, 'r') as zf:
        for filename in zf.namelist():

            output_path = os.path.join(output, filename)
            with zf.open(filename) as source:
                with open(output_path, 'wb') as destination:
                    shutil.copyfileobj(source, destination)

def unzip2(file_name, output):
    # bad
    zf = zipfile.ZipFile(file_name, 'r')
    for filename in zf.namelist():

        with zf.open(filename) as source, open(filename, 'wb') as destination:
            shutil.copyfileobj(source, destination)

def unzip3(file_name, output):
    # bad
    with zipfile.ZipFile(file_name, 'r') as zf:
        for filename in zf.namelist():

            output_path = os.path.join(output, filename)
            source = zf.open(filename)
            destination = open(output_path, 'wb')
            shutil.copyfileobj(source, destination)


def unzip4(file_name, output):
    # bad
    zf = zipfile.ZipFile(file_name, 'r')
    for filename in zf.namelist():
            
        source = zf.open(filename)
        destination = open(filename, 'wb')
        shutil.copyfileobj(source, destination)

def unzip5(file_name, output):
    # bad: weird case
    with zipfile.ZipFile(file_name, 'r') as zf:
        [shutil.copyfileobj(zf.open(filename), open(os.path.join(output, filename), 'wb')) for filename in zf.namelist()]

def unzip6(file_name, output):
    # bad
    with zipfile.ZipFile(file_name, 'r') as zf:
        filelist = zf.namelist()
        
        for x in filelist:
            output_path = os.path.join(output, x)
            with zf.open(x) as source_file:
                with open(output_path, 'wb') as target_file:
                    shutil.copyfileobj(source_file, target_file)

def unzip7(file_name, output):
    # good
    with zipfile.ZipFile(file_name, 'r') as zf:
        filelist = zf.namelist()
        
        for x in filelist:
            output_path = os.path.join(output, os.path.basename(x))
            with zf.open(x) as source_file:
                with open(output_path, 'wb') as target_file:
                    shutil.copyfileobj(source_file, target_file)

def unzip8(file_name, output):
    # good
    with zipfile.ZipFile(file_name, 'r') as zf:
        all_files = zf.namelist()
        for file in all_files:
            zf.extract(file, output)

def unzip9(file_name, output):
    # good
    with zipfile.ZipFile(file_name, 'r') as zf:
            zf.extractall(output)


unzip1("/Users/michael/Doyensec/Research/Unsafe-Unpacking/Python/PoC/payloads/payload.zip", "/Users/michael/Doyensec/Research/Unsafe-Unpacking/Python/PoC/test_case")