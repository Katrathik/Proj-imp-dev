import os
import cohere
import re

# Specify the directory and filename
directory = r"C:/Users/Lenovo/Downloads"  # Use raw string literal

# Get all files in the directory
files = os.listdir(directory)

# Filter files that match the pattern "my-file (*)"
pattern = re.compile(r'my-file /((\d+)/)')
matching_files = [file for file in files if pattern.match(file)]

# If there are matching files, select the one with the highest number
if matching_files:
    max_number = max(int(pattern.match(file).group(1)) for file in matching_files)
    filename = f'my-file ({max_number})'
else:
    filename = 'my-file.txt'



file_path = os.path.join(directory, filename)

# Read text from the file
with open(file_path, 'r') as file:
    text_input = file.read()

# Initialize Cohere client
co = cohere.Client(api_key="your api key here")

# Construct message using the read text
message = f"""
Simplify the medical jargon into simple language (in layman’s terminology) below such that even an illiterate person understands, don't ask follow-ups.

When the user describes their condition, provide them with the health needs and self-care at home for such a condition. 
Also, identify the symptoms of a cardiac problem for early detection when they describe their condition.

The above two lines only apply if the user describes their condition; otherwise, do not provide answers for it.

{text_input}
"""

# Make the API call
response = co.chat(
    message=message,
    model="command-r-plus",
    temperature=0.3
)

print(response.text)

directory_1 = r"D:/coding/hackathons/hack4hearts/code"
# Write the response.text to a JavaScript file
js_file_path = os.path.join(directory_1, 'response.js')
with open(js_file_path, 'w') as js_file:
    js_file.write(f'const responseData = `{response.text}`;')

print("Response text has been written to response.js")
