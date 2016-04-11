#!/usr/bin/env python

import glob
import os
from subprocess import call
path = "./src/backend/python/"

for filename in glob.glob(os.path.join(path,'*.py')):
    name = filename.rsplit('.', 1)[0]
    name = name.rsplit('/', 1)[1]
    if name != "__init__":
        call(["pydoc", "-w", name], cwd=r"./src/backend/python/")
        call(["mv", name+".html", "../../../target/docs"], cwd=r"./src/backend/python/")
