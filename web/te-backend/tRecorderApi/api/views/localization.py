from rest_framework import views
from rest_framework.parsers import JSONParser, FileUploadParser, MultiPartParser
from rest_framework.response import Response
from api.file_transfer.FileUtility import FileUtility
from django.core.files.storage import FileSystemStorage
import logging
import json
import time
import uuid

logger = logging.getLogger(__name__)


class LocalizationView(views.APIView):
    parser_classes = (JSONParser, MultiPartParser,)

    def get(self, request):
        lang = request.query_params.get("lang")
        if lang is None:
            lang = "en"
        json_data = FileUtility.open_localization_file(lang)

        Response(json_data, status=200)

    def post(self, request, filename):
        lang_code = request.data["langCode"] if request.data["langCode"] else None
        lang_name = request.data["langName"] if request.data["langName"] else None
        file = request.data["file"] if request.data["file"] else None

        response = {"success": False}

        if lang_code == 'en':
            response["error"] = "not_allowed"
            return Response(response, status=400)

        if lang_code is not None and file is not None:
            fs = FileSystemStorage()
            uuid_name = str(time.time()) + str(uuid.uuid4())
            uploaded_file = fs.save("tmp/" + uuid_name, file)
            uploaded_file_url = fs.url(uploaded_file)

            try:
                with open(uploaded_file_url) as json_file:
                    translation = json.load(json_file)
                    localization = FileUtility.save_localization_file(lang_code, lang_name, translation)

                    response["success"] = True
                    response["localization"] = localization
                    return Response(response, status=200)
            except Exception as e:
                logger.error("Error: ", str(e))
                response["error"] = str(e)
        else:
            response["error"] = "invalid_params"

        return Response(response, status=400)
