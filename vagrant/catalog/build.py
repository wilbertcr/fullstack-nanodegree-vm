from pybuilder.core import use_plugin, init
import string
from pybuilder.plugins.python import distutils_plugin

SDIST_MONKEY_PATCH = """
# sdist_hack: Remove reference to os.link to disable using hardlinks when
#             building setup.py's sdist target.  This is done because
#             VirtualBox VMs shared filesystems don't support hardlinks.
import os
del os.link
"""

use_plugin("python.core")
use_plugin("python.install_dependencies")
use_plugin("python.unittest")
use_plugin("python.coverage")
use_plugin("python.flake8")
use_plugin("python.distutils")
use_plugin("source_distribution")
name = "Catalog App"
default_task = ['publish']

@init
def set_properties(project):

    # This is a hack I found on the internet so Pybuild would work on virtualbox's shared folder.
    # Monkey patch distutils_plugin's SETUP_TEMPLATE to disable hardlinks.
    #
    setup_template_array = distutils_plugin.SETUP_TEMPLATE.template.split('\n')
    setup_template_array.insert(1, SDIST_MONKEY_PATCH)
    distutils_plugin.SETUP_TEMPLATE = string.Template(
        '\n'.join(setup_template_array)
    )
    project.build_depends_on("mockito")
    project.build_depends_on("flake8")
    project.build_depends_on("xmlrunner")
    project.build_depends_on("coverage")
    project.depends_on("bleach")
    project.depends_on("oauth2client")
    project.depends_on("requests")
    project.depends_on("httplib2")
    project.depends_on("redis")
    project.depends_on("passlib")
    project.depends_on("itsdangerous")
    project.depends_on("flask-httpauth")
    project.depends_on("flask-autodoc")
    project.depends_on("flask")
    project.depends_on("SQLAlchemy")
    project.depends_on("werkzeug")
    project.set_property("dir_dist", "target/dist/")
    project.set_property("source_dist_ignore_patterns", ["*.pyc", "*.js"])
    project.set_property('flake8_verbose_output', True)
    project.set_property("dir_source_main_python", "src/backend/python/")
    project.set_property("dir_source_unittest_python", "src/unittest/python/")
    project.set_property("dir_source_main_scripts", "src/backend/scripts/")
    project.set_property("author", "Wilbert Sequeira")
    project.set_property("author_email", "wilbertcr@gmail.com")
