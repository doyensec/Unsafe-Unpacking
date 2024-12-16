import tarfile
import os

def unpack_tar_gz(file_name, output_dir):
    # good
    with tarfile.open(file_name, 'r:gz') as tar:
        for member in tar.getmembers():
            member_path = os.path.normpath(os.path.join(output_dir, member.name))
            if not member_path.startswith(os.path.abspath(output_dir)):
                raise ValueError(f"Invalid path: {member.name}")

            tar.extract(member, path=output_dir)


def unpack_tar_gz2(file_name, output_dir):
    def filter_func(member):
        member_path = os.path.join(output_dir, member.name)
        # Check for path traversal
        if not member_path.startswith(os.path.abspath(output_dir)):
            raise ValueError(f"Invalid path: {member.name}")
        return True  # Allow all files to be extracted

    with tarfile.open(file_name, 'r:gz') as tar:
        for member in tar.getmembers():
            # Apply the filter function
            if filter_func(member):
                tar.extract(member, path=output_dir)

unpack_tar_gz2("../payloads/payload.tar.gz", "../src/")