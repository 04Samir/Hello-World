"""
Gathering All Routers
"""

import importlib
import os


current_dir = os.path.dirname(__file__)

routers = []
for file_name in os.listdir(current_dir):
    if file_name.endswith(".py") and not file_name.startswith("_"):
        module_name = file_name[:-3] 
        module = importlib.import_module(f".{module_name}", __package__)
        routers.append(module.router)
