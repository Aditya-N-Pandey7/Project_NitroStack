from runtime import GuardianRuntime


def main():

    runtime = GuardianRuntime()

    runtime.start("../../datasets/raw/test_session.jsonl")

    print("Guardian Bridge Started\n")

    try:

        while True:

            packet = runtime.process_packet()

            if packet:

                print(packet)

    except KeyboardInterrupt:

        print("\nStopping Guardian Bridge...")

    finally:

        runtime.stop()


if __name__ == "__main__":

    main()