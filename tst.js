const puppeteer = require('puppeteer');

async function convertHTMLToPNG(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the viewport to a reasonable size
  await page.setViewport({ width: 1920, height: 1080 });

  // Set the HTML content of the page
  await page.setContent(html);

  // Wait for any additional rendering, if necessary
  await page.waitForTimeout(1000);

  // Capture a screenshot of the page as a PNG image
  const screenshot = await page.screenshot({ type: 'png' });

  await browser.close();

  return screenshot;
}

// Example usage
const htmlCode = req.body.html; // Assuming you have the HTML code in req.body.html

convertHTMLToPNG(htmlCode)
  .then((screenshot) => {
    // `screenshot` is a Buffer containing the PNG image data
    // You can save it to a file, send it as a response, etc.
    // For example, to save it to a file:
    const fs = require('fs');
    fs.writeFileSync('output.png', screenshot);
    console.log('PNG image saved!');
  })
  .catch((error) => {
    console.error('Error converting HTML to PNG:', error);
  });
