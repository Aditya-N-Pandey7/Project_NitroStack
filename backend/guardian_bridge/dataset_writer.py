import json
from pathlib import Path


class DatasetWriter:

    def __init__(self, output_path):

        self.output_path = Path(output_path)

        self.output_path.parent.mkdir(parents=True, exist_ok=True)

        self.file = open(self.output_path, "a")

    def save(self, packet):

        self.file.write(json.dumps(packet) + "\n")

    def close(self):

        self.file.close()