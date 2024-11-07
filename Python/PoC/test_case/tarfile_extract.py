import tarfile

def untar1(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        tf.extractall(output)

def untar2(file_name, output):
    # bad
    with tarfile.open(file_name, 'r') as tf:
        for member in tf.getmembers():
            tf.extract(member) 


untar2("/Users/michael/Doyensec/Research/SemgrepSlip/Python/PoC/payloads/payload.tar", "/Users/michael/Doyensec/Research/SemgrepSlip/Python/PoC/test_case")