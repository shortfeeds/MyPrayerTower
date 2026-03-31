import re
import os

schema_path = r'd:\Downloads\Antigravity\MyPrayerTower\packages\database\prisma\schema.prisma'

with open(schema_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern for models
# Finds 'model Name { ... }' and inserts '  @@schema("public")' before the last '}'
def add_schema(match):
    body = match.group(2)
    # Check if @@schema already exists
    if '@@schema' in body:
        return match.group(0)
    # Insert before the last closing brace
    return f"{match.group(1)} {{{body}  @@schema(\"public\")\n}}"

# Pattern for enums
def add_schema_enum(match):
    body = match.group(2)
    if '@@schema' in body:
        return match.group(0)
    return f"{match.group(1)} {{{body}  @@schema(\"public\")\n}}"

# Replace models
new_content = re.sub(r'(model\s+\w+)\s+\{((?:[^{}]|\{[^{}]*\})*)\}', add_schema, content)

# Replace enums
new_content = re.sub(r'(enum\s+\w+)\s+\{((?:[^{}]|\{[^{}]*\})*)\}', add_schema_enum, new_content)

with open(schema_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully added @@schema('public') to models and enums.")
