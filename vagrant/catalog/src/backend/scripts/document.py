#!/usr/bin/env python

import glob
import os
from subprocess import call
path = "../python/"

for filename in glob.glob(os.path.join(path, '*.py')):
    name = filename.rsplit('.', 1)[0]
    name = name.rsplit('/', 1)[1]
    print(name)
    if name != "__init__":
        call(["pydoc", "-w", name], cwd=r"../python/")
        call(["mv", name+".html", "../../../target/"], cwd=r"../python/")
