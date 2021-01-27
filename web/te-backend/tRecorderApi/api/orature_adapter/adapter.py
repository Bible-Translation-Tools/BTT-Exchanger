import os
import json
import re
from pydub import AudioSegment
from .yaml_reader import OratureYamlConverter
from .file_name_parser import ResourceInfo, MetadataTag


class OratureFileAdapter:
    FILE_NAME_PATTERN = r"^(\w){2,}_(\w){2,}_(\w){3}_c(\d){1,3}_v(\d){1,3}_t(\d){1,3}.wav$"

    def __init__(self, directory):
        self._root = directory
        self.SELECTED_TAKES_MAPPER = "selected.txt"

    def _add_zero_padding(self, file_name):
        if re.match(OratureFileAdapter.FILE_NAME_PATTERN, file_name):
            filename, file_extension = os.path.splitext(file_name)
            tokens = filename.split('_')

            # format as two digits (0 padded for single-digit number)
            chapter = tokens[3][1:]
            tokens[3] = 'c{0:02d}'.format(int(chapter))

            verse = tokens[4][1:]
            tokens[4] = 'v{0:02d}'.format(int(verse))

            take = tokens[5][1:]
            tokens[5] = 't{0:02d}'.format(int(take))

            return '_'.join(tokens) + file_extension
        else:
            return file_name

    def _format_selected_mapper(self, file_path):
        formatted_takes = []
        with open(file_path, 'r') as f:
            content = f.read()
            selected_takes = [os.path.basename(line)
                              for line in content.splitlines()]
            formatted_takes = [self._add_zero_padding(
                take) for take in selected_takes]

        with open(file_path, 'w') as f:
            f.write("\n".join(formatted_takes))

    def _format_takes_name(self, directory):

        for base_dir, dirs, files in os.walk(directory):
            for f in files:
                absolute_path = os.path.join(base_dir, f)
                if f == self.SELECTED_TAKES_MAPPER:
                    # add zero padding to selected.txt
                    self._format_selected_mapper(absolute_path)
                    continue
                # add zero padding to take files
                formatted = os.path.join(base_dir, self._add_zero_padding(f))
                os.rename(absolute_path, formatted)

    def _parse_selected_mapper(self):
        for base_dir, dirs, files in os.walk(self._root):
            if self.SELECTED_TAKES_MAPPER in files:
                file_path = os.path.join(base_dir, self.SELECTED_TAKES_MAPPER)
                with open(file_path, 'r') as mapper:
                    return mapper.read()

    def _build_media_manifest(self, selected_takes=[]):
        manifest = []
        for base_dir, dirs, files in os.walk(self._root):
            for f in files:
                full_path = os.path.join(base_dir, f)

                if os.path.splitext(f)[1] == '.zip':
                    os.remove(full_path)
                    continue

                if not re.match(OratureFileAdapter.FILE_NAME_PATTERN, f):
                    continue

                info = ResourceInfo.parse_file_name(f)
                if info is not None:
                    # Add metadata
                    meta = MetadataTag(info).get_json()
                    audio = AudioSegment.from_wav(full_path)
                    audio.export(full_path, format='wav',
                                 tags={'artist': meta})

                    take_obj = {
                        "name": os.path.basename(f),
                        "location": "",
                        "rating": 0,
                        "published": f in selected_takes,
                        "user_id": None,
                        "comments": []
                    }

                    existingChapters = [
                        ch for ch in manifest if ch['chapter'] == info.chapter]
                    if any(existingChapters):
                        existingChunks = [
                            chk for chk in existingChapters[0]['chunks'] if chk['startv'] == info.verse]
                        if any(existingChunks):
                            existingChunks[0]['takes'].append(take_obj)
                        else:
                            chunk_obj = {
                                "startv": info.verse,
                                "endv": info.verse,
                                "comments": [],
                                "takes": [take_obj]
                            }
                            existingChapters[0]['chunks'].append(chunk_obj)
                    else:
                        chunk_obj = {
                            "startv": info.verse,
                            "endv": info.verse,
                            "comments": [],
                            "takes": [take_obj]
                        }

                        chapter_obj = {
                            "chapter": info.chapter,
                            "checking_level": 0,
                            "published": False,
                            "comments": [],
                            "chunks": [chunk_obj]
                        }
                        manifest.append(chapter_obj)

        return manifest

    def process(self):
        self._format_takes_name(self._root)

        selected_mapper = self._parse_selected_mapper()
        selected_takes = [os.path.basename(line)
                          for line in selected_mapper.splitlines()]

        manifest = {}
        with open(os.path.join(self._root, 'manifest.yaml'), 'r') as yaml_file:
            manifest = OratureYamlConverter(yaml_file).get_content()

        manifest["users"] = []
        manifest["manifest"] = self._build_media_manifest(selected_takes)

        with open(os.path.join(self._root, 'manifest.json'), 'w') as manifest_json:
            json.dump(manifest, manifest_json)

        print(json.dumps(manifest))
