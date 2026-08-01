import re


class CSIParser:

    @staticmethod
    def parse(line):

        try:

            # Serial returns bytes
            if isinstance(line, bytes):
                line = line.decode("utf-8", errors="ignore")

            line = line.strip()

            if not line.startswith("CSI_DATA"):
                return None

            # ----------------------------
            # Extract CSI values
            # ----------------------------

            match = re.search(r"\[(.*?)\]", line)

            if not match:
                return None

            csi = []

            for value in match.group(1).split(","):

                value = value.strip()

                if value == "":
                    continue

                try:
                    csi.append(int(value))
                except ValueError:
                    pass

            # ----------------------------
            # Remove CSI array
            # ----------------------------

            header = re.sub(r"\[.*?\]", "", line)

            header = header.replace('"', "")

            header = header.rstrip(",")

            parts = [p.strip() for p in header.split(",")]

            if len(parts) < 23:
                print("Incomplete packet:", len(parts))
                return None

            packet = {

                "packet_type": parts[0],

                "timestamp": int(parts[1]),

                "mac": parts[2],

                "rssi": int(parts[3]),

                "channel": int(parts[4]),

                "secondary_channel": int(parts[5]),

                "noise_floor": int(parts[14]),

                "agc_gain": int(parts[20]),

                "fft_gain": int(parts[22]),

                "csi": csi

            }

            return packet

        except Exception as e:

            print("Parser Error:", e)

            return None