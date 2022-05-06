from django.contrib.contenttypes.fields import GenericRelation
from django.db import models


class Chapter(models.Model):
    number = models.IntegerField(default=0)
    checked_level = models.IntegerField(default=0)
    published = models.BooleanField(default=False)
    project = models.ForeignKey(
        "Project",
        on_delete=models.CASCADE,
        related_name="chapters"
    )
    comments = GenericRelation("Comment", related_query_name="comments")

    class Meta:
        ordering = ["number"]

    def __str__(self):
        return '{}'.format(self.number)

    @property
    def date_modified(self):
        # take = Take.objects.filter(project=self.project) \
        #     .order_by('date_modified') \
        #     .first()
        # if take is not None:
        #     return take.date_modified
        # else:
        return 0

    @property
    def contributors(self):
        return ""

    @property
    def has_comment(self):
        return Chapter.objects.filter(comments__object_id=self.id).exists()

    @property
    def has_takes(self):
        takes_count = 0
        for chunk in self.chunks.all():
            takes_count += chunk.takes.count()

        return takes_count > 0

    @property
    def completed(self):
        try:
            return int(round((self.published_chunks / self.total_chunks) * 100))
        except ZeroDivisionError:
            return 0

    @property
    def total_chunks(self):
        return self.chunks.count()

    @property
    def uploaded_chunks(self):
        return self.get_uploaded_chunks()

    @property
    def published_chunks(self):
        count = 0
        for chunk in self.chunks.all():
            if chunk.published_take is not None:
                count += 1
        return count

    def get_uploaded_chunks(self):
        count = 0
        for chunk in self.chunks.all():
            if chunk.has_takes:
                count += 1
        return count

    @staticmethod
    def import_chapter(project, number, checked_level):
        # Create Chapter in database if it's not there
        chapter_obj, cr_created = Chapter.objects.get_or_create(
            project=project,
            number=number,
            defaults={
                'number': number,
                'checked_level': checked_level,
                'project': project
            }
        )

        return chapter_obj
