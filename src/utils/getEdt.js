//https://www.npmjs.com/package/puppeteer

const puppeteer = require("puppeteer");

module.exports = {
    /**
     * Retourne les infos de la journées
     * @param {Number} dayNumber le numéro de la journée
     */
    getEdt: async dayNumber => {
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: '/usr/bin/chromium-browser',
            args: ['--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setDefaultNavigationTimeout(0);

        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 1,
        });
        await page.goto('https://wayf.cesi.fr/login?service=https%3A%2F%2Fent.cesi.fr%2Fservlet%2Fcom.jsbsoft.jtf.core.SG%3FPROC%3DIDENTIFICATION_FRONT');

        // Première page avec le login
        await page.type('input[id=login]', process.env.LOGIN);

        const selector1 = 'a[id=submit]';
        await page.waitForSelector(selector1);
        await page.click(selector1);

        // Page suivante avec login + mdp
        await page.waitForNavigation();

        await page.type('input[id=passwordInput]', process.env.PASSWORD);

        const selector2 = 'span[id=submitButton]';
        await page.waitForSelector(selector2);
        await page.click(selector2);

        // Page d'accueil
        await page.waitForNavigation();

        await page.goto("https://ent.cesi.fr/mon-emploi-du-temps");

        // Page EDT

        //fc-content : Toute la div
        //fc-title : Nom du cours
        //fc-time : Heure
        //fc-salles : Numero de salle

        await page.waitForSelector(".fc-content");
        const res = await page.evaluate((dayNumber) => {
            const data = [];
            const day = document.querySelectorAll('.fc-event-container')[dayNumber - 1];
            const edtHtml = day.querySelectorAll('.fc-content');
            if(edtHtml.length == 0)
                return data;

            edtHtml.forEach(element => {
                const title = element.getElementsByClassName("fc-title")[0].textContent;
                const heure = element.getElementsByClassName("fc-time")[0].textContent;
                const salle = element.getElementsByClassName("fc-salles")[0].textContent;

                data.push({
                    title,
                    heure,
                    salle,
                });
            })
            return data;
        },dayNumber);
        return res;
    }
}