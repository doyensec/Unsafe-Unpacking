import tarfile
import io
 
def compress_file(filename):
    # Create a TarFile object and compress it with gzip
    with tarfile.open('../payloads/payload.tar', 'w') as tarf:
        # Create an in-memory file-like object with the content "Test payload"
        data = io.BytesIO(b"Test payload")
 
        # Create a tarinfo object for the file we're adding
        tarinfo = tarfile.TarInfo(name=filename)
        tarinfo.size = len(data.getvalue())  # Set the size of the data
 
        # Add the file to the tar archive
        tarf.addfile(tarinfo, data)
 
filename = '../secret.txt'
compress_file(filename)