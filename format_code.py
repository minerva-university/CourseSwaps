import subprocess
import os


def format_code(paths):
    for path in paths:
        # Find Python files in the specified directory
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith(".py"):
                    file_path = os.path.join(root, file)
                    print(f"Formatting {file_path}")
                    # Run black to format the file
                    subprocess.run(["black", file_path])


if __name__ == "__main__":
    directories_to_format = ["./frontend", "./backend"]
    format_code(directories_to_format)
