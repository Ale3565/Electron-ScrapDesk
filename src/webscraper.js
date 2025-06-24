import puppeteer from 'puppeteer';
import XLSX from 'xlsx';
import os from 'os';

export async function scrapeData(searchTerm = 'lima') {
  try {
    // Lanza el navegador con Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      // Necesario para ejecutar Puppeteer en Electron
      executablePath: puppeteer.executablePath(),
    });

    const page = await browser.newPage();

    // Navega al sitio con el término de búsqueda
    const url = `https://urbania.pe/buscar/alquiler-de-casas?keyword=${encodeURIComponent(
      searchTerm
    )}`;
    await page.goto(url);

    // Espera que los resultados carguen
    await page.waitForSelector('.ListingBox__container');

    // Extrae los datos
    const data = await page.evaluate(() => {
      const listings = document.querySelectorAll('.ListingBox__container');
      const result = [];

      listings.forEach((listing) => {
        const title = listing.querySelector('.ListingBox__title')?.innerText || 'No Title';
        const price = listing.querySelector('.ListingBox__price')?.innerText || 'No Price';
        const location = listing.querySelector('.ListingBox__location')?.innerText || 'No Location';
        result.push({ title, price, location });
      });

      return result;
    });

    // Cierra el navegador
    await browser.close();

    // Guardar los resultados en un archivo Excel en el escritorio del usuario
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Listings');

    // Obtener la ruta del escritorio
    const desktopPath = os.homedir() + '\\Desktop';
    const filePath = `${desktopPath}\\urbania_listings.xlsx`;

    XLSX.writeFile(wb, filePath);
    return filePath;
  } catch (error) {
    console.error('Error en el scraping:', error);
    throw error;
  }
}
