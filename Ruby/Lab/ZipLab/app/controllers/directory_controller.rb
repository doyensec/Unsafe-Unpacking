class DirectoryController < ApplicationController
    def directory()
        current_txt_files = Dir.entries("../").select { |f| f.end_with?('.txt') }
        archive_txt_files = Dir.entries("../archive/").select { |f| f.end_with?('.txt') }
        render json: { "current_txt_files": current_txt_files, "archive_txt_files": archive_txt_files }
    end

    def clear_directory()
        current_txt_files = Dir.entries("../").select { |f| f.end_with?('.txt') }
        archive_txt_files = Dir.entries("../archive/").select { |f| f.end_with?('.txt') }

        current_txt_files.each do |file|
            File.delete(File.join("../", file))
        end

        archive_txt_files.each do |file|
            File.delete(File.join("../archive/", file))
        end

        render json: {"message": "All TXT files cleared from the current and archive directories."}
    end
end
