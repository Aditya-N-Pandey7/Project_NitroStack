import re


class CSIParser:

    @staticmethod
    def parse(line):

        try:

            # -----------------------------
            # Extract CSI array
            # -----------------------------

            match = re.search(r'"\[(.*?)\]"', line)

            if not match:
                return None

            csi_string = match.group(1)

            csi = []

            for value in csi_string.split(","):

                value = value.strip()

                if value == "":
                    continue

                csi.append(int(value))

            # -----------------------------
            # Remove quoted CSI array
            # -----------------------------

            header = re.sub(r'"\[.*?\]"', "", line)

            header = header.rstrip(",")

            parts = header.split(",")

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