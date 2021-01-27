import os
import re

class ResourceInfo:
    def __init__(self, language, res_id, book, chapter, verse, take):
        self.language = language
        self.resource_id = res_id
        self.book = book
        self.chapter = int(chapter)
        self.verse = int(verse)
        self.take = take

    @staticmethod
    def parse_file_name(name):
        pattern = r"^(\w){2,}_(\w){2,}_(\w){3}_c(\d){1,3}_v(\d){1,3}_t(\d){1,3}.wav$"
        if re.match(pattern, name):
            filename, file_extension = os.path.splitext(name)
            tokens = filename.split('_')
            resource_info = ResourceInfo(
                language=tokens[0], 
                res_id=tokens[1], 
                book=tokens[2], 
                chapter=tokens[3][1:], 
                verse=tokens[4][1:], 
                take=tokens[5][1:]
            )
            return resource_info
        else:
            return None
