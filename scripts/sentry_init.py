# Bootstrap the Sentry environment
from sentry.utils.runner import configure

configure()

import os

from sentry import options
options.set('system.url-prefix', 'http://sentry:9000')
options.set('system.admin-email', 'admin@localhost')
options.set('auth.allow-registration', True)
options.set('beacon.anonymous', True)

from django.conf import settings

from sentry.models import (
    Team, Project, ProjectKey, User, Organization, OrganizationMember,
    OrganizationMemberTeam
)

organization = Organization.objects.first()
if not organization:
    organization = Organization()
    organization.name = 'Sentry'
    organization.save()

team = Team.objects.first()
if not team:
    team = Team()
    team.name = 'Sentry'
    team.organization = organization
    team.save()

django_project = Project.objects.filter(name='Django').first()
if not django_project:
    django_project = Project()
    django_project.team = team

    django_project.name = 'Django'
    django_project.organization = organization
    django_project.save()

    django_project.add_team(team)
    django_project.save()

react_project = Project.objects.filter(name='React').first()
if not react_project:
    react_project = Project()
    react_project.team = team

    react_project.name = 'React'
    react_project.organization = organization
    react_project.save()

    react_project.add_team(team)
    react_project.save()

user = User.objects.filter(username='admin').first()
if not user:
    user = User()
    user.username = 'admin'
    user.email = 'admin@localhost'
    user.is_superuser = True
    user.set_password('admin')
    user.save()

    member = OrganizationMember.objects.create(
        organization=organization,
        user=user,
        role='owner',
    )

    OrganizationMemberTeam.objects.create(
        organizationmember=member,
        team=team,
    )

django_key = ProjectKey.objects.filter(project=django_project).first()
react_key = ProjectKey.objects.filter(project=react_project).first()
print('------------------------------------')

print('DJANGO_SENTRY_DSN = "%s"' % (django_key.get_dsn(),))
print('REACT_SENTRY_DSN = "%s"' % (react_key.get_dsn(),))

with open("/dsn/DJANGO_SENTRY_DSN", "w") as django_file:
    django_file.write(django_key.get_dsn())

with open("/dsn/REACT_SENTRY_DSN", "w") as react_file:
    react_file.write(react_key.get_dsn())
