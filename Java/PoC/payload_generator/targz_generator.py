import tarfile
import io
 
def create_tar_gz_archive(output_tar_gz_file, file_name, content):
    with tarfile.open(output_tar_gz_file, 'w:gz') as tar:
        # Create an in-memory file-like object with the specified content
        file_like_object = io.BytesIO(content.encode('utf-8'))
 
        # Create a TarInfo object for the file we're adding
        tarinfo = tarfile.TarInfo(name=file_name)
        tarinfo.size = len(content)
 
        # Add the file to the tar archive
        tar.addfile(tarinfo, file_like_object)
 
# Example usage:
create_tar_gz_archive('../payloads/payload.tar.gz', '../poc.txt', 'PoC')