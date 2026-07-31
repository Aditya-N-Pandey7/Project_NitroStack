import json
from config import OUTPUT_FILE


class DatasetWriter:

    def __init__(self):
        self.file = open(OUTPUT_FILE, "a")

    def save(self, packet):

        self.file.write(json.dumps(packet))
        self.file.write("\n")
        self.file.flush()

    def close(self):
        self.file.close()