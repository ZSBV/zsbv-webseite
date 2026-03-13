import os
import re
from datetime import datetime, timedelta

def update_job_files():
    jobs_dir = "/Users/low/Desktop/ZSBV_WEBSEITE_UPLOAD/jobs"
    today = datetime.now().strftime("%Y-%m-%d")
    # Set validThrough to 60 days from now
    valid_through = (datetime.now() + timedelta(days=60)).strftime("%Y-%m-%dT23:59:59+01:00")
    
    if not os.path.exists(jobs_dir):
        print(f"Directory {jobs_dir} not found.")
        return

    updated_count = 0
    
    for filename in os.listdir(jobs_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(jobs_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            # Update datePosted
            new_content = re.sub(
                r'("datePosted":\s*")\d{4}-\d{2}-\d{2}(")',
                r'\g<1>' + today + r'\g<2>',
                content
            )
            
            # Update date in the visible text (published date)
            new_content = re.sub(
                r'(Ver&#246;ffentlicht:\s*)\d{4}-\d{2}-\d{2}',
                r'\g<1>' + today,
                new_content
            )
            
            # Update validThrough (optional but good for Google)
            new_content = re.sub(
                r'("validThrough":\s*")\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}(")',
                r'\g<1>' + valid_through + r'\g<2>',
                new_content
            )

            if new_content != content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                updated_count += 1

    print(f"Updated {updated_count} job files with date {today}.")

if __name__ == "__main__":
    # For local testing, ensure the path exists. 
    # The GitHub action will use a relative path or environment variable.
    update_job_files()
