import json
from api.models import Book

class MetadataTag:
    def __init__(self, res_info):
        self.resource_info = res_info
        self.meta = {
            "anthology": "",
            "language": "",
            "version": "",
            "book": "",
            "book_number": "",
            "mode": "",
            "chapter": "",
            "startv": "",
            "endv": "",
            "contributor": "{}",
            "markers": {}
        }


    def get_json(self):
        book = Book.objects.get(slug=self.manifest["projects"][0]["identifier"])
        
        self.meta['anthology'] = book['anth']
        self.meta['language'] = self.resource_info.language
        self.meta['version'] = self.resource_info.resource_id
        self.meta['book'] =  self.resource_info.book
        self.meta['book_number'] = book['num']
        self.meta['mode'] =  "verse"
        self.meta['chapter'] =  self.resource_info.chapter
        self.meta['startv'] = self.resource_info.verse
        self.meta['endv'] = self.resource_info.verse
        self.meta['contributor'] = {}
        self.meta['markers'] = {
            self.resource_info.verse: 0
        }

        return json.dumps(self.meta)