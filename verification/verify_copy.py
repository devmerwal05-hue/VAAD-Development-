from playwright.sync_api import sync_playwright, expect
import time
import os
import signal
import subprocess

def verify_contact_email_copy():
    # Start the dev server in the background
    proc = subprocess.Popen(["pnpm", "dev", "--port", "5173"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            # Grant clipboard permissions
            context = browser.new_context(
                viewport={'width': 1280, 'height': 800},
                permissions=['clipboard-read', 'clipboard-write']
            )
            page = context.new_page()

            # Wait for the dev server to be ready
            max_retries = 10
            for i in range(max_retries):
                try:
                    page.goto("http://localhost:5173/contact")
                    break
                except:
                    if i == max_retries - 1:
                        raise
                    time.sleep(2)

            # Select only the email in the main content section
            email_link = page.locator("#page-content").get_by_role("link", name="hello@vaad.dev")
            expect(email_link).to_be_visible()

            # Scroll to it
            email_link.scroll_into_view_if_needed()

            # Hover over the email to show the copy button
            email_link.hover()

            # Find the copy button
            copy_button = page.get_by_label("Copy email address")
            expect(copy_button).to_be_visible()

            # Click the copy button
            copy_button.click()

            # Wait for "Copied!" text to appear
            expect(page.get_by_text("Copied!")).to_be_visible()

            # Take a screenshot after clicking
            page.screenshot(path="verification/after_copy.png")

            browser.close()
    finally:
        # Kill the dev server
        os.kill(proc.pid, signal.SIGTERM)

if __name__ == "__main__":
    verify_contact_email_copy()
