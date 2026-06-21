from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    # Homepage
    print("Loading homepage...")
    page.goto('http://localhost:3000', wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(5000)
    page.screenshot(path='E:/xiangmu/screenshot-home.png', full_page=False)
    print("Homepage screenshot saved")
    
    # Scroll down
    page.evaluate('window.scrollTo(0, 800)')
    page.wait_for_timeout(2000)
    page.screenshot(path='E:/xiangmu/screenshot-home-scroll.png', full_page=False)
    print("Scroll screenshot saved")
    
    browser.close()
    print("Done!")
